from django import forms

from .models import Plumas

class pedidoForm(forms.ModelForm):

    class Meta:
        model = Plumas
        fields = ('marca','precio',)
