import React, { Component } from 'react'

// COMPNENTS
import Search from '../search'
// import RetailHeader from './header'
import AppNavigation from '../header'
import AddService from './_addService'

// 3d PARTY
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import PouchDB from 'pouchdb'
import {connect} from 'react-redux'
import {addServicesArray, addService} from '../../actions'
import Modal from 'react-responsive-modal';
import Fade  from 'react-reveal/Fade'

class Courses extends Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false,
      open1: false,
      edit_service_name: '',
      edit_service_days: '',
      edit_service_hours: '',
      edit_service_minutes: '',
      edit_service_price: '',
      edit_service_categories: '',
      edit_service_description: '',
      currentlyEditing: ''
    }
  };
  componentDidMount(){
    console.log(this.props.services.length);
    if (this.props.services.length === 0) {
      var localDB = new PouchDB(`${sessionStorage.getItem('user')}`, {skip_setup: true});
      localDB.get('Services').then((doc) => {
        //console.log('yea')
        console.log(doc.array)
        return doc.array
            //console.log(item);
        }).then((res) => {
          this.props.dispatchAddServicesArray(res).then(()=>{
            return console.log(this.props.services.map((item)=>{return console.log(item)})) 
            }) 
        }).catch(function (err) {
          //console.log(err);
          });
        //console.log(array);
    }
  }
  editService () {
    console.log('Click')
    
  }
  onOpenModal = (e) => {
    console.log(e.target.id);
    let serviceForEdit = this.props.services.filter(item => item._id === e.target.id)
    
    let days
    let hours
    let minutes 

       let array = serviceForEdit[0].duration.split('-')
       days = array[0]
       hours = array[1]
       minutes = array[2]


    this.setState({
      edit_service_name: serviceForEdit[0].name,
      edit_service_days: days,
      edit_service_hours: hours,
      edit_service_minutes: minutes,
      edit_service_price: serviceForEdit[0].price,
      edit_service_categories: serviceForEdit[0].categories,
      edit_service_description: serviceForEdit[0].description
    }, ()=>{
      console.log(serviceForEdit[0])
      this.setState({ open: true, currentlyEditing: serviceForEdit });
    })
  
    };
    
    onOpenModal1 = () => {
        this.setState({ open1: true});
    }
    onCloseModal = () => {
    this.setState({ open: false });
    };

    onCloseModalWithChanges = (arr) => {
      this.props.dispatchAddServicesArray(arr)      
      this.setState({ open: false });
      };
    onCloseModal1 = () => {
      this.setState({ open1: false });
      };
    
  getServices () {
    // BY MONTH
    var db = new PouchDB(`${sessionStorage.getItem('user')}`)
    if (!this.props.services) {
      // fetch Db
      db.get('Services').then((doc) => {
        console.log(doc.array)
        this.setState({
          data: doc.array
        })
      }).then(() => {
        console.log('Complete!')
      }).catch((err) => {
        console.log('Placing Order Error')
        if (err.status === 404) {
          console.log('Missing Document')
          var doc = { // if doc missing create one
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
          this.getServices() // retry function
        }
      })
    }
  }

  saveChanges(e){
    let data = {
    _id : this.state.currentlyEditing[0]._id,
    name : this.state.edit_service_name,
    duration : `${this.state.edit_service_days}-${this.state.edit_service_hours}-${this.state.edit_service_minutes}`,
    price : this.state.edit_service_price,
    categories : this.state.edit_service_categories, 
    description : this.state.edit_service_description 
    }
    
    var db = new PouchDB(`${sessionStorage.getItem('user')}`)
    db.get(`Services`).then((doc) => {
      var arr = doc.array.filter(item => item._id !== this.state.currentlyEditing[0]._id)
      arr.push(data)
      console.log(arr)
      db.put({
        _id: 'Services',
        _rev: doc._rev,
        array: arr
      })      
      this.onCloseModalWithChanges(arr)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  deleteservice(){
    console.log('delete')
    var db = new PouchDB(`${sessionStorage.getItem('user')}`)
    db.get(`Services`).then((doc) => {
      var arr = doc.array.filter(item => item._id !== this.state.currentlyEditing[0]._id)
      console.log(arr)
      db.put({
        _id: 'Services',
        _rev: doc._rev,
        array: arr
      }).then(()=>{
        this.props.dispatchAddServicesArray(arr)
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
        Header: 'Duration',
        id: 'duration',
        accessor: d => `${d.duration.split('-')[0]}d ${d.duration.split('-')[1]}h ${d.duration.split('-')[2]}m`
      }, {
        Header: 'name',
        accessor: 'name'
      }, {
        Header: 'categories',
        accessor: 'categories'
      }, {
        Header: 'description',
        id: 'description',
        accessor: d => d.description
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
        <Modal classNames='modal_edit_services'  open={this.state.open1} onClose={this.onCloseModal1} center>
        <AddService/>
        </Modal>



        <Modal classNames='modal_edit_services'  open={this.state.open} onClose={this.onCloseModal} center>
        <div className='modal_form_box'>
        <h2>Add new Service</h2>
            <p>Shop service involving time. Eg: diving Course</p>
    Name Of Service Eg: Open Water Diver Traning
            <input type='text' onChange={(e) => { this.setState({edit_service_name: e.target.value}) }}
              value={this.state.edit_service_name} />
      Time (DD/HH/MM)
            <div className='days'>
              <input type='number' size='2' min='0' max='365' onChange={(e) => { this.setState({edit_service_days: e.target.value}) }}
                value={this.state.edit_service_days} /> D
            </div>
            <div className='hours'>
              <input type='number' max='23' min='0' onChange={(e) => { this.setState({edit_service_hours: e.target.value}) }}
                value={this.state.edit_service_hours} /> H
            </div>
            <div className='minutes'>
              <input type='number' max='59' min='0' onChange={(e) => { this.setState({edit_service_minutes: e.target.value}) }}
                value={this.state.edit_service_minutes} /> M
            </div>

      Price
            <input type='number' onChange={(e) => { this.setState({edit_service_price: e.target.value}) }}
              value={this.state.edit_service_price} />
    Categories (separated by comma)
            <input type='text' placeholder='example,tag' onChange={(e) => { this.setState({edit_service_categories: e.target.value}) }}
              value={this.state.edit_service_categories} />
    description
            <textarea rows='4' cols='50' onChange={(e) => { this.setState({edit_service_description: e.target.value}) }} value={this.state.edit_service_description} />

            <button onClick={(e)=>{this.saveChanges(e)}}>Save</button>
            <button onClick={this.onCloseModal}>Cancel</button>
            <button onClick={this.deleteservice.bind(this)}>Delete</button>
          </div>
          </Modal>


        <AppNavigation />
        <div className='container_right'>
          <Search />
          <div className='right_header'>
          <h1>Courses</h1>
          <p>and services involving time</p>
      </div>
      <Fade >
          <div className='right_content'>

            < div className='products_container' >
              <div className='controls'>
                <button onClick={this.onOpenModal1}>Add Service</button>
              </div>

              <div className='products_table'>

                <ReactTable
                  data={this.props.services}
                  columns={columns}
                  defaultPageSize={10}
                  minRows={3}
                  className='-striped -highlight'
                />
              </div>
            </div>
          </div>
          </Fade >
        </div>
      </div>
    )
  }
};

// These will be added as props to the component.
function mapState (state) {
  console.log(state.services)
  return {
    services: state.services
  }
}

const mapDispatch = (dispatch) => {
  return {
    dispatchAddServicesArray: (array) => {
      dispatch(addServicesArray(array))
    },
      dispatchAddService: (servicesState, arr) => {
        dispatch(addService(servicesState, arr))
      }
    
  }
}

// Connect them:
export default connect(mapState, mapDispatch)(Courses)
