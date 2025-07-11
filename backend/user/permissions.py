from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """
    Permiso personalizado que permite el acceso solo a usuarios administradores.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_staff
class IsMesero(BasePermission):
    """
    Permiso personalizado que permite el acceso solo a usuarios meseros.
    """

    def has_permission(self, request, view):
        return request.user and request.user.rol == 'mesero'
class IsCajero(BasePermission):
    """
    Permiso personalizado que permite el acceso solo a usuarios cajeros.
    """

    def has_permission(self, request, view):
        return request.user and request.user.rol == 'cajero'
class IsAlmacenista(BasePermission):
    """
    Permiso personalizado que permite el acceso solo a usuarios almacenistas.
    """

    def has_permission(self, request, view):
        return request.user and request.user.rol == 'almacenista'
class IsVendedor(BasePermission):
    """
    Permiso personalizado que permite el acceso solo a usuarios vendedores.
    """

    def has_permission(self, request, view):
        return request.user and request.user.rol == 'vendedor'
class IsCotador(BasePermission):
    """
    Permiso personalizado que permite el acceso solo a usuarios cotadores.
    """

    def has_permission(self, request, view):
        return request.user and request.user.rol == 'cotador'