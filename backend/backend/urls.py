"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include
from chat.views import MessagesAPIView, AuthApiView, MessageReceviedAPIView, MessageSeenAPIView
from .settings import STATIC_URL, STATIC_ROOT

urlpatterns = [
    # path('admin/', admin.site.urls),
    # TODO use one for both / and no /
    path('messages/', MessagesAPIView.as_view()),
    path('received/', MessageReceviedAPIView.as_view()),
    path('seen/', MessageSeenAPIView.as_view()),
    path('auth/', AuthApiView.as_view()),
] + static(STATIC_URL, document_root=STATIC_ROOT)
