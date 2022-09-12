from django.db import models

class Game(models.Model):
    uuid = models.CharField(max_length=36)
    side = models.CharField(max_length=5, default="white")
    elo = models.IntegerField(default=1500)
    fen = models.CharField(max_length=100)

    @classmethod
    def create(cls, uuid, side, elo, fen):
        book = cls(uuid=uuid, side=side, elo=elo, fen=fen)
        return book


class GameSettings(models.Model):
    side = models.CharField(max_length=5, default="white")
    elo = models.IntegerField(default=1500)

class Move(models.Model):
    uci = models.CharField(max_length=5)
    uuid = models.CharField(max_length=36)

class Cheat(models.Model):
    uuid = models.CharField(max_length=36)
    fen = models.CharField(max_length=100)