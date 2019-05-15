from django.shortcuts import render
from django.shortcuts import render
from .models import Plumas, Pedido, Cupon
from django.shortcuts import render, get_object_or_404
from .forms import pedidoForm
import json
# Create your views here.

def pluma_list(request):
    lista_plumas = Plumas.objects.order_by('marca')
    return render(request, 'myshop/plumas_list.html',{'plumas' : lista_plumas})

def pluma_detail(request, pk):
    pluma = get_object_or_404(Plumas, pk=pk)
    return render(request, 'myshop/pluma_detail.html', {'pluma': pluma})
def cupon_detail(request, pk):
    pluma = get_object_or_404(Cupon, pk=pk)
    return render(request, 'myshop/cupon_detail.html', {'cupon': cupon})


def pedido(request):
    if (request.method == "POST"):
        form = pedidoForm(request.POST)
        if (form.is_valid()):
            pedido = form.save(commit=False)
            pedido.save()
    else:
        form = pedidoForm()

    return render(request, 'myshop/pedido.html', {'form': form})

def search(request):
    marca = request.GET.get('marca')
    plumas = Plumas.objects.filter(marca__startswith=marca)
    busqueda = 1
    valido = 0
    return render(request, 'myshop/plumas_list.html', {'plumas': plumas, 'busqueda': busqueda, 'valido': valido})

def pluma_serializer(pluma):
    return {'marca': pluma.marca, 'precio': pluma.precio}

def searchCodigo(request):

    codi = request.GET.get('codigo')
    codigos = Cupon.objects.filter(codigo__startswith=codi)
    valido = 1
    return render(request, 'myshop/plumas_list.html', {'codigos': codigos, 'valido': valido})

def codigo_serializer(codigo):
    return {'codigo': codigo.codigo, 'descuento': codigo.descuento}
