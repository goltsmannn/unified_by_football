import AuthContext from "context/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Navigate} from "react-router-dom";


const AuthOrHidden = ({children}) => {
    const authContext = useContext(AuthContext);

    
    if(authContext.user){
        return children;
    }
    else{
        return <></>;
    }
    
}

export default AuthOrHidden;