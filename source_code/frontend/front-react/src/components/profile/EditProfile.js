import React from "react";
import EditProfileForm from "./EditProfileForm";
import { useLocation } from "react-router-dom";

const EditProfile = () => {
    const location = useLocation();
    return(
    <>
        <EditProfileForm/>
    </>
    );
}

export default EditProfile;