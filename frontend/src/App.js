import logo from './logo.svg';
import './App.css';
import Greet from './component/Greet';
import { Component } from 'react';
import Welcome from './component/Welcome';
import { ReactDOM } from 'react';
import Hello from './component/Hello';
class App extends Component{
  render(){
    return (
      <div className='App'>
        <main className="main">
    <div className="wrapper">
        <div className="card">
            <div className="title">
                <h1 className="title title-large">Sign In</h1>
                <p className="title title-subs">New user? <span><a href="#" className="linktext">Create an account</a></span></p>
            </div>
            <form className="form">
                <div className="form-group">
                    <input type="email" name="email" id="email" className="input-field" placeholder="Email address"/>
                </div>
                <div className="form-group">
                    <input type="password" name="password" id="password" className="input-field" placeholder="Password"/>
                </div>
                <div className="form-group" id ="password">
                    <a href="./index.html" className="linktext">Forgot Password</a>
                  <input type="button" name="submit" className="input-submit" value="Login"/>
                </div>
            </form>
            <div className="line">
                <span className="line-bar"></span>
                <span className="line-text">Or</span>
                <span className="line-bar"></span>
            </div>
            <div className="method">
                <div className="method-item">
                    <a href="#" className="btn-action">
                        <i className="icons icons-google fab fa-google"></i>
                        <span>Sign in with Google</span>
                    </a>
                </div>
                <div className="method-item">
                    <a href="#" className="btn-action">
                        <i className="icons icons-facebook fab fa-facebook"></i>
                        <span>Sign in with Facebook</span>
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


export default App;
