import React, { Component } from 'react'

import ReactDOM from 'react-dom'
import {combineReducers, createStore} from 'redux'

export default class ReduxTest extends Component {
  // componentDidMount () {
  //   function productsReducer (state = [], action) {
  //     return state
  //   }

  //   function userReducer (state = [], {type, payload}) {
  //     switch (type) {
  //       case 'updateUser':
  //         return payload.user
  //     }
  //     return state
  //   }

  //   const allReducers = combineReducers({ // all the reducers in one place
  //     products: productsReducer,
  //     user: userReducer
  //   })

  //   const store = createStore( // creating store
  //     allReducers,
  //     {
  //       products: [{name: 'iPhone'}],
  //       user: 'Michael'
  //     },
  //     window.devToolsExtension ? window.devToolsExtension() : f => f
  //   )

  //   const updateUserAction = {
  //     type: 'updateUser',
  //     payload: {
  //       user: 'Jack'
  //     }
  //   }

  //   store.dispatch(updateUserAction)

  //   console.log(store.getState())
  // }

  render () {
    return (
      <div>
        Test Redux
      </div>
    )
  }
};
