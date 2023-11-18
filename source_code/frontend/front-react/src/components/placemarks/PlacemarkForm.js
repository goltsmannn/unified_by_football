import AuthContext from 'context/AuthContext';
import React, { useContext, useState } from 'react';
import axios from 'axios';


const PlacemarkForm = ({coordinates, onClose}) => {
    const [workingHours, setWorkingHours] = useState({
        from: '',
        to: '',
    });
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [placemarkPicture, setPlacemarkPicture] = useState(null);

    const authContext = useContext(AuthContext);


    const handleSubmit = (event) => {
        event.preventDefault();
        const fetchData = async () => {
            const config = {
                headers: {
                    Authorization: `Bearer ${authContext.authToken.replaceAll('"', '')}`,
                    'Content-Type': 'multipart/form-data',
                }
            };

            const formData = new FormData();
            formData.append('x', coordinates[0]);
            formData.append('y', coordinates[1]);
            formData.append('name', name);
            formData.append('description', description);
            if(workingHours.from && workingHours.to){
                formData.append('working_hours', workingHours);
            }
            if(placemarkPicture){
                formData.append('main_image', placemarkPicture);
            }
            const response = await axios.post(`${authContext.requestHost}/api/map/placemark/post`, formData, config);
        };
        fetchData();
        onClose();
    };


    return (
        <form 
            onSubmit={handleSubmit}
            className='mt-[20px] w-full w-max-md'
        >
            <div className='flex flex-col'>
                <label htmlFor="name">Pitch name:</label>
                <input
                    className='rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active'
                    type="text"
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </div>
            <div className='flex flex-col mt-[15px]'>
                <label htmlFor="description">Description:</label>
                <textarea
                    className='rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active'
                    id="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
            </div>

            
            <div className='flex flex-col mt-[15px]'>
                <label  className="bg-navbar text-[#ffff] rounded-md p-2 cursor-pointer mt-[15px] flex flex-col font-medium">
                    Attach photo...
                <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(event) => setPlacemarkPicture(event.target.files[0])}
                />
                </label>
            </div>


            <div className='flex flex-col mt-[15px]'>
                <input
                    className='rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active'
                    type="text"
                    name="from"
                    value={workingHours.from}
                    onChange={(event)=>setWorkingHours({from: event.target.value})}
                    pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                    placeholder="From (hh:mm)"
                />
                <input
                    className='mt-[10px] rounded-lg px-1 py-2 border border-solid border-navbar focus:outline-active'
                    type="text"
                    name="to"
                    value={workingHours.to}
                    onChange={(event)=>setWorkingHours({to: event.target.value})}
                    pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                    placeholder="to (hh:mm)"
                />
            </div>

            
            <button className='w-full text-center mt-[30px] bg-active px-1 py-1 rounded-lg text-[#ffff]' type="submit">Submit</button>
        </form>
    );
};

export default PlacemarkForm;

