import React, { Component } from 'react'
// import LoginForm from './components/accounts/login'
// import RegisterForm from './components/accounts/register'
import Fade from 'react-reveal/Fade'
import {Link, Redirect} from 'react-router-dom'
import {FaAngleLeft} from 'react-icons/lib/fa'

export default class Offline extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loginClicked: true,
      active: 'background: #fff',
      passive: 'background: none',
      dbname: ''
    }
  }
  componentDidMount () {
    this.getUsers()
  }
  getUsers () {
    var keys = Object.keys(localStorage)
    return keys.map(key => {
      if (key.startsWith('_pouch_')) {
        if (key === '_pouch_check_localstorage' || key === '_pouch_null' || key === '_pouch_undefined') {
          return true
        } else {
          return <li onClick={() => this.userClick(key.substring(7))} >
            {key.substring(7)}
          </li>
        }
      }
    })
  }

  userClick (user) {
    sessionStorage.setItem('user', user)
    sessionStorage.setItem('offline', true)
    this.props.history.push('/dashboard')
  }

  render () {
    return (
      <div className='offline'>
        <div className='offline_box'>
          <Fade top>
            <h1>Diving Hub</h1>
          </Fade>
          <Fade>
            <button className='back_button' onClick={() => this.props.history.push('/signup')}><FaAngleLeft /></button>
            <h3 className='offline_title'>Offline Users Available</h3>
            <div className='offline_users'>
              { this.getUsers() }
              <br />
            </div>
          </Fade>
        </div>
      </div>
    )
  }
}
