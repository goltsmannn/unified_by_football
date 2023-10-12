import AuthContext from "context/AuthContext";
import React, { useContext } from "react";

const ProfileMain = () => {
    const authContext = useContext(AuthContext);
    return(
        <div>
            {authContext.user.id}
        </div>
    )
}

export default ProfileMain;