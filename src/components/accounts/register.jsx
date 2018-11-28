import React, { Component } from 'react'
import $ from 'jquery'

export default class Register extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      password_confirm: '',
      username: ''
    }
  };

  newRegistry () {
    console.log('register')
    let password = this.state.password
    let email = this.state.email
    let username = this.state.username

    if (this.usernameValidator(username)) {
      // if (this.emailValidator(email)) {
      // if (this.passwordStrengthValidator(password)) {
      // if (password === this.state.password_confirm) {
      this.newRegusterCall(username, email, password)
      // } else alert('Passwords Dont Match')
      // } else alert('Unacceptable Passoword')
      // } else alert('Email wrong')
    } else alert('Username Format')
  }

  // newUserDbRequest (email, password, username) {
  //   if (this.createUserDb(username)) {
  //     if (this.createUser(username, email, password)) {
  //       if (this.createUserDbSecurityParam(username)) {
  //         alert('Registed Succesfully')
  //       }
  //     }
  //   }
  // }

  newRegusterCall (username, email, password) {
    console.log('Ajax:called')

    var data = {}
    data.usrid = `${username}`
    data.email = `${email}`
    data.pwid = `${password}`

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: 'http://localhost:8080/api/register',
      success: function (data) {
        console.log('Succes')
        console.log(JSON.stringify(data))
      },
      error: function () { console.log('Error Occured') }
    })
  }

  createUser (username, email, password) {
    // CREATE THE USER
    let nano = require('nano')('http://localhost:5984/_users')
    return nano.insert({ _id: `org.couchdb.user:${username}`,
      name: `${username}`,
      email: `${email}`,
      type: 'user',
      roles: ['ninja', `${username}`],
      password: `${password}`,
      breakfast: ['pancakes', 'leaf']}
      , (err, body) => {
      if (!err) {
        console.log(body)
        console.log('Uh Oh Crated User')
        return true
      } else {
        console.log('User not Ok')
        return false
      }
    })
  }

  createUserDb (username) {
    let nano = require('nano')('http://root:wake13@localhost:5984/')
    // CREATE THE DATABASE
    return nano.db.create(username, function (err, body) {
      if (!err) {
        console.log(`database ${username} Ok!`)
        return true
      } else alert('Uh Oh Database')
      return false
    })
  }

  createUserDbSecurityParam (username) {
    // SET SECURITY PARAMS - access to db
    let nano = require('nano')(`http://root:wake13@localhost:5984/${username}`)

    return nano.insert({
      admins: { 'names': [], 'roles': [] },
      members: { 'names': [`${username}`], 'roles': [] }
    }, '_security', function (err, body) {
      if (!err) {
        console.log('secured')
        return true
      } else {
        console.log('Security error')
        return false
      }
    })
  }

  passwordStrengthValidator (password) {
    var mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/
    return !!mediumRegex.test(password)
  }

  emailValidator (email) {
    var emailRagex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return !!emailRagex.test(email)
  }

  usernameValidator (username) {
    var ragex = /^[a-z0-9]\w{3}([-_$()+]?[a-z0-9])*$/
    return !!ragex.test(username)
  }

  render () {
    return (
      <div className='register_form'>
        <label for='Username'>Username:</label>
        <input type='text' placeholder='Username'
          onChange={(e) => { this.setState({username: e.target.value}) }}
          value={this.state.username} />
        <label for='email'>Email address:</label>
        <input type='email' placeholder='Email'
          onChange={(e) => { this.setState({email: e.target.value}) }}
          value={this.state.email} />
        <label for='password'>Password:</label>
        <input type='password' placeholder='Password'
          onChange={(e) => { console.log(this.passwordStrengthValidator(e.target.value)); this.setState({password: e.target.value}) }}
          value={this.state.password} />
        <label for='male'>Retype your password:</label>
        <input type='password' placeholder='Re-Enter Password'
          onChange={(e) => { this.setState({password_confirm: e.target.value}) }}
          value={this.state.password_confirm} />

        <button type='submit' onClick={this.newRegistry.bind(this)} class='pure-button'>Sign Up</button>
        <a href=''>Forgot Password?</a>
      </div>
    )
  }
}
