import React from "react";
import PlacemarkForm from "./PlacemarkForm";
import closeIcon from '../../img/free-icon-close-4013407.png'
const ModalPlacemarkWrapper = ({coordinates, onClose}) => {
    const handleClose = (e) => {
        const target = e.target;
        const current = e.currentTarget;
        if (target === current) {
            onClose()
        }
    }

    return(
        <div onClick={handleClose} className="w-full flex h-screen top-0 right-0 bg-overlay absolute z-40 flex justify-center items-center">
            {/* overlay - сделать слой на весь экран (bg-trans)  (закроет все дымкой) */}
            <div className="w-full rounded-md shadow-lg max-w-md h-[450px] px-[25px] py-[20px] bg-[#ffff]">
                {/* само окно */}
                <header className="flex justify-end">
                    <button className="p-[5px] text-navbar font-xl bg-[#ffff] flex justify-center leading-none w-[25px] h-[25px] items-center hover:rounded-full hover:text-[#ffff] hover:bg-[#54545426]" onClick={onClose}>
                        <img src={closeIcon}/>
                    </button>
                </header>
                <PlacemarkForm coordinates={coordinates} onClose={onClose}/>
            </div>
        </div>
    )
}
 


export default ModalPlacemarkWrapper;