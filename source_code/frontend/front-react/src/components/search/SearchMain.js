import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthContext from "context/AuthContext";

const SearchMain = () => {
    const [users, setUsers] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const authContext = useContext(AuthContext);
    const filteredUsers = users.filter((user) => {
        return (user.username.toLowerCase().includes(searchValue.toLowerCase()) && (authContext.user?(user.id !== authContext.user.id): true)); 
    }); //переписать потом под серверный поиск (для реализации в декабре) (или виртуальным скроллом) !!!
    //поиск юзеров

    
    useEffect(()=>{
        const fetchData = async ()=>{
            const response = await axios.get('http://127.0.0.1:8000/api/users/retrieve_users_basic_info')
            if(response.status === 200){
                console.log('successful user basic info request');
                setUsers(response.data); //СПРОСИТЬ ЗАЧЕМ ТУТ USESTATE (done)
            }
            else{
                console.log('failed user basic info request');
            }
        }
        fetchData();
    }, []);
    
    useEffect(()=>{
        //сюда переписать filteredusers, filteredusers - state
    }, [searchValue]);

    return(
        <>
            <form >
                <label htmlFor="searchLine"></label>
                <input type="text" id="searchLine" onChange={(e)=>setSearchValue(e.target.value)} />
            </form>

            <>{
                filteredUsers.map((user)=>
                <div id="user-card" className=" mg-8">
                    <div>Username: {user.username} </div>
                    <div>Region: {user.region}</div>
                    <Link to={`/profile/${user.id}`}>Страничка пользователя</Link>
                </div>
            )}   
            </>
        </>
    );
}

export default SearchMain;