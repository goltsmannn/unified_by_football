import AuthContext from "context/AuthContext";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

const EditProfileForm = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const user = authContext.user;
    const saveAndGoBack = () => {
        navigate(-1);
    }
    return(
    <form onSubmit={saveAndGoBack()}>
        <label htmlFor="username-field">Имя пользователя</label>
        <input type="text" id="username-field" value={user.username}></input>
        <input type="text" id="email-field"value={user.email}/>
        <input type="text" id="height-field"value={user.height}/>
        <input type="text" id="age-field" value={user.age}/>
        <input type="text" id="weight-field" value={user.weight}/>
        <input type="text" id="region-field"value={user.region}/>
        <input type="submit" value="Отправить" />
    </form>
    );
}

export default EditProfileForm;