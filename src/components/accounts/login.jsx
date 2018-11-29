import React, { Component } from 'react'
// import PouchDB from 'pouchdb'
// import Authentication from 'pouchdb-authentication'
import {Redirect} from 'react-router-dom'
// import $ from 'jquery'
import cookie from 'react-cookies'

import {connect} from 'react-redux'
import * as actions from '../../actions'

class LoginForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      password: '',
      username: '',
      redirect: false,
      path: ''
    }
  };

  componentWillMount () {
    // this.props.showSomeBoobies()
    cookie.remove('AuthSession')
  }
  componentDidMount () {
    cookie.remove('AuthSession', { path: '/' })
  }
  newLogin () {
    cookie.remove('AuthSession', { path: '/' })
    let username = this.state.username
    let password = this.state.password
    console.log('Logi')
    // if (this.usernameValidator(username)) {
    // if (this.passwordStrengthValidator(password)) {
    this.newLoginCall(username, password)
    // } else alert('Unacceptable Passoword')
    // } else alert('Username Format')
  }

  newLoginCall (usnm, pwd) {
    cookie.remove('AuthSession', { path: '/' })
    console.log('Ajax:called')
    var data = {}
    data.usrid = `${usnm}`
    data.pwid = `${pwd}`

    fetch('http://localhost:8080/api/login', {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        usrid: usnm,
        pwid: pwd

      })
    }).then(response => response.json())
      .then((data) => {
        console.log('response data:', data)
        cookie.save('AuthSession', data['token'])
        sessionStorage.setItem('user', usnm)
        sessionStorage.setItem('Auth', true)
        sessionStorage.setItem('sync', false)

        this.changePath(true, data['path'])
      }
      ).catch((err) => {
        console.log('error occured:', err)
      })
  }

  changePath (bool, path) {
    this.setState({redirect: bool, path: path })
  }

  usernameValidator (username) {
    var ragex = /^[a-z0-9]\w{3}([-_$()+]?[a-z0-9])*$/
    return !!ragex.test(username)
  }

  passwordStrengthValidator (password) {
    var mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/
    return !!mediumRegex.test(password)
  }

  render () {
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to={{
        pathname: `${this.state.path}`
      }} />
    }

    return (

      <div className='login_form'>
        <label for='username'>Username:</label>
        <input type='username' placeholder='Username'
          onChange={(e) => { this.setState({username: e.target.value.toLowerCase()}) }}
          value={this.state.username} />
        <label for='password'>Password:</label>
        <input type='password' placeholder='Password'
          onChange={(e) => { console.log(this.passwordStrengthValidator(e.target.value)); this.setState({password: e.target.value}) }}
          value={this.state.password} />
        <label htmlFor='remember'>
          <input id='remember' type='checkbox' /> Remember me
        </label>

        <button type='submit' onClick={this.newLogin.bind(this)} class='pure-button'>Login</button>
        <a href=''>Forgot Password?</a>
        <br />
        <a href='/offline'>Offline mode</a>

      </div>

    )
  }
}
function mapStateToProps (state) {
  return { show: state.show }
}

export default connect(mapStateToProps, actions)(LoginForm)
