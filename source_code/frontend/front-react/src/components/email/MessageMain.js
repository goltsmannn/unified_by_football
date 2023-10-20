import React from "react";
import { Outlet } from "react-router-dom";


const MessageMain = () => {
    return(
        <div id="message-page">
            <div id="outlet-block">
                <Outlet></Outlet>
            </div>
        </div>
    )
}

export default MessageMain;