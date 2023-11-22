import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";


const UnloggedUserUpperMenu = () => {
    return (
        <>
        <nav className="bg-navbar flex justify-end">
        <ul className="flex justify-between w-full max-w-[760px] text-[#ffff] items-center py-4 px-10">
                <li>
                    <NavLink className={({ isActive }) => isActive ? "border border-solid border-[#24e3e3] border-[3px] rounded-lg px-2 py-1" : ""} to="/">Map</NavLink>
                </li>
                <li>
                    <NavLink className={({ isActive }) => isActive ? "text-red" : ""} to="register">Sign up</NavLink>
                </li>
                <li>
                    <NavLink to="login">Log in</NavLink>
                </li>
            </ul>
        </nav>
        </>
    );
}

export default UnloggedUserUpperMenu;