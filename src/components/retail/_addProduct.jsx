import React, { Component } from 'react'
import Moment from 'moment'
import PouchDB from 'pouchdb'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/jelly.css'

import {connect} from 'react-redux'
import {addProduct} from '../../actions'

// class Product {
//   constructor () {
//     this.product = {}
//     this.addProduct = function (state) {
//       console.log('Adding Project')
//       let dateId = new Moment().unix()
//       this.product = {
//         _id: dateId,
//         qty: state.product_qty_field,
//         name: state.product_name_field,
//         storeId: state.product_storage_id_field,
//         price: state.product_price_field,
//         brand: state.product_brand_field,
//         supplier: state.product_supplier_field,
//         categories: state.product_categories_field,
//         discripton: state.prooduct_description_field
//       }
//       const con = new DatabaseConnection(window.sessionStorage.getItem('user'))
//       con.updateDocument('Products', this.product)
//         .then((newProduct) => {
//         // IF SUCCESS
//           console.log(this)
//           // this.alertSuccessTrigger()
//           // AddProduct.props.dispatchAddProduct(AddProduct.props.products, newProduct)
//           // this.clearFields()
//         }).catch((err) => {
//           if (err.status === 404) {
//           // IF FAIL
//             console.log('Missing Document')
//             let doc = {
//               '_id': `Products`,
//               'array': []
//             }
//             this.db.put(doc)
//             console.log('Added Document')
//             this.updateDocument('Products', this.product)
//           }
//           console.log(err)
//         })
//     }
//   }
// }

// class DatabaseConnection {
//   constructor (user) {
//     this.db = new PouchDB(`${user}`)

//     this.updateDocument = function (docName, data) {
//       this.db.get(docName).then((doc) => {
//         this.db.put({
//           _id: 'Products',
//           _rev: doc._rev,
//           array: doc.array.push(data)
//         })
//         return data
//       })
//     }
//   }
// }

// const newProducts = new Product()

class AddProduct extends Component { // COMPONENT
  constructor (props) {
    super(props)
    //    this.newProduct = new Product()
    this.state = {
      product_qty_field: '',
      product_name_field: '',
      product_storage_id_field: '',
      product_price_field: '',
      product_brand_field: '',
      product_supplier_field: '',
      product_categories_field: '',
      prooduct_description_field: ''
    }
  };

  componentDidMount () {
    console.log(this.props.products)
    console.log('state', this.state)
    console.log('Main CLass', this)
    // console.log(newProducts)
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

  clearFields () {
    this.setState({

      product_qty_field: '',
      product_name_field: '',
      product_storage_id_field: '',
      product_price_field: '',
      product_brand_field: '',
      product_supplier_field: '',
      product_categories_field: '',
      prooduct_description_field: ''
    })
  }

  render () {
    return (
      <div>
        <div className='modal_form'>
          <div className='modal_form_box'>
            <div className='modal_products'>
              <Alert className='alert' stack timeout={3000} />
              <h2>Add new Item to stock</h2>

              <div>
                <label htmlFor='text'>Name</label>
                <input type='text' onChange={(e) => { this.setState({product_name_field: e.target.value}) }}
                  value={this.state.product_name_field} />
              </div>

              <div >
                <label htmlFor='text'>StorageId</label>
                <input type='text' size='20' onChange={(e) => { this.setState({product_storage_id_field: e.target.value}) }}
                  value={this.state.product_storage_id_field} />
              </div>

              <label htmlFor='text'>Qty</label>
              <input type='text' size='20' onChange={(e) => { this.setState({product_qty_field: e.target.value}) }}
                value={this.state.product_qty_field} />
              <div />

              <div >
                <label htmlFor='number'>Price for one</label>
                <input type='number' onChange={(e) => { this.setState({product_price_field: e.target.value}) }}
                  value={this.state.product_price_field} />
              </div>

              <div >
                <label htmlFor='text'>Brand Name</label>
                <input type='text' onChange={(e) => { this.setState({product_brand_field: e.target.value}) }}
                  value={this.state.product_brand_field} />
              </div>

              <div >
                <label htmlFor='text'>Supplier</label>
                <input type='text' onChange={(e) => { this.setState({product_supplier_field: e.target.value}) }}
                  value={this.state.product_supplier_field} />
              </div>

              <div >
                <label htmlFor='text'>Categories</label>
                <input type='text' onChange={(e) => { this.setState({product_categories_field: e.target.value}) }}
                  value={this.state.product_categories_field} />
              </div>

              <div >
                <label htmlFor='texarea'>Discription</label>
                <textarea rows='4' cols='50' onChange={(e) => { this.setState({prooduct_description_field: e.target.value}) }} value={this.state.prooduct_description_field} />
              </div>

              {/* <button onClick={newProducts.addProduct(this.state)}>Add</button> */}
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

console.log(AddProduct)

// Connect them:
export default connect(mapState, mapDispatch)(AddProduct)
