import AuthContext from "context/AuthContext";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";

const LoggedUserUpperMenu = () => {
    const authContext = useContext(AuthContext);
    const [isOpen, setIsOpen] = React.useState(false)

    const buttonRef = React.useRef()
    const menuRef = React.useRef()

    const toggleMenu = (e) => {
        setIsOpen(prev => !prev)
    }

    window.addEventListener('click', (e) => {
        const target = e.target;
        if (target !== menuRef.current && buttonRef.current !== target){
            setIsOpen(false)
        }
    })
    // const clickMenu = (e) => { 
    //     setIsOpen(false)
    // }

    return(
        <>
        <nav className="bg-navbar flex justify-end">
            <ul className="flex justify-between w-full max-w-[760px] text-[#ffff] items-center py-4 px-10">
                <li className="hover:font-medium">
                    <NavLink 
                        className={({ isActive }) => isActive ? "border border-solid border-[#24e3e3] border-[3px] rounded-lg px-2 py-1" : ""}
                        to="/"
                    >
                        Map
                    </NavLink>
                </li>

                <li className="hover:font-medium">
                    <NavLink 
                        className={({ isActive }) => isActive ? "border border-solid border-[#24e3e3] border-[3px] rounded-lg px-2 py-1" : ""}
                        to="search" 
                    >
                            Find User
                    </NavLink>
                </li>
                <li className="hover:font-medium">
                    <NavLink 
                        className={({ isActive }) => isActive ? "border border-solid border-[#24e3e3] border-[3px] rounded-lg px-2 py-1" : ""}
                        to="message" 
                    >
                        Mail
                    </NavLink>
                </li>


                <li className="hover:font-medium">
                    <NavLink 
                        className={({ isActive }) => isActive ? "border border-solid border-[#24e3e3] border-[3px] rounded-lg px-2 py-1" : ""}
                        to="propose" 
                    >
                        Propose Placemark
                    </NavLink>
                </li>
                <li className={`hover:font-medium ${isOpen ? 'font-medium' :'' }`}>
                    <button ref={buttonRef} onClick={toggleMenu}>
                        Profile
                    </button>
                </li>
            </ul>
        </nav>
        { isOpen && 
            <div 
                ref={menuRef} className=" absolute drop-shadow-md text-end top-[45px] h-36 right-[15px] z-10 bg-[#ffff] py-2 border border-solid border-[#24e3e3] rounded-md text-navbar font-medium" 
            >
                <ul className="flex h-full flex-col justify-between">
                    <div>
                        <li>
                            <NavLink
                                className={"px-4 py-1 hover:bg-active w-full block hover:text-[#ffff]"}
                                to={`profile/${authContext.user.id}`} 
                            >
                                Profile
                            </NavLink>
                        </li>
                        <li className="mt-[10px]">  
                            <NavLink 
                                className={" px-4 py-1 hover:bg-active w-full hover:text-[#ffff]" }
                                to="favorites" 
                            >
                                Saved
                            </NavLink>
                        </li>
                    </div>

                    <li >
                        <NavLink
                            className='text-[#cf0404] px-4 py-1 rounded-md w-full'    
                            to="/" 
                            onClick={authContext.logoutUser} 
                        >
                            Exit
                        </NavLink>
                    </li>
                </ul>
            </div>
        }
        </>
    );
    
}

export default LoggedUserUpperMenu;