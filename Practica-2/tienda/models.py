from django.db import models
from django.utils import timezone

class Plumas(models.Model):
    marca = models.CharField(max_length=200)
    precio = models.CharField(max_length=200)
    created_date = models.DateTimeField(
    default=timezone.now)

    def publish(self):
        self.published_date = timezone.now()
        self.save()
    def carro(self):
    	self.published_date = timezone.now()
    	self.saveCarro()

    def __str__(self):
        return self.marca

class Pedido(models.Model):
	lista_pedido = []

	def guardar(self):
		self.lista_pedido.append()

class Cupon(models.Model):
    codigo = models.CharField(max_length=200)
    descuento = models.CharField(max_length=200)

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.codigo
