from django.shortcuts import render, get_object_or_404
from .models import Plumas


def pluma_list(request):
    lista_plumas = Plumas.objects.order_by('marca')
    return render(request, 'tienda/plumas_list.html',{'plumas' : lista_plumas})

def pluma_detail(request, pk):
    pluma = get_object_or_404(Plumas, pk=pk)
    print("Pluma -->", pluma)
    return render(request, 'tienda/pluma_detail.html', {'pluma': pluma})

def pedido(request):
    if (request.method == "POST"):
        form = pedidoForm(request.POST)
        if (form.is_valid()):
            pedido = form.save(commit=False)
            pedido.save()
    else:
        form = pedidoForm()

    return render(request, 'tienda/pedido.html', {'form': form})

def pluma_serializer(pluma):
    return {'marca': pluma.marca, 'precio': pluma.precio}

def cupon_detail(request, pk):
    pluma = get_object_or_404(Cupon, pk=pk)
    return render(request, 'tienda/cupon_detail.html', {'cupon': cupon})

def codigo_serializer(codigo):
    return {'codigo': codigo.codigo, 'descuento': codigo.descuento}

def search(request):
    marca = request.GET.get('marca')
    plumas = Plumas.objects.filter(marca__startswith=marca)
    busqueda = 1
    valido = 0
    return render(request, 'tienda/plumas_list.html', {'plumas': plumas, 'busqueda': busqueda, 'valido': valido})

def searchCodigo(request):

    codi = request.GET.get('codigo')
    codigos = Cupon.objects.filter(codigo__startswith=codi)
    valido = 1
    return render(request, 'tienda/plumas_list.html', {'codigos': codigos, 'valido': valido})
