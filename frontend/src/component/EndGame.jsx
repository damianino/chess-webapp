import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Win = styled.h1`
    text-color: green;
`
const Loss = styled.h1`
    text-color: red
`
const Draw = styled.h1`
    text-color: gray
`

const EndGame = ({ gameResult, side, setEndGameIsOpen }) => {
    const navigate = useNavigate()
    let res;
    switch (gameResult) {
        case "draw":
            res = (<Draw>Draw</Draw>);
            break;

        case "stalemate":
            res = (<Draw>Stalemate</Draw>);
            break;
        
        default:
            if (gameResult == side){
                res = (<Win>Win</Win>);
            } else{
                res = (<Loss>Loss</Loss>);
            }
            break;
    }
    return (
        <Fragment>
            {res}
            <button onClick={()=>{setEndGameIsOpen(false)}}>OK</button>
            <button onClick={()=>{navigate("/")}}>Start Page</button>
        </Fragment>
    )
}

export default EndGame;