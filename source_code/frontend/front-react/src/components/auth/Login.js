import AuthContext from "context/AuthContext";
import React from "react";

class Login extends React.Component{
    static contextType = AuthContext;

    render(){
        return(
            <>
            <form onSubmit={this.context.loginUser}>
                <input type="text" name="email" placeholder="Введите почту"></input>
                <input type="text" name="password" placeholder="Введите пароль"></input>
                <input type="submit" />
            </form>
            </>
        );
    }
}

export default Login;