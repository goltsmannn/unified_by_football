import React from "react";
import PlacemarkForm from "./PlacemarkForm";

const ModalPlacemarkWrapper = ({coordinates, onClose}) => {
    return(
        <div className="overlay">
            {/* overlay - сделать слой на весь экран (bg-trans)  (закроет все дымкой) */}
            <div className="modal">
                {/* само окно */}
                <header>
                    <button onClick={onClose}>Закрыть окно</button>
                </header>
                <PlacemarkForm coordinates={coordinates} onClose={onClose}/>
            </div>
        </div>
    )
}
 


export default ModalPlacemarkWrapper;