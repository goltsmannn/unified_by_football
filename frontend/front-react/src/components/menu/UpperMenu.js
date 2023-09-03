import React from "react";
import LoggedUserUpperMenu from "./LoggedUserUpperMenu";
import UnloggedUserUpperMenu from "./UnloggedUserUpperMenu";

class UpperMenu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
        }
    }
    async componentDidMount(){
        try{
            const request = await fetch('http://localhost:8000/map/api/markers');
            const request_json = await request.json();
            this.setState({
                data: request_json,
            });
        }
        catch(e){
            console.log(e);
        }
    }

    render() {

        return(

                <>
                {this.state.data.map(placemark=>(
                    <div>
                        <p>x: {placemark.x}</p>
                        <p>y: {placemark.y}</p>
                        <p>type: {placemark.type}</p>
                        <p>description: {placemark.description}</p>
                        <p>a</p>
                    </div>
                ))}
                </>
        );
    }
}

export default UpperMenu;