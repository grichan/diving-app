import React, { Component } from 'react'
import Moment from 'moment'
import PouchDB from 'pouchdb'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/jelly.css'

import {connect} from 'react-redux'
import {addService} from '../../actions'

class AddService extends Component {
  constructor (props) {
    super(props)

    this.state = {
      add_Service_name: '',
      add_Service_days: '',
      add_Service_hours: '',
      add_Service_minutes: '',
      add_Service_price: '',
      add_Service_categories: '',
      add_prooduct_description: ''
    }
  };
  componentDidMount () {
    console.log(this.props.services)
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
  addService () {
    console.log('clicked')
    if (this.state.add_Service_name &&
      this.state.add_Service_days &&
      this.state.add_Service_hours &&
      this.state.add_Service_minutes &&
      this.state.add_Service_price &&
      this.state.add_Service_categories &&
      this.state.add_prooduct_description
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
      let duration = `${this.state.add_Service_days}-${this.state.add_Service_hours}-${this.state.add_Service_minutes}`
      let date_id = new Moment().unix()
      var newService = {
        _id: date_id,
        name: this.state.add_Service_name,
        duration: duration,
        price: this.state.add_Service_price,
        categories: this.state.add_Service_categories,
        description: this.state.add_prooduct_description
      }

      db.get(`Services`).then((doc) => {
        console.log(doc)

        var arr = doc.array
        arr.push(newService)
        console.log(arr)
        db.put({
          _id: 'Services',
          _rev: doc._rev,
          array: arr
        })
        return newService
      }).then((newService) => {
        this.alertSuccessTrigger()
        this.props.dispatchAddService(this.props.services, newService)
        this.clearFields()
      }).catch((err) => {
        if (err.status === 404) {
          console.log('Missing Document')
          var doc = {
            '_id': `Services`,
            'array': []
          }
          db.put(doc).then(function () {
            db.replicate.to(`http://localhost:5984/${sessionStorage.getItem('user')}`).on('complete', function () {
              // yay, we're done!
              console.log('replicated to server')
            }).on('error', function (err) {
              console.log('replication to server faled')
              console.log(err)
            })
          })
          console.log('Added Document')
          this.addService()
        } else console.log(err)
      })
    } else {
      this.alertTrigger()
    }
  }

  clearFields () {
    this.setState({

      add_Service_qty: '',
      add_Service_name: '',
      add_Service_storage_id: '',
      add_Service_price: '',
      add_Service_brand: '',
      add_Service_supplier: '',
      add_Service_categories: '',
      add_prooduct_description: ''

    })
  }

  render () {
    return (
      <div>
        <div className='modal_form'>
          <div className='modal_form_box'>
            <Alert className='alert' stack timeout={3000} />
            <h2>Add new Service</h2>
            <p>Shop service involving time. Eg: diving Course</p>
    Name Of Service Eg: Open Water Diver Traning
            <input type='text' onChange={(e) => { this.setState({add_Service_name: e.target.value}) }}
              value={this.state.add_Service_name} />
      Time (DD/HH/MM)
            <div className='days'>
              <input type='number' size='2' min='0' max='365' onChange={(e) => { this.setState({add_Service_days: e.target.value}) }}
                value={this.state.add_Service_days} /> D
            </div>
            <div className='hours'>
              <input type='number' max='23' min='0' onChange={(e) => { this.setState({add_Service_hours: e.target.value}) }}
                value={this.state.add_Service_hours} /> H
            </div>
            <div className='minutes'>
              <input type='number' max='59' min='0' onChange={(e) => { this.setState({add_Service_minutes: e.target.value}) }}
                value={this.state.add_Service_minutes} /> M
            </div>

      Price
            <input type='number' onChange={(e) => { this.setState({add_Service_price: e.target.value}) }}
              value={this.state.add_Service_price} />
    Categories (separated by comma)
            <input type='text' placeholder='example,tag' onChange={(e) => { this.setState({add_Service_categories: e.target.value}) }}
              value={this.state.add_Service_categories} />
    Description
            <textarea rows='4' cols='50' onChange={(e) => { this.setState({add_prooduct_description: e.target.value}) }} value={this.state.add_prooduct_description} />

            <button onClick={this.addService.bind(this)}>Add</button>
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
    services: state.services

  }
}

const mapDispatch = (dispatch) => {
  return {
    dispatchAddService: (ServicesState, arr) => {
      dispatch(addService(ServicesState, arr))
    }
  }
}

// Connect them:
export default connect(mapState, mapDispatch)(AddService)
