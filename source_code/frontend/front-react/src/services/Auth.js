import React from "react";
import axios from "axios";
import getAPIURL from "utils/getAPIURL";

const api_urls = getAPIURL();


// class Auth{
//     Login(email, username, password){
//         return axios.post(api_urls['users'], {
//             email: email,
//             username: username,
//             password: password
//         })
//         .then(response=>{
//             if(response.data.accessToken){
//                 localStorage.setItem("user", JSON.stringify(response.data));
//             }
//             return response.data;
//         });
//     }
//     Logout(){
//         localStorage.removeItem('')
//     }
//     Register(){
            
//     }
//     getUserInfo(){

//     }
// }