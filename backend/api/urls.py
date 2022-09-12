from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.getRoutes, name='routes'),
    path('start', views.postGameStart, name='gameStart'),
    path('move', views.postMove, name='gameMove'),
    path('details/<slug:game_uuid>', views.getDetails, name="gameDetails"),
    
    path('cheat', views.postCheat, name='gameCheat'),
]