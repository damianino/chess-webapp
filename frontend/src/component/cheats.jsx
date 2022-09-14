import axios from "axios";
import { Fragment, useState } from "react";
import { gameSettingsStore } from "../stores/store";

const Cheats = () => {
    const [fen, setFen] = useState("K6k/8/8/8/8/8/p7/1r6");

    const cheat = (fen) => {
        if (fen === "") return
        console.log("setting fen to " + fen)
        axios.post("http://127.0.0.1:8000/game/cheat", { 
            uuid: gameSettingsStore.gameSettings.uuid, 
            fen: fen 
        }).then(()=>{console.log("cheated successfully")})
    }

    return (
        <Fragment>
            <input id="fenField" value={fen} onChange={(e) => { setFen(e.target.value)}}></input> 
            <button onClick={()=>{cheat(fen)}}> setFen</button>
        </Fragment>
    )
}

export default Cheats;