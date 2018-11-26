import React, { Component } from 'react'
import {FaSearch, FaRefresh} from 'react-icons/lib/fa'
// import { userInfo } from 'os'
import avatar from '../images/avatar.png'
import PouchDB from 'pouchdb'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/jelly.css'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {productsList} from '../actions/'

class Search extends Component {
  constructor (props) {
    super(props)

    this.state = {

    }
  }

  componentWillMount () {
    this.setState({
      user: sessionStorage.getItem('user')
    }, () => {
      console.log('done')
    }, () => {
      var db = new PouchDB(`http://localhost:5984/${sessionStorage.getItem('user')}`)
      var mydb = new PouchDB(`${sessionStorage.getItem('user')}`)
      mydb.replicate.from(db)
      this.sync(this.state.user)
      mydb.replicate.to(db)
      db.info().then(function (info) {
        console.log(info)
      })
    })
  }

  componentDidMount () {

  }

  sync (user) {
    if (sessionStorage.getItem('sync') === 'false') {
      PouchDB.sync(`${user}`, `http://localhost:5984/${user}`, {
        live: true,
        retry: true
      }).on('change', function (info) {
        this.alertTriggerSyncInProgress()
        console.log('change in DBss detected')
        this.alertTrigger()
      }).on('paused', (err) => {
        console.log(err)
        // this.alertTriggerSyncUptoDate()
        // replication paused (e.g. replication up to date, user went offline)
        console.log('replication paused (e.g. replication up to date, user went offline)')
      }).on('active', () => {
        // replicate resumed (e.g. new changes replicating, user went back online)
        this.alertTriggerSyncInProgress()
        console.log('replicate resumed (e.g. new changes replicating, user went back online)')
      }).on('denied', (err) => {
        console.log(err)
        // a document failed to replicate (e.g. due to permissions)
        console.log('a document failed to replicate (e.g. due to permissions)')
      }).on('complete', (info) => {
        console.log('Sync Complete)')
        this.alertTriggerSyncUptoDate()
        // handle complete
        console.log('handle complete')
      }).on('error', (err) => {
        // handle error
        console.log('error occured')
        console.log(JSON.stringify(err))
        if (err.status === 401) {
          console.log('unouthorized')
          sessionStorage.removeItem('Auth')
        }
      })
      sessionStorage.setItem('sync', true)
    } else { console.log('Sync is online') }
  }
  alertTriggerSyncInProgress () {
    Alert.Info('<h4>Sync In Progress</h4><p>Please Wait...</p>', {
      position: 'bottom',
      effect: 'jelly',
      html: true

    })
  }
  alertTriggerSyncUptoDate () {
    Alert.success('<h4>Database Up to date</h4><p></p>', {
      position: 'top',
      effect: 'jelly',
      html: true

    })
  }
  alertTriggerNewChanges () {
    Alert.Info('<h4>Database Up to date</h4><p></p>', {
      position: 'bottom',
      effect: 'jelly',
      html: true

    })
  }
  deleteCookie () {
    document.cookie = 'AuthSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    this.props.history.push('/signup')
  }

  render () {
    return (
      <div className='search_container'>
        <Alert className='alert' stack timeout={5000} />

        <div className='search'>
          <input type='text' className='pure-input-rounded' />
          <button type='submit' className='pure-button'><FaSearch /></button>
        </div>

        <div className='search_accpunt'>
          <button onClick={() => { this.sync() }} className='syncButton pure-button'><FaRefresh className='syncAnimation' /></button>
          <img src={avatar} alt={sessionStorage.getItem('user')} />

          <div className='pure-menu pure-menu-horizontal search_menu'>
            <ul className='pure-menu-list'>
              <li className='pure-menu-item pure-menu-has-children pure-menu-allow-hover'>
                <a id='menuLink1' className='pure-menu8link'>{sessionStorage.getItem('user')}</a>
                <ul className='pure-menu-children'>
                  <li className='pure-menu-item'><a className='pure-menu-link'>Settings</a></li>
                  <li onClick={() => { this.deleteCookie() }} className='pure-menu-item'>Logout</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
};

// Maps `state` to `props`:
// These will be added as props to the component.
function mapState (state) {
  return {
    products: state.products
  }
}

const mapDispatch = (dispatch) => {
  return {
    list: () => {
      dispatch(productsList())
    }
  }
}

// Connect them:
// export default connect(mapState, mapDispatch)(Search)
export default withRouter(connect(mapState, mapDispatch)(Search))
