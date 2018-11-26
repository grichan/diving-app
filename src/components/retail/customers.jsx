import React, { Component } from 'react'

// COMPNENTS
import Search from '../search'
// import RetailHeader from './header'
import AppNavigation from '../header'
import AddCustomer from './_addCustomer'

// 3d PARTY
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Moment from 'moment'
import PouchDB from 'pouchdb'
import {connect} from 'react-redux'
import {updateCustomerArray} from '../../actions'
import Modal from 'react-responsive-modal';
import Fade  from 'react-reveal/Fade'

class Customers extends Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false,
      open1: false,
      edit_service_first_name: '',
      edit_service_last_name: '',
      edit_service_email: '',
      edit_service_phone: '',
      edit_service_nat: '',
      edit_service_diver: '',
      currentlyEditing: ''
    }
  };
  componentDidMount(){
    console.log(this.props.customers)
    var filtered = []
    let db = new PouchDB(sessionStorage.getItem('user'))
    let emit
    function myMapFunction (doc) {
      if (doc._id.startsWith('Customer-')) {
        emit(doc._id)
      }
    }
    if (this.props.customers) {
      db.query(myMapFunction, {
        include_docs: true
      }).then((result) => {
        console.log(result)
        let arr = result.rows.map((item)=> item.doc)
       this.props.updateCustomerArray(arr)
      }).catch(function (err) {
        console.log('error' + err)
      })
    }

    this.setState({
      suggestions: filtered
    })
  }
  editProduct () {
    console.log('Click')
    
  }
  onOpenModal = (e) => {
    console.log(e.target.id);
    let productForEdit = this.props.customers.filter(item => item._id === e.target.id)
    this.setState({
      edit_service_id:productForEdit[0]._id,
      edit_service_first_name: productForEdit[0].first_name,
      edit_service_last_name: productForEdit[0].last_name,
      edit_service_email: productForEdit[0].email,
      edit_service_phone: productForEdit[0].phone,
      edit_service_nat: productForEdit[0].nationality,
      edit_service_diver: productForEdit[0].diver,
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
    if (edditing) {
    edditing.first_name = this.state.edit_service_first_name
    edditing.last_name = this.state.edit_service_last_name
    edditing.phone = this.state.edit_service_phone
    edditing.email = this.state.edit_service_email
    edditing.nat = this.state.edit_service_nat
    edditing.diver = this.state.edit_service_diver
    }
    
    console.log(edditing);

    var db = new PouchDB(`${sessionStorage.getItem('user')}`)
    db.get(`${edditing._id}`).then((doc) => {
      db.put({
        _id: edditing._id,
        _rev: doc._rev,
        id: edditing.id,
        first_name: edditing.first_name,
        last_name: edditing.last_name,
        email: edditing.email,
        phone: edditing.phone,
        nationality: edditing.nat,
        diver: edditing.diver
      })
      this.onCloseModal()
      return edditing
    })
    .catch((err) => {
      console.log(err)
    })
  }

  deleteProduct(){
    console.log('delete')
    let edditing = this.state.currentlyEditing[0]
    var db = new PouchDB(`${sessionStorage.getItem('user')}`)
    db.get(`Customer-${edditing.id}`).then((doc) => {
      let id = doc.id
      db.remove(doc).then(()=>{
        let arr = this.props.customers.filter(item => item.id !== id)
        console.log(arr);
        this.props.updateCustomerArray(arr)
        this.onCloseModal()
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }
  

  render () {
    const columns = [
      {
        Header: 'Id',
        accessor: 'id'
      }, {
        Header: 'First Name',
        accessor: 'first_name'
      },{
        Header: 'Last Name',
        accessor: 'last_name'
      }, {
        Header: 'Email',
        accessor: 'email'
      },{
        Header: 'Phone',
        accessor: 'phone'
      }, {
        Header: 'Natinality',
        accessor: 'nationality'
      }, {
        Header: 'diver',
        id: 'diver',
        accessor: d => d.diver.toString()
      },{
        Header: '',
        id: 'edit',
        accessor: d => ( 
          <div>
          <button className='edditProducts' id={d._id} onClick={(e)=> this.onOpenModal(e)}>Edit</button>
        </div>
        )}]
    return (
      <div className='component_container'>
        <Modal classNames='modal_edit_products'  open={this.state.open1} onClose={this.onCloseModal1} center>
        <AddCustomer/>
        </Modal>



        <Modal classNames='modal_edit_products'  open={this.state.open} onClose={this.onCloseModal} center>
        <div className='modal_form_box'>
    First Name
            <input type='text' onChange={(e) => { this.setState({edit_service_first_name: e.target.value}) }}
              value={this.state.edit_service_first_name} />
    Storage Id
            <input type='text' onChange={(e) => { this.setState({edit_service_last_name: e.target.value}) }}
              value={this.state.edit_service_last_name} />

    Qty
            <input type='text' onChange={(e) => { this.setState({edit_service_email: e.target.value}) }}
              value={this.state.edit_service_email} />

      Price for one
            <input type='text' onChange={(e) => { this.setState({edit_service_phone: e.target.value}) }}
              value={this.state.edit_service_phone} />

    Nationality
            <input type='text' onChange={(e) => { this.setState({edit_service_nat: e.target.value}) }}
              value={this.state.edit_service_nat} />
    Diver
                                    <input type='text' onChange={(e) => { this.setState({edit_service_diver: e.target.value}) }}
              value={this.state.edit_service_diver} />
            <button onClick={(e)=>{this.saveChanges(e)}}>Save</button>
            <button onClick={this.onCloseModal}>Cancel</button>
            <button onClick={this.deleteProduct.bind(this)}>Delete</button>
          </div>
          </Modal>


        <AppNavigation />
        <div className='container_right'>
          <Search />
          <Fade >
          <div className='right_header'>
        <h1>Customers</h1>
      </div>
          <div className='right_content'>

            <div className='products_container' >
              <div className='controls'>
                <button onClick={this.onOpenModal1}>Add Customer</button>
              </div>

              <div className='products_table'>

                <ReactTable
                  data={this.props.customers}
                   columns={columns}
                  defaultPageSize={10}
                  minRows={3}
                  className='-striped -highlight'
                />
              </div>
            </div>
          </div>
          </Fade>
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
    updateCustomerArray: (array) => {
      dispatch(updateCustomerArray(array))
    }
    
  }
}

// Connect them:
export default connect(mapState, mapDispatch)(Customers)
