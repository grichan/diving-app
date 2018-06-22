import React, { Component } from 'react';
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {
    updateToPendingProducts,
    updateToPendingCustomers,
    addProductsArray,
    updateToPendingServices,
    addToPendingProducts,
    addToPendingCustomers,
    addToPendingServices} from '../../actions'

// COMPONENTS
import Search from '../search';
import AppNavigation from '../header';
import AddProduct from './_addProduct';
import AddCustomer from './_addCustomer';
import SelectiveSearch from './selective_search';

// 3d-party
import PouchDB from 'pouchdb';
import {IoAndroidClose} from 'react-icons/lib/io'
import cookie from 'react-cookies'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/jelly.css'
import 'react-s-alert/dist/s-alert-css-effects/slide.css'
import 'react-s-alert/dist/s-alert-css-effects/flip.css'
import Fade  from 'react-reveal/Fade'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Modal from 'react-responsive-modal';
import Moment from 'moment'

var date =  Date.now();
console.log(date)
console.log(Moment(date)._d)

class Sales extends Component {
constructor(props) {
super(props);

this.search_product = React.createRef();

this.state = {
    open: false,
    openSecondModal: false,
    pending_items: [],
    products: [],
    filteredProducts: [],
    search_product_value: '',
    subtotal : 0,
    recivedAmount: 0,
    comments: '',
    orders_today: [],

    add_product_qty: '',
    add_product_name: '',
    add_product_storage_id: '',
    add_product_price: '',
    add_product_brand: '',
    add_product_supplier: '',
    add_product_categories: '',
    add_prooduct_description: '',

    card_bool: false

};
}

componentDidMount(){
    let subtotal = this.calculateSubtotal()
    this.setState({
        total: subtotal
    })
    var localDB = new PouchDB(`${sessionStorage.getItem('user')}`, {skip_setup: true});

    localDB.get('Products').then((doc) => {
        //console.log('yea')
        //console.log(doc)
        var array = [];
        doc.array.map((item) => {
            return array.push(item)
        })
        this.props.dispatchAddProductsArray(array).then(()=>{
        console.log(this.props.products.map((item)=>{return console.log(item)}))
            
        })    
        //console.log(array);
        
        }).catch(function (err) {
        //console.log(err);
        });
}

// ----------------- MODAL -----------------
onOpenModal = () => {
    this.setState({ open: true });
    };

onCloseModal = () => {
    this.setState({ open: false });
    };

onOpenSecondModal = () => {
    this.setState({ openSecondModal: true });
  };

onCloseSecondModal = () => {
    this.setState({ openSecondModal: false });
    };


changeQty(event) {
    if (this.props.pending_products) {
        switch (event.target.id) {
            case 'Product':
                return this.changeProductQty(event.target.id, event.target.name, event.target.value)
            case 'Service':
                return this.changeServiceQty(event.target.id, event.target.name, event.target.value)
            default:
                break;
        }

    }
}

changeProductQty(id,itemId,qty){
    console.log(id)
    console.log(itemId)
    if (this.props.pending_products) {
        let item = this.props.pending_products.find((item) => {
            if (item._id === itemId) {
            return item
            } else return null
        })
        console.log(item);
        item.qtyToBuy = qty
        console.log(item.qtyToBuy);
        let index = this.props.pending_products.indexOf(item)
        let updateState = this.props.pending_products
        updateState[index] = item
        console.log(updateState[index]);
        this.props.updateToPendingProducts(updateState)
        this.setState({
            pending_items: updateState
        })            
    }

}

changeServiceQty(id,itemId,qty){
    console.log(id)
    console.log(itemId)
    if (this.props.pending_services) {
        let item = this.props.pending_services.find((item) => {
            if (item._id === itemId) {
            return item
            } else return null
        })
        console.log(item);
        item.qtyToBuy = qty
        console.log(item.qtyToBuy);
        let index = this.props.pending_services.indexOf(item)
        let updateState = this.props.pending_services
        updateState[index] = item
        console.log(updateState[index]);
        this.props.updateToPendingServices(updateState)
        // this.setState({
        //     pending_items: updateState
        // }) 
    }
}

changeDiscount(event) {
    if (this.props.pending_products) {
        switch (event.target.id) {
            case 'Product':
                return this.changeProductDisc(event.target.id, event.target.name, event.target.value)
            case 'Service':
                return this.changeServiceDisc(event.target.id, event.target.name, event.target.value)
            default:
                break;
        }

    }
}
changeProductDisc(id,itemId,qty){
    console.log(id)
    console.log(itemId)
    if (this.props.pending_products) {
        let item = this.props.pending_products.find((item) => {
            if (item._id === itemId) {
            return item
            } else return null
        })
        console.log(item);
        item.discount = qty
        console.log(item.discount);
        let index = this.props.pending_products.indexOf(item)
        let updateState = this.props.pending_products
        updateState[index] = item
        console.log(updateState[index]);
        this.props.updateToPendingProducts(updateState)   
    }

}
changeServiceDisc(id,itemId,qty){
    console.log(id)
    console.log(itemId)
    if (this.props.pending_services) {
        let item = this.props.pending_services.find((item) => {
            if (item._id === itemId) {
            return item
            } else return null
        })
        console.log(item);
        item.discount = qty
        console.log(item.discount);
        let index = this.props.pending_services.indexOf(item)
        let updateState = this.props.pending_services
        updateState[index] = item
        console.log(updateState[index]);
        this.props.updateToPendingServices(updateState)
        // this.setState({
        //     pending_items: updateState
        // }) 
    }
}

finalizeOrder(e) {

    //console.log(this.state.pending_items )

    
    if (!this.props.pending_products.length <= 0 || !this.props.pending_services.length <= 0) {
        let date = new Moment().format('MM-YYYY')
        let date_id = new Moment().unix()

        let orderProducts = []
        this.props.pending_products.foreach((item) =>{
            this.qtyCheck(item)
            orderProducts.push({
                "_id" : `${item._id}`,
                "name": `${item.name}`,
                "qty": `${item.qtyToBuy}`, // if 0 delete it 
                "discount": `${item.discount}`,
                "price": `${item.price}`
            })
        })
        console.log(orderProducts)
        let orderCustomers = []
        if (this.props.customers) {
            //console.log(this.props.customers)
            this.props.pending_customers.map((item) =>{
                orderCustomers.push({
                    "first_name": `${item.first_name}`,
                    "last_name": `${item.last_name}`, // if 0 delete it 
                    "_id": `${item._id}`
                })
            })
            //console.log(orderCustomers);

        let orderServices = []
        if (this.props.pending_services) {
            //console.log(this.props.customers)
            this.props.pending_services.map((item) =>{
                this.qtyCheck(item)
                orderServices.push({
                    "_id": `${item._id}`,
                    "name": `${item.name}`, // if 0 delete it 
                    "price": `${item.price}`,
                    "qty": `${item.qtyToBuy}`, // if 0 delete it 
                    "discount": `${item.discount}`
                })
            })
    }
        // card true false 
        // total 
        // pouchdb  
           let data = {
            "id": `${date_id}`,
            "date": `${date_id}`,
            "products": orderProducts,
            "customers": orderCustomers,
            "services": orderServices,
            "card": this.state.card_bool,
            "total": this.calculateSubtotal(),
            "comments": this.state.comments
            }
            console.log(data);
            this.addOrdersToDb(data)
            this.props.updateToPendingProducts([])
            this.props.updateToPendingServices([])
            this.props.updateToPendingCustomers([])
        }
        // get all the orders that are pending 
        // create the orders structure data
        // add it to orders pouch db 
        
    } else this.alertTriggerEmptyForm()  
}

qtyCheck(product){
    if ((product.qty - product.qtyToBuy) <= 0 ) {
        console.log('QTYCHECK:DETE IN PROGRESS');
        this.deleteProduct(product)
    } else {
        let newProductQty = product.qty - product.qtyToBuy 
        console.log('QTYCHECK:UPDATE IN PROGRESS');        
        this.updateProductQty(product)

    }
}


deleteProduct(product){
    console.log('QTYCHECK->DELETEPRODUCT');        
    let date = new Moment().format('MM-YYYY')
    let docName = date + '-orders'
    let date_id = new Moment().unix()

    let doc = this.getDbDoc(docName).then((res)=>{
        console.log('DOC FROM GETDOC:',res);
        if (res) {
            let array = res.array.filter(item => item._id !== product._id) // filter out the item 
            this.updateDbDocArray(docName, array).then(()=>{
                this.replicateToRemoteDb()
                console.log('Deleted Product');
            }).catch((err)=>{
                if (err.status == 409) {
                    
                }
            })
        }
    })
 
}

updateProductQty(product) {
    console.log('QTYCHECK->UPDATEPRODUCT');        
    let date = new Moment().format('MM-YYYY')
    let docName = date + '-orders'

    let doc = this.getDbDoc(docName).then((res)=>{
        if (res) {
            let updateProduct = res.array.filter(item => item._id === product._id)
            updateProduct.qty = product.qty - product.qtyToBuy
            let arr = res.array.filter(item => item._id !== product._id)
            arr.push(updateProduct)
            this.updateDbDocArray(docName,arr).then(()=>{
                this.replicateToRemoteDb()
                console.log('QTYCHECK->UPDATEPRODUCT->SUCCESS');
            })
        }
    })
    
}

getDbDoc(docName) {
    let db = new PouchDB(`${sessionStorage.getItem('user')}`);
    return db.get(docName).then((doc) => {
        console.log('getDbDoc:Fetching doc');
        return doc
    }).catch('error', function (err) {
        console.log(err)
        console.log('Error Getting Doc')
        })
}

updateDbDocArray(docName, array) {
    let docNmae = docName
    let db = new PouchDB(`${sessionStorage.getItem('user')}`);
    return db.get(docName).then((doc)=>{
            return db.put({
                _id: docName,
                _rev: doc._rev,
                array: array
          })
    }).catch(function (err) {
          console.log('updateDbDocArray:ERROR:FETCH')
           console.log(err)
        })
}

replicateToRemoteDb(){
    let db = new PouchDB(`${sessionStorage.getItem('user')}`);
    db.replicate.to(`http://localhost:5984/${sessionStorage.getItem('user')}`).on('complete', function () {
        // yay, we're done!
      console.log('replicated to server')
      return true
    }).on('error', function (err) {
      console.log('replication to server faled')
      console.log(err)
      return false
    })
}
addOrdersToDb(order){
    // BY MONTH
    console.log(order);
    var db = new PouchDB(`${sessionStorage.getItem('user')}`);
    let date = new Moment().format('MM-YYYY')
    let docName = date + '-orders'
    let date_id = new Moment().unix()

    // fetch Db
    db.get(docName).then((doc) => {
        doc.age = 4;
        let oldOrders = doc.array
        oldOrders.push(order)
        doc.array = oldOrders
        console.log('Being Added');
        console.log(oldOrders);
        // put them back
        return db.put(doc);
    }).then(() => {
        // fetch mittens again
        console.log('Complete Order!');
        this.alertTrigger()        
    }).then(() => {
        db.replicate.to(`http://localhost:5984/${sessionStorage.getItem('user')}`).on('complete', function () {
            // yay, we're done!
          console.log('replicated to server')
        }).on('error', function (err) {
          console.log('replication to server faled')
          console.log(err)
        })
      }).catch((err) => {
        console.log('Placing Order Error');
        console.log(err);
        if (err.status === 404) {
            console.log("Missing Document");
            var doc = {
                "_id": `${docName}`,
                "array": []
              }
              db.put(doc).then(() => {
                db.replicate.to(`http://localhost:5984/${sessionStorage.getItem('user')}`).on('complete', function () {
                    // yay, we're done!
                  console.log('replicated to server')
                }).on('error', function (err) {
                  console.log('replication to server faled')
                  console.log(err)
                })
              })
              console.log('Added Document');
              this.addOrdersToDb(order)
        }
    });
}
calculateSubtotal() {

    let sub = this.state.subtotal
    let array = this.props.pending_products
    let serviceSub = 0
    let productSub = 0
    console.log(sub)
    if (array !== undefined) {
        if (this.props.pending_products) {
            for (let item of this.props.pending_products) {
                let price = item.price
                if (item.price[0] === '$') {
                    price = item.price.slice(1)
                }
                let discountedValue = (parseFloat(item.discount) / 100) * price
                price = price - discountedValue
                productSub = sub + (parseFloat(price) * parseFloat(item.qtyToBuy))
            }
        }
        if (this.props.pending_services) {
            for (let item of this.props.pending_services) {
                let price = item.price
                if (item.price[0] === '$') {
                    price = item.price.slice(1)
                }
                let discountedValue = (parseFloat(item.discount) / 100) * price
                price = price - discountedValue
                serviceSub = sub + (parseFloat(price) * parseFloat(item.qtyToBuy))
            }
        }
        sub = productSub + serviceSub
        //console.log(sub)
    }
return Number((sub).toFixed(2)); 

}


recivedAmount(event) {
    this.setState({
        recivedAmount: event.target.value
    })
}

calculateChange() {
    let recived = this.state.recivedAmount
    let finalPrice = this.calculateSubtotal();
    return Number((recived - finalPrice).toFixed(2)); 
    
}


removePendingServices(event) {
    event.preventDefault();
    console.log(event.currentTarget.id);
    if (this.props.pending_services) {
        let array =this.props.pending_services;
        let filteredArray = array.filter(item => item._id.toString() !== event.currentTarget.id)
        this.props.updateToPendingServices(filteredArray )
        console.log(filteredArray)
            
    }
}

removePendingCustomer(event) {
        event.preventDefault();
        console.log(event.currentTarget.id);
        if (this.props.pending_customers) {
        let array = this.props.pending_customers
        let filteredArray = array.filter(item => item._id !== event.currentTarget.id)
        console.log(filteredArray)

        this.props.updateToPendingCustomers(filteredArray)
    }
}

removePendingProduct(event) {
    event.preventDefault();
    console.log(event.currentTarget.id);
    if (this.props.pending_products) {
    let array = this.props.pending_products
    let filteredArray = array.filter(item => item._id != event.currentTarget.id)
    console.log(filteredArray)
    console.log(filteredArray)
    console.log(filteredArray)
    console.log(filteredArray)
    this.props.updateToPendingProducts(filteredArray)
}
}
    
customersToTable(){
    if (this.props.pending_customers) {
        return this.props.pending_customers.map((customer)=>{
    return (
            <li className='customer'>
                <h4>{customer.first_name} {customer.last_name}</h4>
                <button id={customer._id} onClick={(e)=>{this.removePendingCustomer(e)}}>x</button>
            </li> )
        })
    }
}

servicesToTable(){
    if (this.props.pending_services) {
        return this.props.pending_services.map((service)=>{
            return <li>{service._id}  {service.name} <button onClick={(e) => {this.removePendingServices(e)}} id={service._id}>X</button></li>
        })
        
    }

    if (this.props.pending_services) {
        const itemsList = this.props.pending_services.map((item) => {
            return (
            <tr key={item._id}>
                <td>{item._id}</td>
                <td >{item.name}</td>
                <td>{item.brand}</td>
                <td><input type="number" id={item._id} name={item._id} value={item.discount} 
                        onChange={this.changeDiscount.bind(this)} placeholder='Discount' min='0' max='100' required />
                </td>  
                <td>
                    <input type="number" name={item._id} id='Product' value={item.qtyToBuy} 
                        onChange={this.changeQty.bind(this)} placeholder='Qty' min='1' max={item.qty} required />
                </td>
                <td className='product_disc'>Discription</td>
                <td>{item.price}</td>
                <td>
                    <a id={ item._id} href="" onClick={(e)=>{this.removePendingProduct(e)}}><IoAndroidClose/></a>
                    </td>
            </tr>
            )
            })
            return (
            <table className="pure-table">
            <caption>Pending Items</caption>
            <thead>
                <tr>
                    <th>Store#</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Discount%</th>
                    <th>Qty</th>
                    <th>Discription.</th>                    
                    <th>Price</th>                    
                    <th></th>                    
                </tr>
            </thead>
            <tbody>
            {itemsList}
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            </tbody>
            </table>
        
                )       
        
            }
}
alertTrigger () {
    Alert.success('<h4>Success</h4>Checkout complete.', {
      position: 'bottom-right',
      effect: 'flip',
      html: true
    })
  }
  alertTriggerEmptyForm () {
Alert.error('<h4>Empty Fields</h4>', {
    position: 'bottom-right',
    effect: 'jelly',
    html: true
})
}
  
render() {
    if (!sessionStorage.getItem('Auth')) {
    cookie.remove('AuthSession', { path: '/' })
        return <Redirect to='/signup' />
      }
    const columnsProducts = [
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
          id: 'qtyToBuy',
          accessor: d => (
              <div>
                    <input type="number" name={d._id} id='Product' value={d.qtyToBuy} 
                    onChange={this.changeQty.bind(this)} placeholder='Qty' min='1' max={d.qty} required />
              </div>
          )
        }, {
            Header: 'Discount',
            id: 'discount',
            accessor: d => (
                <div>
                      <input type="number" id='Product' name={d._id} value={d.discount} 
                      onChange={this.changeDiscount.bind(this)} placeholder='Discount' min='0' max='100' required />%
                </div>
            )
          },{
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
            <a id={ d._id} href="" onClick={(e)=>{this.removePendingProduct(e)}}><IoAndroidClose/></a>
          </div>
          )
        }]
    const columnsServices = [
            {
            Header: '_id',
            accessor: '_id'
            }, {
              Header: 'name',
              accessor: 'name'
            }, {
              duration: 'duration',
              accessor: 'duration'
            }, {
              Header: 'categories',
              accessor: 'categories'
            }, {
              Header: 'supplier',
              accessor: 'supplier'
            }, {
              Header: 'description',
              accessor: 'description'
            }, {
                Header: 'Discount',
                id: 'discount',
                accessor: d => (
                    <div>
                        <input type="number" id='Service' name={d._id} value={d.discount} 
                        onChange={this.changeDiscount.bind(this)} placeholder='Discount' min='0' max='100' required />%
                    </div>
                )
              }, {
              Header: 'price',
              accessor: 'price' // String-based value accessors!
            }, {
                Header: 'qty',
                id: 'qtyToBuy',
                accessor: d => (
                    <div>
                          <input type="number" name={d._id} id='Service' value={d.qtyToBuy} 
                          onChange={this.changeQty.bind(this)} placeholder='Qty' min='1' max={d.qty} required />
                    </div>
                )
              }, {
              Header: 'remove',
              id: 'edit',
              accessor: d => ( 
                <div>
                <button onClick={(e) => {this.removePendingServices(e)}} id={d._id}>X</button>
              </div>
              )
            }]
return (
<div className='component_container'>
   <Alert className='alert' stack timeout={3000} />
   <AppNavigation/>
   <div className='container_right'>
      <Search/>
      <Fade >
      <div className='right_header'>
        <h1>Point of Sales</h1>
      </div>
      <div className='right_content'>
         <div className='open_register_container'>
               <div className='pos'>
                  <div className='item_toolbox'>
                     <SelectiveSearch/>
                     <div className='button_box'>
                        <button onClick={this.onOpenModal}>New Item</button>        
                        <button onClick={this.onOpenSecondModal}>New Customer</button>
                     </div>
                  </div>
                  <div className='pending_products'>
                     <h3>Products:</h3>
                     <div className='products_table'>
                        <ReactTable
                           data={this.props.pending_products}
                           columns={columnsProducts}
                           defaultPageSize={10}
                           minRows={3}
                           className='-striped -highlight'
                           noDataText="No Products Added"
                           />
                     </div>
                     <h3>Services:</h3>
                     <div className='services_table'>
                        <ReactTable
                           data={this.props.pending_services}
                           columns={columnsServices}
                           defaultPageSize={10}
                           minRows={3}
                           multiSort= {true}
                           className='-striped -highlight'
                           noDataText="No Services Added"
                           />
                     </div>
                     <div className='customers'>
                        <h3>Customers:</h3>
                        {this.customersToTable()}
                     </div>
                     <div className='payment'>
                        <div className='recived'>
                           <p>Recived amount:</p>
                           <input type="number"  value={this.state.recivedAmount} 
                              onChange={(e)=>{this.recivedAmount(e)}}/>
                        </div>
                        <h2>TOTAL: {this.calculateSubtotal()}
                           <button className='button_secondary pure-button' 
                              onClick={(e) => {this.finalizeOrder(e)}} id='button_finalize'>Checkout</button>
                        </h2>
                        <div className='card_payment'>
                           <label htmlFor="card" className="pure-checkbox">
                           <input id="card"  checked = {this.state.card_bool} onChange={()=>{this.setState({card_bool: !this.state.card_bool})}} type="checkbox"/>Card Payment
                           </label>
                        </div>
                        <textarea value={this.state.comments} onChange={(e)=>{this.setState({comments: e.target.value})}} placeholder='Optional Comments' rows="3" cols="20">

                        </textarea>
                        <p>Change: {this.calculateChange()}</p>

                        <div className='button_group'>
                           <button>Print</button> 
                           <button>Email</button> 
                        </div>
                     </div>
                  </div>
               </div>
         </div>
      </div>
      <Modal classNames='modal_add_products'  open={this.state.openSecondModal} onClose={this.onCloseSecondModal} center>
         <AddCustomer/>
      </Modal>
      </Fade >      
   </div>
   <Modal className='modal_add_products' open={this.state.open} onClose={this.onCloseModal} center>
      <AddProduct/>
   </Modal>
</div>

)
}
};


// These will be added as props to the component.
function mapState (state) {
    console.log(state.products)
  return {
    products: state.products,
    customers: state.customers,
    pending_products: state.pending_products,
    pending_customers: state.pending_customers,
    pending_services: state.pending_services
  }
}

const mapDispatch = (dispatch) => {
  return {
    dispatchAddProductsArray: (array) => {
      dispatch(addProductsArray(array))
    },
    updateToPendingCustomers: (newCustomersArray) => {
        dispatch(updateToPendingCustomers(newCustomersArray))
      },
      updateToPendingProducts: (newCustomersArray) => {
        dispatch(updateToPendingProducts(newCustomersArray))
      },
    updateToPendingServices: (newCustomersArray) => {
        dispatch(updateToPendingServices(newCustomersArray))
      },
      dispatchToPendingServices: (productsState, arr) => {
        dispatch(addToPendingServices(productsState, arr))
      },
      dispatchToPendingProducts: (productsState, arr) => {
        dispatch(addToPendingProducts(productsState, arr))
      },
      dispatchToPendingCustomers: (productsState, arr) => {
        dispatch(addToPendingCustomers(productsState, arr))
      }
    
  }
}

// Connect them:
export default connect(mapState, mapDispatch)(Sales)
