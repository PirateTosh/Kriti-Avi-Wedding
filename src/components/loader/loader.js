import React, { Component } from 'react';
import './loader.css';

class Loader extends React.Component {
  render(){
    return(
      <div className="loader-screen">
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }
}

export default Loader;
