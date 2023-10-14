import AuthContext from "context/AuthContext";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const EditProfileForm = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const user = authContext.user;
    const [inputFields, setInputFields] = useState({
        weight: user.weight,
        height: user.height,
        age: user.age, 
        region: user.region,
    });


    const inputHandler = (e) => {
        console.log('changing input)')
        setInputFields({
            [e.target.name]: e.target.value,
        });
    }
    const saveAndGoBack = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}`,
            }
        }
        const data = {
            age: e.target.age.value,
            weight: e.target.weight.value,
            height: e.target.height.value,
            region: e.target.region.value,
            username: e.target.username.value,
        }
        const response = await axios.post('http://127.0.0.1:8000/api/users/auth/update_user_by_token', data, config);
        if (response.status === 200){
            console.log('success');
            authContext.setUser(response.data);
        }
        else{
            console.log(`failure ${response.status}`);
        }
        navigate(-1);
    }


    return(
    <form onSubmit={saveAndGoBack}>
        {Object.keys(user).map((key)=>
            <>
                <input onChange={inputHandler} type="text" name={`${key}`} value={inputFields[key]} id={`${key}`+"-field"}></input>
                <label htmlFor={`${key}`+"-field"}>{key} поле</label>
                <br></br>
            </>
        )}
        {/* <label htmlFor="username-field">Имя пользователя</label>
        <input type="text" name="username" id="username-field" value={user.username}></input>
        <input type="text" name="email" id="email-field"value={user.email}/>
        <input type="text" name="height" id="height-field"value={user.height}/>
        <input type="text" name="age" id="age-field" value={user.age}/>
        <input type="text" name="weight" id="weight-field" value={user.weight}/>
        <input type="text" name="region" id="region-field"value={user.region}/> */}
        <input type="submit" value="Отправить" />
    </form>
    );
}

export default EditProfileForm;