import {useNavigate} from 'react-router-dom';
import axios from "axios";
import { observer } from 'mobx-react';
import {Container, ButtonGroup, Button} from "react-bootstrap";
import { gameSettingsStore } from '../stores/store';


const StartPage = observer(() => {

    const navigate = useNavigate();
    
    const handleStartGame = async () =>{
        const res = await postStartGame()
        if (!res) {return}
        navigate("/game");
    }

    const postStartGame = async () => {
        const res = await axios.post("http://127.0.0.1:8000/game/start", gameSettingsStore.getPostData());
        const data = await res.data;
        if (data.OK === 0) {
            console.log(data.error)
            return false
        }
        console.log(data.uuid)
        gameSettingsStore.setUuid(data.uuid)
        return true
    }

    return (
        <Container>
            <h1>Configure game</h1>
            <ButtonGroup size="lg" className="mb-2">
                <Button onClick={()=>{gameSettingsStore.setSide("white")}}>White</Button>
                <Button onClick={
                    ()=>{
                        const side = Math.round(Math.random()) ? "white" : "black";
                        gameSettingsStore.setSide(side)
                    }
                }>Random</Button>
                <Button onClick={()=>{gameSettingsStore.setSide( "black")}}>Black</Button>
            </ButtonGroup>
            <input
            name="ELO"
            type="number"
            value={gameSettingsStore.gameSettings.elo}
            onChange={(e)=>{gameSettingsStore.setElo(parseInt(e.target.value))}} />
            <Button onClick={()=>{console.log(gameSettingsStore.gameSettings)}}>Test</Button>
            <Button onClick={handleStartGame}>Start</Button>
        </Container>
    )
})

export default StartPage;