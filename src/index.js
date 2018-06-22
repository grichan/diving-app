import React from 'react'
import ReactDOM from 'react-dom'
import Landing from './landing'

import {Provider} from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import Reducers from './reducers'

import 'purecss/build/pure.css'

import {BrowserRouter, Route} from 'react-router-dom'
import Dashboard from './components/dashboard'
import Signup from './signup'
import OpenRegister from './components/retail/open_register'

// COMPONENTS
// import Header from './components/header.js'
// retail
import RetailHistory from './components/retail/history.jsx'
import Products from './components/retail/products'
import Courses from './components/retail/courses'
import Customers from './components/retail/customers'
// claendar
import Calendar from './components/calendar/index'
// equipment
import Equipment from './components/equipment/index'
// staff
import Staff from './components/staff/index'
// service
import Service from './components/service'
// filling station
import Refill from './components/refill'
// offline
import Offline from './offline'

// // TEST
// import Test from './components/retail/selective_search'

const createStoreWithMiddleware = applyMiddleware()(createStore)

ReactDOM.render(

  <Provider store={createStoreWithMiddleware(Reducers,
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )}>
    <BrowserRouter>
      <div className='main_container'>
        {/* LANDING PAGES */}
        <Route exact path='/' component={Landing} />
        <Route exact path='/dashboard' component={Dashboard} />
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/offline' component={Offline} />
        {/* RETAIL */}
        <Route exact path='/retail/register' component={OpenRegister} />
        <Route exact path='/retail/' component={OpenRegister} />
        <Route exact path='/retail/history' component={RetailHistory} />
        <Route exact path='/retail/products' component={Products} />
        <Route exact path='/retail/courses' component={Courses} />
        <Route exact path='/retail/customers' component={Customers} />
        {/* CALENDAR */}
        <Route exact path='/calendar/' component={Calendar} />
        {/*  EQUIPMENT */}
        <Route exact path='/equipment/' component={Equipment} />
        {/* STAFF */}
        <Route exact path='/staff/' component={Staff} />
        {/* SERVICE */}
        <Route exact path='/Service/' component={Service} />
        {/* FILLING STATION */}
        <Route exact path='/refill' component={Refill} />
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
