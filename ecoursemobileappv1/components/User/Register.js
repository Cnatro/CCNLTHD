import { Image, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, HelperText, Text, TextInput } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";
import Apis, { endpoints } from "../../configs/Apis";

const Register = () => {
    const info = [{
        label: 'Tên',
        icon: "text",
        secureTextEntry: false,
        field: "first_name"
    }, {
        label: 'Họ và tên lót',
        icon: "text",
        secureTextEntry: false,
        field: "last_name"
    }, {
        label: 'Tên đăng nhập',
        icon: "text",
        secureTextEntry: false,
        field: "username"
    }, {
        label: 'Mật khẩu',
        icon: "eye",
        secureTextEntry: true,
        field: "password"
    }, {
        label: 'Xác nhận mật khẩu',
        icon: "eye",
        secureTextEntry: true,
        field: "confirm"
    }];

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const nav = useNavigation();


    const setState = (value, field) => {
        setUser({ ...user, [field]: value });
    };

    const pick = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled)
                setState(result.assets[0], "avatar");
        }
    };

    const validation = () => {

        for (let i of info) {
            if (!(i.field in user) || user[i.field] === '') {
                setMsg(`Vui lòng nhập ${i.label}`);
                return false;
            }
        }

        if (user.password !== user.confirm) {
            setMsg("Mật khẩu KHÔNG khớp!");
            return false;
        }

        setMsg(null);
        return true;
    };

    const register = async () => {

        if (validation() === true) {
            try {
                setLoading(true);

                let form = new FormData();
                for (let key in user) {
                    if (key != 'confirm') {
                        if (key === 'avatar' && user?.avatar !== null) {
                            form.append(key, {
                                uri: user.avatar.uri,
                                name: user.avatar.fileName,
                                type: user.avatar.type
                            });
                        } else {
                            form.append(key, user[key]);
                        }
                    }
                }

                await Apis.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (res.status === 201) {
                    nav.navigate("login");
                }
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <SafeAreaView style={[MyStyles.container, MyStyles.p]}>
            <Text style={MyStyles.subject}>Đăng kí</Text>
            <HelperText type="error" visible={msg}>
                {msg}
            </HelperText>
            <View>
                {info.map(i => <TextInput value={user[i.field]} onChangeText={t => setState(t, i.field)} style={MyStyles.m} key={`${i.field}${i.label}`} label={i.label} secureTextEntry={i.secureTextEntry} right={<TextInput.Icon icon={i.icon} />} />)}
            </View>
            <TouchableOpacity style={MyStyles.m} onPress={pick}>
                <Text>Chọn ảnh đại diện</Text>
            </TouchableOpacity>
            {user?.avatar && <Image style={[MyStyles.avatar, MyStyles.m]} source={{ uri: user.avatar.uri }} />}
            <Button disabled={loading} loading={loading} onPress={register} mode="contained">Đăng ký</Button>
        </SafeAreaView>
    );
}


export default Register;