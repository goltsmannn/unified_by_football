import React from "react";
import { useNavigate } from "react-router-dom";

const NavigateButton = ( { buttonText, route, isReplaced}) => {
    const navigate = useNavigate();
    return (
        <button 
            onClick = { () => { 
                navigate( route , {replace:isReplaced} )
            }}
        >
        {buttonText}
        </button>
    );
}

export default NavigateButton;