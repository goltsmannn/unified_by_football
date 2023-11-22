import React from "react";
import UpperMenu from "./components/menu/UpperMenu";
import { Routes, Route, Outlet } from "react-router-dom";
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
import ProposePlacemark from "components/placemarks/ProposePlacemark";
import FavoritePlacemarks from "components/placemarks/FavoritePlacemarks";
import "./_style.css";
import PageWrapper from "PageWrapper";
import Verification from "components/auth/Verification";
import AuthRequiredRoute from "utils/AuthRequiredRoute";
import PasswordReset from "components/profile/PasswordReset";


class App extends React.Component{

  render(){
    return(
      <>
        <AuthProvider>      
          {/* <UpperMenu /> */}
          <Routes>
            <Route path="/" element = {<PageWrapper />} exact>
              <Route index element = {<MainPage />} exact></Route>
              <Route path="search" element = { <SearchMain></SearchMain>}></Route>
              <Route path="propose" element = {<AuthRequiredRoute> <ProposePlacemark/> </AuthRequiredRoute>}></Route>
              <Route path="favorites" element = {<AuthRequiredRoute> <FavoritePlacemarks/> </AuthRequiredRoute>}></Route>
              <Route path="placemarks/:placemark_id" element = { <PlacemarkMain/> }>
                <Route index element = {<PlacemarkInfo/>}></Route>
                <Route path="post" element = {<AuthRequiredRoute> <ReviewForm/> </AuthRequiredRoute>}></Route>
              </Route>

              <Route path="message" element={<AuthRequiredRoute><MessageMain /></AuthRequiredRoute>}>
                <Route index element={<MessageList filter_by="recipient"/>}></Route>
                <Route path="submitted" element={<MessageList filter_by="sender"/>}></Route>
                <Route path="post" element={<PostMessage/>}></Route>
                <Route path=":message_id" element={<GetMessage/>}></Route>
              </Route>

              <Route path="profile/:user_id" element = {<ProfileMain/>}>
                <Route path="edit" element = {<EditProfile/>}></Route>
              </Route>
            </Route>

            <Route path="/login" element = { <Login/> }></Route>
            <Route path="/register" element = {<Register/>}></Route>
            <Route path="/verification/:uid/:token" element={<Verification/>}></Route>
            <Route path="/password-reset/:uid/:token" element={<PasswordReset/>}></Route>
            <Route path="*" element={<Page404/>}></Route> 
          </Routes>
        </AuthProvider>
      </>
    );
  }
}

export default App;
