from rest_framework import permissions

class RolPermission(permissions.BasePermission):
    """
    Permiso personalizado que permite el acceso basado en el rol del usuario.
    """
    #definir permisos por rol y tipo accion
    permisos_por_rol = {
        'admin_system': ['list', 'create', 'retrieve', 'update', 'partial_update', 'destroy'],
        'admin_empresa': ['list', 'create', 'retrieve', 'update', 'partial_update', 'destroy'],
        'admin_sucursal': ['list', 'create', 'retrieve', 'update', 'partial_update', 'destroy'],
        'vendedor': ['list', 'retrieve', 'create'],
        'cotador_empresa': ['list', 'retrieve', 'create'],
        'cotador_sucursal': ['list', 'retrieve', 'create'],
        'supervisor': ['list', 'retrieve'],
        'almacenista': ['list', 'retrieve', 'create', 'update', 'partial_update'],
        'mesero': ['list', 'retrieve', 'create'],
        'cajero': ['list', 'retrieve', 'create'],
        'cliente': ['list', 'retrieve'],
        'proveedor': ['list', 'retrieve'],
        'otro': ['list', 'retrieve'],
    }

    def has_permission(self, request, view):
        """
        Verifica si el usuario tiene permiso para la acción solicitada.
        """
        if not request.user or not request.user.is_authenticated:
            return False
        
        rol = getattr(request.user, 'rol', None)
        if rol is None:
            return False
        
        accion = getattr(view, 'action', None)
        
        return accion in self.permisos_por_rol.get(rol, [])

    def has_object_permission(self, request, view, obj):
        """
        Limitar acceso a objetos según empresa y sucursal.
        """
        rol = getattr(request.user, "rol", None)

        if rol in ["admin_system"]:
            return True  # Acceso total

        # Admin de empresa: solo objetos de su empresa
        if rol == "admin_empresa":
            return getattr(obj, "empresa", None) == request.user.empresa

        # Admin de sucursal, vendedores, cajeros, meseros, almacenistas: solo objetos de su sucursal
        if rol in ["admin_sucursal", "vendedor", "cajero", "mesero", "almacenista", "cotador_sucursal", "supervisor"]:
            return getattr(obj, "sucursal", None) == request.user.sucursal

        # Cotador empresa: objetos de su empresa
        if rol == "cotador_empresa":
            return getattr(obj, "empresa", None) == request.user.empresa

        # Cliente y proveedor: puede restringirse a sus propios objetos
        if rol in ["cliente", "proveedor"]:
            return getattr(obj, "id", None) == request.user.id

        return False