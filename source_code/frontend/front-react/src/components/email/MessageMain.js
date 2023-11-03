import React from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";


const MessageMain = () => {
    const location = useLocation();
    console.log(location.pathname);
    return(
        <div id="message-page" className="flex  h-[calc(100vh-56px)] items-start justify-center">
                <div className="w-full max-w-md">
                    <div id="outlet-block">
                        <Outlet></Outlet>
                    </div>
                </div>
        </div>
    )
}

export default MessageMain;