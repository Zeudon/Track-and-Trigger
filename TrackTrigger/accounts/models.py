from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver
# Create your models here.

class MyProfileManager(BaseUserManager):
    def create_user(self, username, email, phone_no='', first_name='', last_name='', password=None):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("User must have a username")
        if not phone_no:
            raise ValueError("User must have phone number")
        if not first_name:
            raise ValueError("User must have First Name")
        if not last_name:
            raise ValueError("User must have Last Name")

        user = self.model(
            email=self.normalize_email(email),
            username = username,
            phone_no = phone_no,
            first_name = first_name,
            last_name = last_name,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, phone_no, first_name, last_name, password):
        user = self.create_user(
            email=self.normalize_email(email),
            username = username,
            phone_no = phone_no,
            first_name = first_name,
            last_name = last_name,
            password = password
        )
        user.is_admin=True
        user.is_staff=True
        user.is_superuser=True
        user.save(using=self._db)
        return user

class Profile(AbstractBaseUser):
    email = models.EmailField(verbose_name="email", max_length=60, unique=True)
    username = models.CharField(max_length=30, unique=True)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    last_login = models.DateTimeField(verbose_name='last login', auto_now=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuse = models.BooleanField(default=False)
    first_name = models.CharField(max_length=30, default='')
    last_name = models.CharField(max_length=30, default='')
    phone_no = models.CharField(max_length=10, unique=True, default='')

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = MyProfileManager()

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True
