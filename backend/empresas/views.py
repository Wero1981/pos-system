from django.http import JsonResponse
from empresas.models import Empresa

def get_empresa(request):
    """
    View de todas las empresas
    """
    empresas =  Empresa.objects.all()

    data = []
    for element in empresas:
        data.append({
            'id': element.id,
            'nombre': element.nombre,
            'rfc': element.rfc,
            'direccion': element.direccion,
            'telefono': element.telefono,
            'correo_electronico': element.correo_electronico,
            'fecha_registro': element.fecha_registro.strftime('%Y-%m-%d %H:%M:%S'),
        })

    return JsonResponse(data, safe=False, status=200)