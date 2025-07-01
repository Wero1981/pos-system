from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from user.models import CustomerUser
# Register your models here.

class CustomUserAdmin(UserAdmin):
    model = CustomerUser
    list_display = ('username', 'is_staff', 'is_active', 'email', 'first_name', 'last_name')
    fieldsets = UserAdmin.fieldsets + (
        ("Additional Info", {
            'fields': ('birthdate',)
        }),
    )

admin.site.register(CustomerUser, CustomUserAdmin)