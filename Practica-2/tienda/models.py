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
