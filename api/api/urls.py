from django.urls import path, include
from . import views

urlpatterns = [
    path('connect_udp', views.udpConnect, name='main'),
    path('test', views.test, name='test')
]
