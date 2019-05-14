from django.urls import path
from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^$', views.pluma_list),
    url(r'^pluma/(?P<pk>[0-9]+)/$', views.pluma_detail, name='pluma_detail'),
    url(r'^search$', views.search, name='search'),
    url(r'^searchCodigo$', views.searchCodigo, name='searchCodigo'),
]
