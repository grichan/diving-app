import React, { Component } from 'react'

// COMPNENTS
import Search from '../search'
import AppNavigation from '../header'
import AddProduct from './_addProduct'

// 3d PARTY
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Moment from 'moment'
import PouchDB from 'pouchdb'
import {connect} from 'react-redux'
import {addProductsArray, addProduct} from '../../actions'
import Modal from 'react-responsive-modal';
import Fade  from 'react-reveal/Fade'

class Products extends Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false,
      open1: false,
      edit_product_qty: '',
      edit_product_name: '',
      edit_product_storage_id: '',
      edit_product_price: '',
      edit_product_brand: '',
      edit_product_supplier: '',
      edit_product_categories: '',
      edit_prooduct_description: '',
      currentlyEditing: ''
    }
  };
  componentDidMount(){
    console.log(this.props.products.length);
    if (this.props.products.length == 0) {
      var localDB = new PouchDB(`${sessionStorage.getItem('user')}`, {skip_setup: true});
      localDB.get('Products').then((doc) => {
        //console.log('yea')
        console.log(doc.array)
        return doc.array
            //console.log(item);
        }).then((res) => {
          this.props.dispatchAddProductsArray(res).then(()=>{
            return console.log(this.props.products.map((item)=>{return console.log(item)})) 
            }) 
        }).catch(function (err) {
          //console.log(err);
          });
        //console.log(array);
    }
  }
  editProduct () {
    console.log('Click')
    
  }
  onOpenModal = (e) => {
    console.log(e.target.id);
    let productForEdit = this.props.products.filter(item => item._id == e.target.id)
    this.setState({
      edit_product_qty: productForEdit[0].qty,
      edit_product_name: productForEdit[0].name,
      edit_product_storage_id: productForEdit[0].storeId,
      edit_product_price: productForEdit[0].price,
      edit_product_brand: productForEdit[0].brand,
      edit_product_supplier: productForEdit[0].supplier,
      edit_product_categories: productForEdit[0].categories,
      edit_prooduct_description: productForEdit[0].discripton
    }, ()=>{
      console.log(productForEdit[0])
      this.setState({ open: true, currentlyEditing: productForEdit });
    })
  
    };
    
    onOpenModal1 = () => {
        this.setState({ open1: true});
    }
    onCloseModal = () => {
    this.setState({ open: false });
    };

    onCloseModal1 = () => {
      this.setState({ open1: false });
      };
    
  getProducts () {
    // BY MONTH
    var db = new PouchDB(`${sessionStorage.getItem('user')}`)
    let date = new Moment().format('MM-YYYY')
    let docName = date + '-orders'
    if (!this.props.products) {
      // fetch Db
      db.get('Products').then((doc) => {
        console.log(doc.array)
        this.setState({
          data: doc.array
        })
      }).then(() => {
      // fetch mittens again
        console.log('Complete!')
      }).catch((err) => {
        console.log('Placing Order Error')
        if (err.status === 404) {
          console.log('Missing Document')
          var doc = { // if doc missing create one
            '_id': `${docName}`,
            'array': []
          }
          db.put(doc)
          console.log('Added Document')
          this.getProducts() // retry function
        }
      })
    }
  }

  saveChanges(e){
    let edditing = this.state.currentlyEditing[0]
    edditing.qty =this.state.edit_product_qty
    edditing.name = this.state.edit_product_name
    edditing.storeId = this.state.edit_product_storage_id
    edditing.price = this.state.edit_product_price
    edditing.brand = this.state.edit_product_brand
    edditing.supplier = this.state.edit_product_supplier 
    edditing.categories = this.state.edit_product_categories 
    edditing.discripton = this.state.edit_prooduct_description 
    console.log(edditing);

    var db = new PouchDB(`${sessionStorage.getItem('user')}`)
    db.get(`Products`).then((doc) => {
      var arr = doc.array.filter(item => item._id !== this.state.currentlyEditing[0]._id)
      console.log(arr)
      arr.push(edditing)
      db.put({
        _id: 'Products',
        _rev: doc._rev,
        array: arr
      })
      this.onCloseModal1()
      return edditing
    })
    .catch((err) => {
      console.log(err)
    })

    
  }

  deleteProduct(){
    console.log('delete')
    var db = new PouchDB(`${sessionStorage.getItem('user')}`)
    db.get(`Products`).then((doc) => {
      var arr = doc.array.filter(item => item._id !== this.state.currentlyEditing[0]._id)
      console.log(arr)
      db.put({
        _id: 'Products',
        _rev: doc._rev,
        array: arr
      }).then(()=>{
        this.props.dispatchAddProductsArray(arr)
      })
      
      this.onCloseModal()
    })
    .catch((err) => {
      console.log(err)
    })
  }
  

  render () {
    const columns = [
      {
        Header: 'Id',
        accessor: '_id'
      }, {
        Header: 'storeId',
        accessor: 'storeId'
      }, {
        Header: 'name',
        accessor: 'name'
      }, {
        Header: 'qty',
        accessor: 'qty'
      }, {
        Header: 'brand',
        accessor: 'brand'
      }, {
        Header: 'supplier',
        accessor: 'supplier'
      }, {
        Header: 'categories',
        accessor: 'categories'
      }, {
        Header: 'discripton',
        id: 'discripton',
        accessor: d => d.discription
      }, {
        Header: 'price',
        accessor: 'price' // String-based value accessors!
      }, {
        Header: '',
        id: 'edit',
        accessor: d => ( 
          <div>
          <button className='edditProducts' id={d._id} onClick={(e)=> this.onOpenModal(e)}>Edit</button>
        </div>
        )
      }]
    return (
      <div className='component_container'>
        <Modal classNames='modal_edit_products'  open={this.state.open1} onClose={this.onCloseModal1} center>
        <AddProduct/>
        </Modal>



        <Modal classNames='modal_edit_products'  open={this.state.open} onClose={this.onCloseModal} center>
        <div className='modal_form_box eddit_products'>
    Name
            <input type='text' onChange={(e) => { this.setState({edit_product_name: e.target.value}) }}
              value={this.state.edit_product_name} />
    Storage Id
            <input type='text' onChange={(e) => { this.setState({edit_product_storage_id: e.target.value}) }}
              value={this.state.edit_product_storage_id} />

    Qty
            <input type='text' onChange={(e) => { this.setState({edit_product_qty: e.target.value}) }}
              value={this.state.edit_product_qty} />

      Price for one
            <input type='text' onChange={(e) => { this.setState({edit_product_price: e.target.value}) }}
              value={this.state.edit_product_price} />

    Brand Name
            <input type='text' onChange={(e) => { this.setState({edit_product_brand: e.target.value}) }}
              value={this.state.edit_product_brand} />
    Supplier
            <input type='text' onChange={(e) => { this.setState({edit_product_supplier: e.target.value}) }}
              value={this.state.edit_product_supplier} />

    Categories
            <input type='text' onChange={(e) => { this.setState({edit_product_categories: e.target.value}) }}
              value={this.state.edit_product_categories} />
    Discription
            <textarea rows='4' cols='50' onChange={(e) => { this.setState({edit_prooduct_description: e.target.value}) }} value={this.state.edit_prooduct_description} />

            <button onClick={(e)=>{this.saveChanges(e)}}>Save</button>
            <button onClick={this.onCloseModal}>Cancel</button>
            <button onClick={this.deleteProduct.bind(this)}>Delete</button>
          </div>
          </Modal>


        <AppNavigation />
        <div className='container_right'>
          <Search />
          <div className='right_header'>
        <h1>Products</h1>
      </div>
          <div className='right_content'>
          <Fade>
            <div>

            <div className='products_container' >
              <div className='controls'>
                <button onClick={this.onOpenModal1}>Add Product</button>
              </div>

                <ReactTable
                    data={this.props.products}
                    columns={columns}
                    defaultPageSize={10}
                    minRows={3}
                    className='tableProducts -striped -highlight'
                  />
            </div>
            </div>            
            </Fade>
          </div>
        </div>
      </div>
    )
  }
};

// These will be added as props to the component.
function mapState (state) {
  console.log(state.products)
  return {
    products: state.products,
    customers: state.customers
  }
}

const mapDispatch = (dispatch) => {
  return {
    dispatchAddProductsArray: (array) => {
      dispatch(addProductsArray(array))
    },
      dispatchAddProduct: (productsState, arr) => {
        dispatch(addProduct(productsState, arr))
      }
    
  }
}

// Connect them:
export default connect(mapState, mapDispatch)(Products)
