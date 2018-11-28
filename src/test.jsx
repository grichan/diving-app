import React, { Component } from 'react'
import Moment from 'moment'
import PouchDB from 'pouchdb'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/jelly.css'
export default class Test extends Component {
  constructor (props) {
    super(props)

    this.state = {
      add_product_qty: '',
      add_product_name: '',
      add_product_storage_id: '',
      add_product_price: '',
      add_product_brand: '',
      add_product_supplier: '',
      add_product_categories: '',
      add_prooduct_description: ''
    }
  };
  componentDidMount () {

  }
  // HTML
  alertTrigger () {
    Alert.error('<h4>Please Fill Out All The Fields</h4>', {
      position: 'bottom-right',
      effect: 'jelly',
      html: true

    })
  }
  addProduct () {
    console.log('clicked')
    if (this.state.add_product_qty &&
      this.state.add_product_name &&
      this.state.add_product_storage_id &&
      this.state.add_product_price &&
      this.state.add_product_brand &&
      this.state.add_product_supplier &&
      this.state.add_product_categories &&
      this.state.add_prooduct_description
    ) {
      let date = new Moment().format('MM-YYYY')
      let docName = date + '-orders'

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
        _id: date_id,
        qty: this.state.add_product_qty,
        name: this.state.add_product_name,
        soreId: this.state.add_product_storage_id,
        price: this.state.add_product_price,
        brand: this.state.add_product_brand,
        supplier: this.state.add_product_supplier,
        categories: this.state.add_product_categories,
        discripton: this.state.add_prooduct_description
      }

      db.get(`Products`).then(function (doc) {
        console.log(doc)

        let arr = doc.array
        arr.push(newProduct)
        console.log(arr)
        return db.put({
          _id: 'Products',
          _rev: doc._rev,
          array: arr
        })
      }).then(function (response) {
      // handle response
      }).catch(function (err) {
        console.log(err)
      })
    } else {
      this.alertTrigger()
    }
  }

  clearFields () {
    this.setState({

      add_product_qty: '',
      add_product_name: '',
      add_product_storage_id: '',
      add_product_price: '',
      add_product_brand: '',
      add_product_supplier: '',
      add_product_categories: '',
      add_prooduct_description: ''

    })
  }

  render () {
    return (
      <div>
Test
        <div className='modal_form'>
          <div className='modal_form_box'>
            <a href='#' className='button buttonInfo' onClick={this.alertTrigger}>message with HTML</a>
            <Alert className='alert' stack timeout={3000} />
            <h2>Add new Item to stock</h2>
    Product name Search
            <input type='text' />
    Name
            <input type='text' onChange={(e) => { this.setState({add_product_name: e.target.value}) }}
              value={this.state.add_product_name} />
    Storage Id
            <input type='text' onChange={(e) => { this.setState({add_product_storage_id: e.target.value}) }}
              value={this.state.add_product_storage_id} />

    Qty
            <input type='text' onChange={(e) => { this.setState({add_product_qty: e.target.value}) }}
              value={this.state.add_product_qty} />

      Price for one
            <input type='text' onChange={(e) => { this.setState({add_product_price: e.target.value}) }}
              value={this.state.add_product_price} />

    Brand Name
            <input type='text' onChange={(e) => { this.setState({add_product_brand: e.target.value}) }}
              value={this.state.add_product_brand} />
    Supplier
            <input type='text' onChange={(e) => { this.setState({add_product_supplier: e.target.value}) }}
              value={this.state.add_product_supplier} />

    Categories
            <input type='text' onChange={(e) => { this.setState({add_product_categories: e.target.value}) }}
              value={this.state.add_product_categories} />
    Discription
            <textarea rows='4' cols='50' onChange={(e) => { this.setState({add_prooduct_description: e.target.value}) }} value={this.state.add_prooduct_description} />

            <button onClick={this.addProduct.bind(this)}>Add</button>
            <button onClick={this.clearFields.bind(this)}>Clear</button>
          </div>
        </div>
      </div>
    )
  }
}
