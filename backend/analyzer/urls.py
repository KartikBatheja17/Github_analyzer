from django.urls import path
from .views import analyze_profile

urlpatterns = [
    path('analyze/<str:username>/', analyze_profile),
]