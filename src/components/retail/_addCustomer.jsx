import React, { Component } from 'react'
import Moment from 'moment'
import PouchDB from 'pouchdb'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/jelly.css'

// ACTIONS
import {connect} from 'react-redux'
import {addCustomer} from '../../actions'

// PLUGINS
PouchDB.plugin(require('pouchdb-find'))
PouchDB.plugin(require('pouchdb-quick-search'))

class AddCustomer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      add_customer_first_name: '',
      add_customer_last_name: '',
      add_customer_email: '',
      add_customer_phone: '',
      add_customer_nationality: '',
      searchBox: '',
      searchSuggestions: '',
      diver_bool: false
    }
  };
  componentDidMount () {
    console.log(this.props.products)

    var pouch = new PouchDB(`${sessionStorage.getItem('user')}`)
    pouch.replicate.to(`http://localhost:5984/${sessionStorage.getItem('user')}`).on('complete', function () {
      // yay, we're done!
      console.log('replicated to server')
    }).on('error', function (err) {
      console.log('replication to server faled')
      console.log(err)
    })
    return pouch.allDocs({
      startkey: 'mar',
      endkey: 'mar\uffff',
      include_docs: true
    }).then((res) => {
      console.log(res)
    })
  }
  // HTML
  alertTrigger () {
    Alert.error('<h4>Please Fill Out All The Fields</h4>', {
      position: 'bottom-right',
      effect: 'jelly',
      html: true

    })
  }
  alertSuccessTrigger () {
    Alert.success('<h4>Added to database</h4>', {
      position: 'bottom-right',
      effect: 'jelly',
      html: true

    })
  }

  alertChooseTrigger () {
    Alert.success('<h4>Customer Added</h4>', {
      position: 'bottom-right',
      effect: 'jelly',
      html: true

    })
  }

  addProduct () {
    console.log('clicked')
    if (this.state.add_customer_first_name &&
      this.state.add_customer_last_name &&
      this.state.add_customer_email &&
      this.state.add_customer_phone &&
      this.state.add_customer_nationality
    ) {

      let user = sessionStorage.getItem('user')
      let db = new PouchDB(`${user}`)

      // IF DOESNT EXIST CREATE ONE
      // db.put({
      //   _id: `${docName}`
      // }).then(function (response) {
      //   // handle response
      // }).catch(function (err) {
      //   console.log(err)
      // })
      let date_id = new Moment().unix()
      var newProduct = {
        id: date_id,
        _id: `Customer-${date_id}`,
        first_name: this.state.add_customer_first_name,
        last_name: this.state.add_customer_last_name,
        email: this.state.add_customer_email,
        phone: this.state.add_customer_phone,
        nationality: this.state.add_customer_nationality,
        diver: this.state.diver_bool
      }

      db.put({ // add our updated array with new customer
        _id: `Customer-${date_id}`,
        id: date_id,
        first_name: this.state.add_customer_first_name,
        last_name: this.state.add_customer_last_name,
        email: this.state.add_customer_email,
        phone: this.state.add_customer_phone,
        nationality: this.state.add_customer_nationality,
        diver: this.state.diver_bool
      })
        .then(() => {
          this.alertSuccessTrigger()
          this.clearFields()
          this.props.dispatchAddCustomer(this.props.pending_customers, newProduct) // update customers pending state
        })
        .then(function () {
          db.replicate.to(`http://localhost:5984/${sessionStorage.getItem('user')}`).on('complete', function () {
          // yay, we're done!
            console.log('replicated to server')
          })
            .on('error', function (err) {
              console.log('replication to server faled')
              console.log(err)
            })
        })
        .catch((err) => {
          if (err.status === 404) {
            console.log('Missing Document')
            var doc = {
              '_id': `Customers`,
              'array': []
            }
            db.put(doc)
            console.log('Added Document')
            this.addProduct()
          }
        })
    } else {
      this.alertTrigger()
    }
  }

  dsiplaySiggestions () {
    if (this.state.searchSuggestions) {
      console.log(this.state.searchSuggestions)
      return this.state.searchSuggestions.map((suggestion) => {
        return (
          <li>{suggestion.key}  {suggestion.value} <button id={suggestion.value} onClick={(e) => { this.onAddClickCustomer(e) }}>add</button></li>
        )
      })
    }
    return (
      <p>Search for Custumers</p>
    )
  }

  onAddClickCustomer (e) {
    console.log('clicked')
    if (this.state.searchSuggestions) {
      console.log(this.state.searchSuggestions)
      let choosenCuustomer = this.state.searchSuggestions.filter(suggestion => suggestion.value === e.currentTarget.id)
      console.log(choosenCuustomer)
      this.props.dispatchAddCustomer(this.props.pending_customers, choosenCuustomer) // update customers pending state
      this.alertChooseTrigger()
    }
  }

  findCustomer () {
    console.log(this.state.searchSuggestions)
    let db = new PouchDB(sessionStorage.getItem('user'))
    let emit
    function myMapFunction (doc) {
      if (doc._id.startsWith('Customer-')) {
        emit(`${doc.first_name} ${doc.last_name}`, doc._id)
      }
    }

    // find the first 5 pokemon whose name starts with 'P'
    db.query(myMapFunction, {
      startkey: `${this.state.searchBox}`,
      limit: 10,
      include_docs: false
    }).then((result) => {
      // handle result
      this.setState({searchSuggestions: result.rows}) // NEED TO FINISH THIS !!!!!!
      console.log(result.rows)
    }).catch(function (err) {
      // handle errors
    })
  }

  clearFields () {
    this.setState({

      add_customer_first_name: '',
      add_customer_last_name: '',
      add_customer_email: '',
      add_customer_phone: '',
      add_customer_nationality: ''

    })
  }

  render () {
    return (
      <div>
        <div className='modal_form'>
          <div className='modal_form_box'>
            <Alert className='alert' stack timeout={3000} />
            <h2>New Customer</h2>
    First Name
            <input type='text' onChange={(e) => { this.setState({add_customer_first_name: e.target.value}) }}
              value={this.state.add_customer_name} />
    Last Name
            <input type='text' onChange={(e) => { this.setState({add_customer_last_name: e.target.value}) }}
              value={this.state.add_customer_storage_id} />

    Email
            <input type='text' onChange={(e) => { this.setState({add_customer_email: e.target.value}) }}
              value={this.state.add_customer_qty} />

     phone
            <input type='text' onChange={(e) => { this.setState({add_customer_phone: e.target.value}) }}
              value={this.state.add_customer_price} />

    Nationality
            <input type='text' onChange={(e) => { this.setState({add_customer_nationality: e.target.value}) }}
              value={this.state.add_customer_brand} />
            <label htmlFor='card' className='pure-checkbox'>
              <input id='diver' checked={this.state.diver_bool} onChange={() => { this.setState({diver_bool: !this.state.diver_bool}) }} type='checkbox' />Diver
            </label>
            <button onClick={this.addProduct.bind(this)}>Add</button>
            <button onClick={this.clearFields.bind(this)}>Clear</button>
          </div>
        </div>
      </div>
    )
  }
}
// Maps `state` to `props`:
// These will be added as props to the component.
function mapState (state) {
  return {
    pending_customers: state.customers

  }
}

const mapDispatch = (dispatch) => {
  return {
    dispatchAddCustomer: (newCustomersArray, newProduct) => {
      dispatch(addCustomer(newCustomersArray, newProduct))
    }
  }
}

// Connect them:
export default connect(mapState, mapDispatch)(AddCustomer)
