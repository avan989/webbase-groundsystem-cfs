from django.urls import path, include
from . import views

urlpatterns = [
    path('connect_udp', views.udpConnect, name='main'),
    path('no_parm_command', views.noParameterCommand, name='No Parameter Command'),
    path('custom_command_no_param', views.customCommandNoParameter),
    path('command_with_parm', views.commandWithParmeters),
    path('command_api', views.commandAPI),
    path('test', views.test, name='test')
]
