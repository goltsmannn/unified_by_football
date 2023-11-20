import AuthContext from "context/AuthContext";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";


const AuthRequiredRoute = ({children}) => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    if(!authContext.user){
        navigate("/login");
        return null;
    }
    return children;
}

export default AuthRequiredRoute;