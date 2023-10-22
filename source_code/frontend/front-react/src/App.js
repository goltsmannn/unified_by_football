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
import Page404 from "components/index/Page404";
import MessageMain from "components/email/MessageMain";
import PostMessage from "components/email/PostMessage";
import MessageList from "components/email/MessageList";
import GetMessage from "components/email/GetMessage";
import ReviewForm from "components/placemarks/ReviewForm";
import PlacemarkInfo from "components/placemarks/PlacemarkInfo";
import "./_style.css";

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

              <Route path="placemarks/:placemark_id" element = { <PlacemarkMain/> }>
                <Route index element = {<PlacemarkInfo/>}></Route>
                <Route path="post" element = {<ReviewForm/>}></Route>
              </Route>

              <Route path="message" element={<MessageMain/>}>
                <Route index element={<MessageList/>}></Route>
                <Route path=":message_id" element={<GetMessage/>}></Route>
                <Route path="post" element={<PostMessage/>}></Route>
              </Route>

              <Route path="profile/:user_id" element = {<ProfileMain/>}>
                <Route path="edit" element = {<EditProfile/>}></Route>
              </Route>

              <Route path="*" element={<Page404/>}></Route> 
          </Routes>
        </AuthProvider>
      </>
    );
  }
}

export default App;
