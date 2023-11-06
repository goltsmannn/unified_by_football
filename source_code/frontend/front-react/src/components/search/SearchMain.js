import axios from "axios";
import AuthContext from "context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
                setUsers(response.data); 
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
        <div
            className="w-full flex flex-col items-center justify-center"
        >
            <div className="w-full max-w-md">
                <form className="w-full mt-[20px] flex items-center mb-[50px]"  >
                    <label className="font-medium text-navbar" htmlFor="searchLine">Find user:</label>
                    <input 
                        className='w-full max-w-[250px] ml-[20px] rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active'
                        type="text" id="searchLine" onChange={(e)=>setSearchValue(e.target.value)} 
                        placeholder="Enter username"
                    />
            </form>

            <>{
                filteredUsers?.length > 0?filteredUsers.map((user)=>
                <div
                    id="user-card" 
                    className="px-[40px] py-[20px] text-navbar border border-solid border-2 border-navbar mg-8 rounded-md my-4"
                >
                    <div>Username: {user.username} </div>
                    <div>Region: {user.region}</div>
                    <div className="mt-[20px]">
                        <Link 
                            className="bg-navbar text-[#ffff] text-center px-2 py-1 rounded-md"
                            to={`/profile/${user.id}`}
                        >
                            Navigate to the profile
                        </Link>
                    </div>
                </div>
            ): <div className="text-3xl p-3 text-red text-center shadow shadow-red">User not found</div>}   

            </>
            </div>
        </div>
    );
}

export default SearchMain;