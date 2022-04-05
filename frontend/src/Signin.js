import React from "react";
import { Component } from "react";
import Signup from "./Signup";
class Signin extends Component{
    render(){
        return(
            <div>
            <main className="main">
            <div className="wrapper">
                <div className="card">
                    <div className="title">
                        <h1 className="title title-large">Sign In</h1>
                        <p className="title title-subs">New user?<span>
                        </span></p>
                    </div>
                    <form className="form">
                        <div className="form-group">
                            <input type="email" name="email" id="email" className="input-field" placeholder="Email address"/>
                        </div>
                        <div className="form-group">
                            <input type="password" name="password" id="password" className="input-field" placeholder="Password"/>
                        </div>
                        <div className="form-group" id ="password">
                        </div>
                        <div  className="form-group">
                          <input type="button" name="submit" className="input-submit"  value="Login" />
                        </div>
                    </form>
                    <div className="line">
                        <span className="line-bar"></span>
                        <span className="line-text">OR</span>
                        <span className="line-bar"></span>
                    </div>
                    <div className="method">
                        <div className="method-item">
                            <a href="#" className="btn-action">
                                <i className="icons icons-google fab fa-google"></i>
                                <span>Sign in with Google</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        </div>
        )
    }
}
export default Signin