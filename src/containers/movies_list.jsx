import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';


// COMPONENTS

class MoviesList extends Component {

  
  componentWillMount(){
    //this.props.moviesList();// fetcches the action 
    //this.props.retail_header();
  }
  
  renderList = (movies)=>{
      console.log({movies});
      
    if (movies) {
        return movies.map((movie)=>{
          return (
            <div key={movie.id}>{movie.name}
            <br/>
            </div>
          )
        })
    }
  }



  render() {
    return (
     
            
        <div>

            {this.renderList(this.props.movies, this.props.header_right)}            
            <button onClick={call.bind(this)}>A</button>
            <button onClick={callcall.bind(this)}>B</button>
        </div>

      

    );
  }
}

function mapStateToProps(state){
  return {
    movies:state.movies,
    header_right:state.header_reducer
  }
}


function call(){
    this.props.moviesList();
}

function callcall(){
    this.props.dashboard_header();
}
export default connect(mapStateToProps, actions)(MoviesList);
