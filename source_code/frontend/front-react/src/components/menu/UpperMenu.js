import React, { useContext } from "react";
import LoggedUserUpperMenu from "./LoggedUserUpperMenu";
import UnloggedUserUpperMenu from "./UnloggedUserUpperMenu";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthContext from "context/AuthContext";

//здесь импортнуть стили



const UpperMenu = () => {
    const authContext = useContext(AuthContext);

        
    if (authContext.user){
        return(          
            <>
                <LoggedUserUpperMenu></LoggedUserUpperMenu>
            </>
    );
    }
    else{
        return(
            <>
                <UnloggedUserUpperMenu></UnloggedUserUpperMenu>
            </>
        );
    }
    
}

export default UpperMenu;