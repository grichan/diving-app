import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';


// COMPONENTS
import Header from '../components/header'

  var headerTitle = 'Default';

class RightHeader extends Component {
  
  componentWillMount(){
    //this.props.moviesList();// fetcches the action 
    //this.props.retail_header();
    
  }
  
  renderList = (right_header)=>{
      console.log({right_header});
    if (right_header) {
      var headerTitle = right_header[0].name;
      
        return right_header.map((header)=>{
          return (
            <div key={header.id}>{header.name}
            <br/>
            </div>
          )
        })
    }
  }



  render() {
    return (
     
            
        <div>
            <h1></h1>
            {this.renderList(this.props.right_header)}            
            <button onClick={call.bind(this)}>A</button>
            <button onClick={callcall.bind(this)}>B</button>

        </div>
    );
  }
}

function mapStateToProps(state){
  return {
    movies:state.movies,
    right_header:state.right_header
  }
}


function call(){
    this.props.dashboard_header();
}

function callcall(){
    this.props.retail_header();
}
export default connect(mapStateToProps, actions)(RightHeader);
