import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import axios from "axios";
// import Modal from "./Modal"
import Modal from 'react-bootstrap/Modal';
import PromotionSelector from "./PromotionSelector";
import EndGame from "./EndGame";
import { gameSettingsStore } from "../stores/store";
import { useNavigate } from "react-router-dom";


const Game = () => {
    const [game, setGame] = useState(new Chess());
    const [clientMove, setClientMove] = useState([])
    const [promotionMove, setPromotionMove] = useState([])
    const [promotionIsOpen, setPromotionIsOpen] = useState(false);
    const [endGameIsOpen, setEndGameIsOpen] = useState(false)
    const [gameResult, setGameResult] = useState("")

    const navigate = useNavigate();

    useEffect(() => {
        if (gameSettingsStore.gameSettings.uuid == "") {
            navigate("/");
            return;
        }
        syncBoard();
    }, []);

    useEffect(() => {
        switch (true) {
            case game.in_checkmate():
                setGameResult(game.turn() === "w" ? "black" : "white");
                break;

            case game.in_draw():
                setGameResult("draw");
                break;
            
            case game.in_stalemate():
                console.log("stalemate");
                setGameResult("stalemate");
                break;
            default:
                console.log("game changed");
        }
    }, [game])

    useEffect(() => {
        if (gameResult === "") return;
        setEndGameIsOpen(true);
    }, [gameResult])

    useEffect(() => {
        console.log("useEffect: clientMove", clientMove);
        if (clientMove.length === 0) return;
        postMove(...clientMove)
    }, [clientMove])

    useEffect(() => {
        console.log("useEffect: promotionMove", promotionMove);
        if (promotionMove.length === 0) return;
        setPromotionIsOpen(true);
    }, [promotionMove]);

    const syncBoard = async () => {
        const res = await axios.get("http://127.0.0.1:8000/game/details/" + gameSettingsStore.gameSettings.uuid);
        const data = await res.data;
        setGame(Chess(data.fen))
        if (data.first_move) {
            setTimeout(() => {
                safeGameMutate((game) => {
                    game.move(parseUci(data.first_move));
                });
            }, 0);
        }
    }

    const postMove = async (from, to, promotion) => {
        console.log("postMove", [from, to, promotion]);
        const res = await axios.post("http://127.0.0.1:8000/game/move", {
            uci: from + to + promotion,
            uuid: gameSettingsStore.gameSettings.uuid,
        })
        const data = await res.data;
        console.log("recidved data: ", data)
        if (data.OK === 0) {
            setGame(Chess(data.fen))
            return
        }
        setTimeout(() => {
            safeGameMutate((game) => {
                game.move(parseUci(data.uci));
            });
        }, 0);
    }

    const parseUci = (uci) => {
        const from = uci.slice(0, 2)
        const to = uci.slice(2, 4)
        const promotion = uci.slice(4, 5)
        return { from: from, to: to, promotion: promotion || "" }
    }

    function safeGameMutate(modify) {
        setGame((g) => {
            const update = { ...g };
            modify(update);
            return update;
        });
    }

    const makeMove = (fromSquare, toSquare, promotionPiece) => {
        console.log("MakeMove", [fromSquare, toSquare, promotionPiece]);
        let move = null;
        safeGameMutate((game) => {
            move = game.move({
                from: fromSquare,
                to: toSquare,
                promotion: promotionPiece || "",
            });
        });

        if (move === null) return false; // illegal move
        return true;
    }

    const onDrop = (fromSquare, toSquare, piece) => {
        if (gameSettingsStore.gameSettings.side[0] !== game.turn()) return false;
        makeMove(fromSquare, toSquare)
        if ((piece === 'wP' && toSquare.includes(8)) ||
            (piece === 'bP' && toSquare.includes(1))) {
            setPromotionMove([fromSquare, toSquare])
            return false;
        }
        setClientMove([fromSquare, toSquare, ""])

        return true;
    }

    return (
        <>
            <Chessboard
                position={game.fen()}
                boardOrientation={gameSettingsStore.gameSettings.side}
                onPieceDrop={onDrop}
            />
            <Modal show={promotionIsOpen}>
                <PromotionSelector
                    color={gameSettingsStore.gameSettings.side}
                    makeMove={makeMove}
                    promotionMove={promotionMove}
                    setClientMove={setClientMove}
                    setPromotionIsOpen={setPromotionIsOpen}
                />
            </Modal>
            <Modal show={endGameIsOpen}>
                <EndGame 
                    side={gameSettingsStore.gameSettings.side}
                    gameResult={gameResult}
                    setEndGameIsOpen={setEndGameIsOpen}
                />
            </Modal>
        </>
    );
}

export default Game;