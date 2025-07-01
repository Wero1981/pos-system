from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomerUser(AbstractUser):
    """
    Custom user model that extends the default Django user model.
    """
    # You can add additional fields here if needed
    # For example, you might want to add a phone number or address
    birthdate = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    def __str__(self):
        return self.username  # or any other field you prefer to represent the user