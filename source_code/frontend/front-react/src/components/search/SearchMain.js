import axios from "axios";
import AuthContext from "context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SearchMain = () => {
    const [users, setUsers] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const authContext = useContext(AuthContext);
    const [filteredUsers, setFilteredUsers] = useState([]); //переписать потом под серверный поиск (для реализации в декабре) (или виртуальным скроллом) !!!
    const [selectedRegion, setSelectedRegion] = useState('no filter');

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

    useEffect(()=>{
        const fetchData = async ()=>{
            const response = await axios.get(`${authContext.requestHost}/api/users/retrieve_users_basic_info`)
            if(response.status === 200){
                console.log('successful user basic info request');
                setUsers(response.data); 
                setFilteredUsers(response.data);
            }
            else{
                console.log('failed user basic info request');
            }
        }
        fetchData();
    }, []);
    
    useEffect(()=>{
        setFilteredUsers(users.filter((user) => {
            return (
                (selectedRegion!=='no filter'?user.region===selectedRegion:true) &&
                (user.username.toLowerCase().includes(searchValue.toLowerCase())) &&
                (authContext.user?(user.id !== authContext.user.id): true));     
        }));
    }, [searchValue, selectedRegion]);



    return(
        <div
            className="w-full flex flex-col items-center justify-center"
        >
            <div className="w-full max-w-md">
                <form className="w-full mt-[20px] flex items-center mb-[50px]"  >
                    <label className="font-medium text-navbar" htmlFor="searchLine">Find user:</label>
                    <input 
                        className='w-full max-w-[250px] ml-[20px] rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active mr-2'
                        type="text" id="searchLine" onChange={(e)=>setSearchValue(e.target.value)} 
                        placeholder="Enter username"
                    />  

                    <label  className="font-medium text-navbar" htmlFor="region">Region:</label>

                    <select
                        className="ml-4 px-2 py-1 border border-solid border-navbar rounded-lg focus:outline-active"
                        value={selectedRegion}
                        name='region'
                        onChange={(e)=>setSelectedRegion(e.target.value)}
                    >
                        <option key='no' value='no filter'>No filter</option>
                        {userRegions.map((region)=>
                            <option key={region} value={region}>{region}</option>
                        )}
                    </select>                       
                </form>

            <>{
                    filteredUsers?.length > 0?filteredUsers.map((user)=>{
                    if(user.id !== 1){
                        return(
                        <div id="user-card" 
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
                    )}}):
                <div className="text-3xl p-3 text-red text-center shadow shadow-red">User not found</div>}   
                
            </>
            </div>
        </div>
    );
}

export default SearchMain;