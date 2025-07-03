#from django.http import JsonResponse
from drf_yasg.utils import swagger_auto_schema

from rest_framework.decorators import api_view
from rest_framework.response import Response
from empresas.models import Empresa
from empresas.serializers import EmpresaSerializer

@swagger_auto_schema(methods=["POST"], request_body=EmpresaSerializer)
@api_view(['GET', 'POST'])
def get_empresa(request):
    """
    View de todas las empresas
    """
    if request.method == 'GET':
        empresas =  Empresa.objects.all()
        data = []
        # for element in empresas:
        #     data.append({
        #         'id': element.id,
        #         'nombre': element.nombre,
        #         'rfc': element.rfc,
        #         'direccion': element.direccion,
        #         'telefono': element.telefono,
        #         'correo_electronico': element.correo_electronico,
        #         'fecha_registro': element.fecha_registro.strftime('%Y-%m-%d %H:%M:%S'),
        #     })

        serializer = EmpresaSerializer(empresas, many=True)

        return Response(serializer.data, status=200)
    
    if request.method == 'POST':
        serializer = EmpresaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        
        return Response(serializer.errors, status=201)

    return Response({"error": "Method not allowed"}, status=405)

@swagger_auto_schema(methods=["PUT"], request_body=EmpresaSerializer)
@api_view(['PUT'])
def update_empresa(request, pk):
    """
    View para actualizar una empresa
    """
    try:
        empresa = Empresa.objects.get(pk=pk)
        serializer = EmpresaSerializer(empresa, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    except Empresa.DoesNotExist:
        return Response({"error": "Empresa no encontrada"}, status=404)

    