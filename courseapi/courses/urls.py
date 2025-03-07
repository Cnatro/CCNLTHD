from django.contrib import admin
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('categories',views.CategoryViewSet, basename='category')
router.register('course',views.CourseViewSet, basename='course')
router.register('lesson',views.LessonViewSet, basename='lesson')

urlpatterns = [
    path('', include(router.urls)),
]