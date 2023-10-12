import React from "react";
import UpperMenu from "./components/menu/UpperMenu";
import MyMap from "components/map/mapInit";
import { Routes, Route } from "react-router-dom";
import Login from "components/auth/Login";
import { AuthProvider } from "context/AuthContext";
import PlacemarkMain from "components/placemarks/PlacemarkMain";
import ProfileMain from "components/profile/ProfileMain";
import EditProfile from "components/profile/EditProfile";

class App extends React.Component{

  // constructor(props){
  //   super(props);
  // }

  render(){
    return(
      <>
        <AuthProvider>      
          <UpperMenu />
          <Routes>
              <Route path="" element = {<MyMap />} exact></Route>
              <Route path="login" element = { <Login/> }></Route>
              <Route path="placemarks/:placemark_id" element = { <PlacemarkMain/> }></Route>
              <Route path="profile/:user_id" element = {<ProfileMain/>}>
                <Route path="edit" element = {<EditProfile/>}></Route>
              </Route>
          </Routes>
        </AuthProvider>
      </>
    );
  }
}

export default App;
