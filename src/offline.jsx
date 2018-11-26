import React, { Component } from 'react'
// import LoginForm from './components/accounts/login'
// import RegisterForm from './components/accounts/register'
import Fade from 'react-reveal/Fade'

export default class Offline extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loginClicked: true,
      active: 'background: #fff',
      passive: 'background: none'

    }
  }
  componentDidMount () {
    this.getUsers()
  }
  // getUsers () {
  //   var keys = Object.keys(localStorage)
  //   return keys.map(key => {
  //     if (key.startsWith('_pouch_')) {
  //       if (key === '_pouch_check_localstorage' || key === '_pouch_null' || key === '_pouch_undefined') {
  //         return true
  //       } else return <li>{key.substring(7)}</li>
  //     }
  //   })
  // }

  render () {
    return (
      <div className='signup'>
        <div className='signup_box'>
          <Fade top>
            <h1>Diving Hub</h1>
          </Fade>
          <Fade>
            <h3 className='offline_title'>Offline Users Available</h3>

            <div className='offline_users'>

              { this.getUsers() }
            </div>
          </Fade>
        </div>
      </div>
    )
  }
}
