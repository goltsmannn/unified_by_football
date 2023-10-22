import AuthContext from 'context/AuthContext';
import React, { useContext, useState } from 'react';
import axios from 'axios';


const PlacemarkForm = ({coordinates}) => {
    const [workingHours, setWorkingHours] = useState({
        from: '',
        to: '',
    });
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const authContext = useContext(AuthContext);


    const handleSubmit = (event) => {
        event.preventDefault();
        const fetchData = async () => {
            const config = {
                headers: { Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}` }
            };
            const data = {
                x: coordinates[0],
                y: coordinates[1],
                name: name,
                description: description,
            }
            if(workingHours.from && workingHours.to){
                data.working_hours = workingHours;
            }


            try{
                const response = await axios.post('http://127.0.0.1:8000/api/map/placemark/post', data, config);
            }
            catch(error){
                console.error('error while posting placemark', error);
            }
        };
        fetchData();
    };


    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
            </div>
            <div>
                <input
                    type="text"
                    name="from"
                    value={workingHours.from}
                    onChange={(event)=>setWorkingHours({from: event.target.value})}
                    pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                    placeholder="From (hh:mm)"
                />
                <input
                    type="text"
                    name="to"
                    value={workingHours.to}
                    onChange={(event)=>setWorkingHours({to: event.target.value})}
                    pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                    placeholder="to (hh:mm)"
                />
            </div>

            
            <button type="submit">Submit</button>
        </form>
    );
};

export default PlacemarkForm;

