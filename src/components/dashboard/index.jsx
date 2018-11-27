import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import Search from '../search'
import Header from '../header'
import cookie from 'react-cookies'
import PouchDB from 'pouchdb'
import {PieChart, Pie, Tooltip, Cell} from 'recharts'
import { applyMiddleware } from 'redux'
import Fade from 'react-reveal/Fade'
import moment from 'moment'
import Slide from 'react-reveal/Slide'
import Modal from 'react-responsive-modal';

import DashBoardHeader from './header'
import _addCustomer from '../retail/_addCustomer'
import './dashboard.css'
import { relative } from 'path'

PouchDB.plugin(require('pouchdb-find'))

class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      cookies: cookie.loadAll(),
      title: 'Dashboard',
      open: false
    }
  }

  componentWillMount () {
    this.getUpcomingEvents()
  }

  componentDidMount () {
    let user = sessionStorage.getItem('user')
    localStorage.setItem(`_pouch_${user}`, user);

    PouchDB.replicate(`http://localhost:5984/${user}`, `${user}`).then(() => {
      this.setState({ loaded: true })
    }).catch((err)=>{
      if (err.status == 401 || 500) {
        sessionStorage.removeItem('Auth');
        <Redirect to='/signup' />
      }
    })
  }

  onOpenModal = () => {
    this.setState({ open: true });
    };

onCloseModal = () => {
    this.setState({ open: false });
    };

  getUpcomingEvents () {
    let date = new moment().format('YYYY')
    let docName = 'Events-' + date
    this.getDbDoc(docName).then((doc) => {
      console.log(doc.array)
      let array = doc.array.sort((a, b) => {
        var x = moment(a.start).unix()
        var y = moment(b.start).unix()
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      })
      array = doc.array.filter(item => moment(item.start).unix() > moment().unix())
      array = array.slice(0, 10)
      console.log(array)
      
      this.setState({
        upcomingEvents: array,
        loaded: true
      })
      console.log('arrayyyy', array)
    }).catch((err) => {
      console.log('Placing Order Error')
      if (err.status == 404) {
        console.log('Missing Document')
        var doc = { // if doc missing create one
          '_id': `${docName}`,
          'array': []
        }
        let db = new PouchDB(`${sessionStorage.getItem('user')}`)
        db.put(doc)
        console.log('Added Document')
        this.getUpcomingEvents() // retry function
      }
    })
  }

  getDbDoc (docName) {
    let db = new PouchDB(`${sessionStorage.getItem('user')}`)
    return db.get(docName).then((doc) => {
      console.log('getDbDoc:Fetching doc')
      return doc
    }).catch((err) => {
      console.log('Error Getting Doc')
      console.log(err)
    })
  }

  upcomingEventsToTable () {
    console.log('Upcoming Events', this.state.upcomingEvents)
    if (this.state.upcomingEvents) {
      return this.state.upcomingEvents.map(element => {
        console.log('iterated')
        return (
          <li> <div className='title'>{element.title}</div> <div className='time'>{moment(element.start).format('HH:MM DD/MM/YYYY')}</div></li>
        )
      })
    }
  }

  render () {

    if (sessionStorage.getItem('offline') == 'true') {

    } else if (sessionStorage.getItem('Auth') == 'false') {
      return <Redirect to='/signup' />
    } else if (!sessionStorage.getItem('Auth')) {
      return <Redirect to='/signup' />      
    } else if (!this.state.loaded) {
      return (
        <div id='loading_box'>
          <div class='lds-ripple'><div /><div /></div>
          <h1>Loading Database...</h1>
        </div>
      )
    }
    const data01 = [{name: 'This Week', value: 35}, {name: 'Last Week', value: 10}]

    const data02 = [{name: 'Bulgarian', value: 2400}, {name: 'Russian', value: 4567},
      {name: 'English', value: 1398} ]
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
    return (

      <div className='component_container'>
        <Header isauth />
        <div className='container_right'>
          <Search />
          <Fade >
            <div className='dashboard_container'>
              <div className='dashboard_box time_box'>
                <h1>{moment().format('dddd, MMMM Do YYYY')}</h1>
              </div>
              <div className='dashboard_box'>
                <img src='' alt='' />
                <PieChart width={200} height={200}>
                  <Pie dataKey="value" data={data02} cx={100} cy={100}
                    innerRadius={40} outerRadius={80}
                    fill='#82ca9d' />
                  {
                    data02.map((entry, index) =>
                      <Cell fill={COLORS[index % COLORS.length]} />)
                  }
                  <Tooltip />
                </PieChart>
                <h1>Clients</h1>
                <p>Demographics of your store Clients</p>
              </div>
              <div className='dashboard_box events_box'>
                <h1>Upcoming Tasks</h1>
                <ul>
                  { this.upcomingEventsToTable()}
                </ul>
              </div>
            </div>

            {/*  -----------------  */}
            <Modal classNames='modal_add_products'  open={this.state.open} onClose={this.onCloseModal} center>
            <_addCustomer />
            </Modal>

            <div className='dashboard_container'>
              <div className='dashboard_box'>
                <div className='add_customers'>
                  <img src='' alt='' />
                  <h1>Customer quick add</h1>
                  <button className='ripple' onClick={this.onOpenModal}>Add New Customer</button>
                </div>
              </div>
              <div className='dashboard_box'>
                <img src='' alt='' />
                <PieChart width={200} height={200}>
                  <Pie dataKey="value" isAnimationActive={false} data={data01}
                    cx={100} cy={100}
                    outerRadius={80} fill='#8884d8' label />
                  <Tooltip />
                </PieChart>
                <h1>Weekly Clients</h1>
                <p>Clients this week and last week</p>
              </div>
              <div className='' />
            
            </div>
          </Fade >
        </div>
      </div>
    )
  }
};

export default Dashboard
