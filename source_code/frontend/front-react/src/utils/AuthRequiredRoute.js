import AuthContext from "context/AuthContext";
import React, { useContext } from "react";
import { useNavigate, Navigate} from "react-router-dom";


const AuthRequiredRoute = ({children}) => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    if(!authContext.user){
        <Navigate to="/login" />
    }
    return children;
}

export default AuthRequiredRoute;