from django.urls import path,include
from . import views

urlpatterns = [
    path('',views.lobby),
    path('room/',views.room),
    path('get_token/',views.getToken),
]
