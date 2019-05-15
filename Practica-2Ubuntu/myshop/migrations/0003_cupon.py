# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myshop', '0002_pedido'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cupon',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('codigo', models.CharField(max_length=200)),
                ('descuento', models.CharField(max_length=200)),
            ],
        ),
    ]
