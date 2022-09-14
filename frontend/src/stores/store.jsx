import {makeObservable, observable, action } from "mobx";

class GameSettingsStoreImpl {
    gameSettings = {
        uuid: "",
        side: "white",
        elo: 1500,
    }

    constructor(){
        makeObservable(this, {
                gameSettings: observable,
                setUuid: action,
                setSide: action,
                setElo: action,
        });
    }

    getPostData(){
        return{
            side: this.gameSettings.side,
            elo: this.gameSettings.elo
        }
    }

    setUuid(uuid){
        this.gameSettings.uuid = uuid
    }
    setSide(side){
        this.gameSettings.side = side
    }

    setElo(elo){
        this.gameSettings.elo = elo
    }
}

export const gameSettingsStore = new GameSettingsStoreImpl();