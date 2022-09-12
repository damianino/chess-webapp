from rest_framework import serializers

from api.models import Cheat, Move
from api.models import GameSettings

class GameSettingsSerializer(serializers.Serializer):
    side = serializers.CharField()
    elo = serializers.IntegerField()

    def create(self):
        return GameSettings(**self.validated_data)

class MoveSerializer(serializers.Serializer):
    uci = serializers.CharField()
    uuid = serializers.CharField(max_length=36)

    def create(self):
        return Move(**self.validated_data)

class CheatSerializer(serializers.Serializer):
    fen = serializers.CharField()
    uuid = serializers.CharField()

    def create(self):
        return Cheat(**self.validated_data)

