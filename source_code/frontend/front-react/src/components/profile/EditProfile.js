import React, { useContext, useEffect } from "react";
import EditProfileForm from "./EditProfileForm";
import { redirect, useLocation, useNavigate, useParams } from "react-router-dom";
import AuthContext from "context/AuthContext";

const EditProfile = () => {
    const {user_id} = useParams();
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(()=>{
        if(!(authContext.user && (authContext.user.id == Number(user_id)))){
            navigate('/');
        }
    });
    if(authContext.user && (authContext.user.id == Number(user_id))){
        console.log('rendering edit form');
        return(
            <EditProfileForm/>
        );
    }
}

export default EditProfile;