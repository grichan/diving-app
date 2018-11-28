import React, { Component } from 'react'
import Moment from 'moment'
import PouchDB from 'pouchdb'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/jelly.css'

import {connect} from 'react-redux'
import {addProduct} from '../../actions'

class AddProduct extends Component {
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
    console.log(this.props.products)
  }
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
        storeId: this.state.add_product_storage_id,
        price: this.state.add_product_price,
        brand: this.state.add_product_brand,
        supplier: this.state.add_product_supplier,
        categories: this.state.add_product_categories,
        discripton: this.state.add_prooduct_description
      }

      db.get(`Products`).then((doc) => {
        console.log(doc)

        var arr = doc.array
        arr.push(newProduct)
        console.log(arr)
        db.put({
          _id: 'Products',
          _rev: doc._rev,
          array: arr
        })
        return newProduct
      }).then((newProduct) => {
        this.alertSuccessTrigger()
        this.props.dispatchAddProduct(this.props.products, newProduct)
        this.clearFields()
      }).catch((err) => {
        if (err.status === 404) {
          console.log('Missing Document')
          var doc = {
            '_id': `Products`,
            'array': []
          }
          db.put(doc)
          console.log('Added Document')
          this.addProduct()
        }
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
        <div className='modal_form'>
          <div className='modal_form_box'>
            <div className='modal_add_products'>
              <Alert className='alert' stack timeout={3000} />
              <h2>Add new Item to stock</h2>

              <div>
                <label htmlFor='text'>Name</label>
                <input type='text' onChange={(e) => { this.setState({add_product_name: e.target.value}) }}
                  value={this.state.add_product_name} />
              </div>

              <div >
                <label htmlFor='text'>StorageId</label>
                <input type='text' size='20' onChange={(e) => { this.setState({add_product_storage_id: e.target.value}) }}
                  value={this.state.add_product_storage_id} />
              </div>

              <label htmlFor='text'>Qty</label>
              <input type='text' size='20' onChange={(e) => { this.setState({add_product_qty: e.target.value}) }}
                value={this.state.add_product_qty} />
              <div />

              <div >
                <label htmlFor='number'>Price for one</label>
                <input type='number' onChange={(e) => { this.setState({add_product_price: e.target.value}) }}
                  value={this.state.add_product_price} />
              </div>

              <div >
                <label htmlFor='text'>Brand Name</label>
                <input type='text' onChange={(e) => { this.setState({add_product_brand: e.target.value}) }}
                  value={this.state.add_product_brand} />
              </div>

              <div >
                <label htmlFor='text'>Supplier</label>
                <input type='text' onChange={(e) => { this.setState({add_product_supplier: e.target.value}) }}
                  value={this.state.add_product_supplier} />
              </div>

              <div >
                <label htmlFor='text'>Categories</label>
                <input type='text' onChange={(e) => { this.setState({add_product_categories: e.target.value}) }}
                  value={this.state.add_product_categories} />
              </div>

              <div >
                <label htmlFor='texarea'>Discription</label>
                <textarea rows='4' cols='50' onChange={(e) => { this.setState({add_prooduct_description: e.target.value}) }} value={this.state.add_prooduct_description} />
              </div>

              <button onClick={this.addProduct.bind(this)}>Add</button>
              <button onClick={this.clearFields.bind(this)}>Clear</button>

            </div>
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
    products: state.products

  }
}

const mapDispatch = (dispatch) => {
  return {
    dispatchAddProduct: (productsState, arr) => {
      dispatch(addProduct(productsState, arr))
    }
  }
}

// Connect them:
export default connect(mapState, mapDispatch)(AddProduct)
