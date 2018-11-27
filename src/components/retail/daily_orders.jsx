import React, { Component } from 'react'
import Moment from 'moment'
import PouchDB from 'pouchdb'
import {MdArrowDropDown} from 'react-icons/lib/md'

export default class Test extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  };

  componentDidMount () {
    this.getOrders()
  }

  createViewDaily () {
    // --------dispaly todays actions--------
    // get todays date

    // filter them in database
    // display
    let user = sessionStorage.getItem('user')
    var emit
    var ddoc = { // design view data pouchdb
      _id: '_design/new',
      views: {
        by_order1: {
          map: function (doc) {
            if (doc._id === 'Orders') {
              doc.array.forEach(function (item) {
                emit(item.date, item) // return item by item.date as key
              })
            }
          }.toString()
        }
      }
    }
    let db = new PouchDB(`${user}`)
    db.put(ddoc).then(() => { // add view
      console.log('View Design Added')
      // success!
    }).catch((err) => {
      console.log('View Design CREATION ERROR')
    })
  }

  queryView () {
    // var start = Moment().startOf('day').unix()
    // console.log(start)
    // let user = sessionStorage.getItem('user')
    // let db = new PouchDB(`${user}`)
    // console.log(start)
    // db.query('new/by_order1', { // query it
    //   startkey: `${start}`
    // }).then((res) => {
    //   console.log(res.rows)
    //   this.setState({
    //     actions_today: res.rows
    //   }, () => {
    //     console.log(this.state.actions_today)
    //   })
    //   //  query results
    // }).catch(function (err) {
    //   console.log(err)
    //   // some error
    // })
  }

  getOrders () {
    let today = Moment().startOf('day').unix()
    let date = new Moment().format('MM-YYYY')
    let docName = date + '-orders'
    let user = sessionStorage.getItem('user')
    let db = new PouchDB(`${user}`)

    db.put({
      _id: `${docName}`
    }).then(function (response) {
      // handle response
    }).catch(function (err) {
      console.log(err)
    })
    db.get(`${docName}`).then((doc) => {
      console.log(doc.array)
      var todayArray = doc.array.filter(order => order.date > today)
      console.log(todayArray)
      return todayArray
    //   let newProduct = {

    //   }

    //   let arr = doc.array
    //   arr.push()
    //   console.log(arr)
    //   return db.put({
    //     _id: docName,
    //     _rev: doc._rev,
    //     array: arr
    //   })
    }).then((todayArray) => {
      console.log(todayArray)
      if (todayArray) {
        this.setState({
          actions_today: todayArray
        })
      }
    }).catch(function (err) {
      console.log(err)
    })
  }

  displayDaily () {
    if (this.state.actions_today) {
      let array = this.state.actions_today
      return array.map((order) => {
        // console.log(order.value.date)
        var dateString = Moment.unix(order.date).format('HH:mm a')
        return (
          <div className='daily_order'>
            <div className='daily_order_box'>
              <a href=''>
                <ul className='title'>
                  <li>{dateString}</li>
                  <li>{order.customers.map((customer) => { return customer.name + ' - ' })}</li>
                  <li>{order.discount}</li>
                  <li>{order.card ? 'true' : 'false'}</li>
                  <li>{order.total}</li>
                  <li><MdArrowDropDown size='30' /></li>
                </ul>

              </a>
              <p />
              <ul className='discription'>{order.products.map((product) => { return <li>{product.name + ' ' + product.qty} </li> })}</ul>
            </div>
          </div>

        )
      })
    }
  }

  render () {
    return (
      <div>
        {this.displayDaily()}
      </div>
    )
  }
}
