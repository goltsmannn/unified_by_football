import AuthContext from "context/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Navigate} from "react-router-dom";


const AuthRequiredRoute = ({children}) => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(()=>{
        if(authContext.user){
            setIsAuthenticated(true);
        }
        else{
            navigate('/login');
        }
    }, []);
    
    if(isAuthenticated){
        return children;
    }
}

export default AuthRequiredRoute;