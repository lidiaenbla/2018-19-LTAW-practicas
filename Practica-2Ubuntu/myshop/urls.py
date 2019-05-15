from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^$', views.pluma_list),
    url(r'^pluma/(?P<pk>[0-9]+)/$', views.pluma_detail, name='pluma_detail'),
    url(r'^cupon/(?P<pk>[0-9]+)/$', views.cupon_detail, name='cupon_detail'),
    url(r'^pedido/new/$', views.pedido, name='pedido'),
    url(r'^search$', views.search, name='search'),
    url(r'^searchCodigo$', views.searchCodigo, name='searchCodigo'),
]
