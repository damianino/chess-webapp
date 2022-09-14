import react from "react";
import styled from "styled-components";
import PromotionSelector from "./PromotionSelector";

const Modal = ({children, showModal, setShowModal}) => {
    return (
        <>
            {showModal ? children : null}
        </>
    );
}

export default Modal