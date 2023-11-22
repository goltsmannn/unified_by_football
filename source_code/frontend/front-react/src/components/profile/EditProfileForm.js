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

    const userRegions = [
        'CAO',
        'NAO',
        'NEAO',
        'EAO',
        'SEAO',
        'SAO',
        'SWAO',
        'WAO',
        'NWAO',
    ];


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
        }
        const response = await axios.post(`${authContext.requestHost}/api/users/auth/update_user_by_token`, data, config);
        if (response.status === 200){
            console.log('success');
            authContext.setUser(response.data);
        }
        else{
            console.log(`failure ${response.status}`);
        }
        navigate(-1);
    }

    console.log(authContext.readOnlyFields);
    return(
    <form 
        onSubmit={saveAndGoBack}
        className="bg-active mt-[20px] text-[#ffff] rounded-md p-4"
    >
        {Object.keys(user).map((key)=> {
                //проверим, что поле не входит в список readOnlyFields
                console.log(key);
                return ((authContext.readOnlyFields.indexOf(key) === -1 && key != 'region') && 
                <>
                    <input
                        className='mt-[10px] text-[#000] rounded-lg px-1 py-1 border border-solid border-navbar focus:outline-active'
                        onChange={inputHandler} type="text" 
                        name={`${key}`} 
                        value={inputFields[key]} 
                        id={`${key}`+"-field"}
                    />
                    <label className="ml-[10px]" htmlFor={`${key}`+"-field"}>{key.charAt(0).toUpperCase() + key.slice(1)} Field</label>
                    <br></br>
                </>)
                }
        )}

        <select
                        className='mt-[10px] text-[#000] rounded-lg px-1 py-1 border border-solid border-navbar focus:outline-active'
                        value={inputFields.region}
            name='region'
            onChange={(e)=>setInputFields({region: e.target.value})}
            id='region-field'
        >
            {userRegions.map((region)=>
                <option key={region} value={region}>{region}</option>
            )}
        </select> 
        <label className="ml-[10px]" htmlFor='region-field'>Region Field</label>

        {/* <label htmlFor="username-field">Имя пользователя</label>
        <input type="text" name="username" id="username-field" value={user.username}></input>
        <input type="text" name="email" id="email-field"value={user.email}/>
        <input type="text" name="height" id="height-field"value={user.height}/>
        <input type="text" name="age" id="age-field" value={user.age}/>
        <input type="text" name="weight" id="weight-field" value={user.weight}/>
        <input type="text" name="region" id="region-field"value={user.region}/> */}
        <input className="mt-[30px] bg-[#ffff] text-navbar font-medium rounded-md py-1 text-center w-full" type="submit" value="Submit" />
    </form>
    );
}

export default EditProfileForm;