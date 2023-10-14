import React from "react";
import UpperMenu from "./components/menu/UpperMenu";
import { Routes, Route } from "react-router-dom";
import Login from "components/auth/Login";
import { AuthProvider } from "context/AuthContext";
import PlacemarkMain from "components/placemarks/PlacemarkMain";
import ProfileMain from "components/profile/ProfileMain";
import EditProfile from "components/profile/EditProfile";
import MainPage from "components/index/MainPage";
import SearchMain from "components/search/SearchMain";
import Register from "components/auth/Register";

class App extends React.Component{

  render(){
    return(
      <>
        <AuthProvider>      
          <UpperMenu />
          <Routes>
              <Route path="" element = {<MainPage />} exact></Route>
              <Route path="login" element = { <Login/> }></Route>
              <Route path="register" element = {<Register/>}></Route>
              <Route path="search" element = { <SearchMain></SearchMain>}></Route>
              <Route path="placemarks/:placemark_id" element = { <PlacemarkMain/> }></Route>
              <Route path="profile/:user_id" element = {<ProfileMain/>}>
                <Route path="edit" element = {<EditProfile/>}></Route>
              </Route>
              {/* <Route path="*" element={<404/>}></Route> //здесь будет pageNotFound */}
          </Routes>
        </AuthProvider>
      </>
    );
  }
}

export default App;
