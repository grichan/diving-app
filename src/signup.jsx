import React, { Component } from 'react'
import LoginForm from './components/accounts/login'
import RegisterForm from './components/accounts/register'
import Fade from 'react-reveal/Fade'

export default class Signup extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loginClicked: true,
      active: 'background: #fff',
      passive: 'background: none'

    }
  }

  render () {
    return (
      <div className='signup'>
        <div className='signup_box'>
          <Fade top>
            <h1>Diving Hub</h1>
            <p>Login / Register</p>
          </Fade>
          <Fade>
            <div className='signup_controls'>
              <button className='pure-button' style={{background: `${this.state.loginClicked ? '#fff' : '#F5F5F5'}` }}
                onClick={() => {
                  console.log('stateCjanges')
                  this.setState({ loginClicked: true })
                }}>Login</button>
              <button className='pure-button' style={{background: `${this.state.loginClicked ? '#F5F5F5' : '#fff'}` }}
                onClick={() => {
                  console.log('stateCjanges')
                  this.setState({ loginClicked: false })
                }}>Sign Up</button>
            </div>
          </Fade>
          <Fade>
            <div className='signup_form'>
              {this.state.loginClicked ? <LoginForm /> : <RegisterForm />}
            </div>
          </Fade>
        </div>
      </div>
    )
  }
};
