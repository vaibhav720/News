import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import Signin from './Signin';
import Signup from './Signup';
import React from 'react';
class App extends Component{
  render(){
    return (
      <div className='App'>
        <Signin/>
      </div>
    )
  }
}
export default App;
