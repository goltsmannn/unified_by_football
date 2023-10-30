import React from "react";
import { createPortal } from "react-dom";
import prepareBalloonData from "utils/BalloonData";
import Balloon from "./Balloon";
import { useEffect } from "react";


const Portal = ({placemark, onClose}) => {
    const element = <Balloon 
        placemark_id={placemark.id}
        data={prepareBalloonData(placemark)}
        onClose={onClose}
    />;
    const mount = document.getElementById('placemark_balloon');
    const temporaryElement = document.createElement('div');

    useEffect(() => {
        // добавляем свой див к искомому элементу
        if (mount) mount.appendChild(temporaryElement)
        return () => {
            // удаляем элемент от искомого при завершении компоненты
            if (mount) mount.removeChild(temporaryElement)
        }
    }, [ temporaryElement, mount ])


    if(!mount) return null;
    return createPortal(element, temporaryElement);
}

export default Portal;