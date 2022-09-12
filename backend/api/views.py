import random
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from stockfish import Stockfish
from django.core.cache import cache
import redis
import pickle

import chess
import uuid

from api.models import Game
from api.serializer import CheatSerializer, GameSettingsSerializer, GameSettingsSerializer, MoveSerializer


redis_instance = redis.StrictRedis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0)

stockfish = Stockfish(path="C:\\Users\\lemonhead\\Documents\\Projects\\WEB-Chess\\backend\\stockfish_15_x64_avx2.exe")

@api_view(['GET'])
def getRoutes(request):

    routes = [
        {
            'Endpoint' : '/home/',
            'method' : 'GET',
            'body' : None,
            'description' : 'Chess app startpage with game config',
        },
        {
            'Endpoint' : '/game/start/',
            'method' : 'POST',
            'body' : {'body': ""},
            'description' : 'Start a chess game',
        },
        {
            'Endpoint' : '/game/move/',
            'method' : 'POST',
            'body' : {'body':""},
            'description' : 'Make a move',
        },
    ]

    return Response(routes)

@api_view(['POST'])
def postGameStart(request):
    data = request.data
    serializer = GameSettingsSerializer(data = data)

    if not serializer.is_valid():
        return Response({"OK":0, "error": serializer.errors})

    gameSettings = serializer.create()

    game = Game.create(
        uuid = str(uuid.uuid4()),
        side = gameSettings.side,
        elo = gameSettings.elo,
        fen = chess.Board().fen()
    )

    first_move = ""
    if game.side == "black":
        board = chess.Board()
        stockfish.set_fen_position(board.fen())
        first_move = stockfish.get_best_move()
        board.push_san(first_move)
        game.fen = board.fen()

    pickledGame = pickle.dumps(game)

    redis_instance.set(game.uuid, pickledGame)

    return Response({"board": game.fen, "uuid": game.uuid, "first_move": first_move})

@api_view(['POST'])
def postMove(request):
    data = request.data
    serializer = MoveSerializer(data = data)
    
    if not serializer.is_valid():
        return Response({"OK":0, "error": serializer.errors})

    move_request = serializer.create()

    pickled_game = redis_instance.get(move_request.uuid)

    if not pickled_game:
        return Response({"OK":0, "fen": chess.Board().fen(), "error": "game does not exist"})
    
    game = pickle.loads(pickled_game)

    board = chess.Board(fen=game.fen)
    move = chess.Move.from_uci(move_request.uci)
    
    if move not in board.legal_moves:
        return Response({"OK":0, "fen": board.fen(), "error": "illegal move"})
    board.push(move)

    if (list(board.legal_moves) == []): 
        return Response({"OK":1, "uci": ""})

    stockfish.set_fen_position(board.fen())
    stockfish.set_elo_rating(game.elo)
    move = stockfish.get_best_move()
    board.push_san(move)
    game.fen = board.fen()
    redis_instance.set(move_request.uuid, pickle.dumps(game))

    return Response({"OK":1, "fen": board.fen(), "uci": move})

@api_view(['GET'])
def getDetails(request, game_uuid):
    pickled_game = redis_instance.get(game_uuid)
    if not pickled_game:
        return Response({"OK": 0, "error": "game does not exist"})

    game = pickle.loads(pickled_game)

    return Response({"OK": 1, "fen": game.fen, "side": game.side, "elo": game.elo})

@api_view(['POST'])
def postCheat(request):
    data = request.data
    serializer = CheatSerializer(data = data)
    
    if not serializer.is_valid():
        return Response({"OK":0, "error": serializer.errors})

    cheat = serializer.create()

    pickled_game = redis_instance.get(cheat.uuid)
    game = pickle.loads(pickled_game)

    game.fen= cheat.fen

    pickled_game = pickle.dumps(game)
    redis_instance.set(cheat.uuid, pickled_game)

    return Response({"OK": 1})