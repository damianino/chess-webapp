import React from "react";
import styled from "styled-components";
import { Piece } from "@chessire/pieces";

const Square = styled.div`
    margin: 0;
    display: flex;
    justify-content: center;
    width:70px;
    height: 70px;
    background-color: ${props => props.squareColor == "white" ? "rgb(240, 217, 181)" : "rgb(181, 136, 99)"};
`
const Row = styled.div`
    display:flex;
`


const PromotionSelector = ({ color , makeMove, promotionMove, setClientMove, setPromotionIsOpen}) => {
    return (
        <>
            <Row>
                <Square squareColor={"white"}>
                    <Piece onClick={()=>{makeMove(...promotionMove, "q"); setClientMove([...promotionMove, "q"]); setPromotionIsOpen(false)}} piece={"Q"} color={color} width={"90%"} />
                </Square>
                <Square squareColor={"black"}>
                    <Piece onClick={()=>{makeMove(...promotionMove, "r"); setClientMove([...promotionMove, "r"]); setPromotionIsOpen(false)}} piece={"R"} color={color} width={"90%"} />
                </Square>
            </Row>
            <Row>
                <Square squareColor={"black"}>
                    <Piece onClick={()=>{makeMove(...promotionMove, "b"); setClientMove([...promotionMove, "b"]); setPromotionIsOpen(false)}} piece={"B"} color={color} width={"90%"} />
                </Square>
                <Square squareColor={"white"}>
                    <Piece onClick={()=>{makeMove(...promotionMove, "n"); setClientMove([...promotionMove, "n"]); setPromotionIsOpen(false)}} piece={"N"} color={color} width={"90%"} />
                </Square>
            </Row>
        </>

    )
}

export default PromotionSelector;