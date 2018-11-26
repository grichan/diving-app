import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'

import Search from '../search'
import Header from '../header'

import {connect} from 'react-redux'
import {updateStorageArray} from '../../actions'

// 3d Party
import PouchDB from 'pouchdb'
import moment from 'moment'
import BigCalendar from 'react-big-calendar'
import Modal from 'react-responsive-modal';
import {FaCube} from 'react-icons/lib/fa'
import ReactTable from 'react-table'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Fade from 'react-reveal/Fade'
// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment) // or globalizeLocalizer



class Service extends Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false,
      openEdit: false,
      openAddService: false,
      openEdditService: false,
      storageName: '',
      storageDiscription: '',
      storageArray: [],
      eventId: 0,
      selectable: false,
      selectedStorage: [],

      serviceName: '',
      serviceSerial: '',
      serviceColor: '',
      serviceDiscription:'',
      serviceSize: '',
      serviceQty: ''
    }
  }

  componentWillMount () {

  }
  componentDidMount() {
    this.getStorage() 
  }

replicateToDb (db) {
  // FROM LOCAL TO REMOTE
  db.replicate.to(`http://localhost:5984/${sessionStorage.getItem('user')}`)
  .on('complete', function () {
    // yay, we're done!
    console.log('replicated to server')
  }).on('error', function (err) {
    console.log('replication to server faled')
    console.log(err)
  })
}

getLocalDbDoc (docName) {
  var db = new PouchDB(`${sessionStorage.getItem('user')}`)
  return db.get(docName).then((doc) => {
    console.log('Doc Recived:',doc);
    this.props.dispatchAddCalendarEvents(doc.array)      
    return doc
  }).catch((err) => {
    console.log(err);
    console.log('Placing Order Error')
    if (err.status === 404) {
      console.log('Missing Document')
      var doc = { // if doc missing create one
        '_id': `${docName}`,
        'array': []
      }
      db.put(doc)
      console.log('Added Document')
      this.replicateToDb(db)
      this.getLocalDbDoc(docName) // retry function infinate loop
    }
  })
}
onOpenModal = () => {
  this.setState({ open: true });
};

onCloseModalWithData = (arr) => {
  this.props.dispatchAddCalendarEvents(arr)
  this.setState({ open: false });
};
onOpenModalService = () => {
  this.setState({ openAddService: true });
};

onCloseAddService = (arr) => {
  this.setState({ openAddService: false });
};

onOpenModalEdditService = (e) => {
  console.log( e.target.id)
  let item = this.state.selectedStorage.array.filter(item => item.id === e.target.id)
  this.setState({ 
    serviceId: item['0'].id,
    serviceName: item['0'].name,
    serviceSerial: item['0'].serial,
    serviceColor: item['0'].color,
    serviceDiscription: item['0'].disc,
    serviceSize: item['0'].size,
    serviceQty: item['0'].qty,
    openEdditService: true 
  })
}

onCloseEdditService = (arr) => {
  this.setState({ openEdditService: false });
};

  onCloseModal = () => {
      this.setState({ open: false });
      };
  onOpenModalEdit = (e) => {
    if (this.props.storages) {
      let curentlyEdditing = this.props.storages.filter(item => item._id === e.target.id)
      console.log(curentlyEdditing)
      this.setState({ 
        
        storageName: curentlyEdditing[0].name,
        storageDiscription: curentlyEdditing[0].desc,
        storageArray: curentlyEdditing[0].array,
        storageId: curentlyEdditing[0]._id,
        openEdit: true
        });
    }
    };
    
    onCloseModalEdit = () => {
        this.setState({ openEdit: false });
        };


  getStorage () {
    console.log(this.props.customers)
    let db = new PouchDB(sessionStorage.getItem('user'))
    let emit
    function myMapFunction (doc) {
      if (doc._id.startsWith('Storage-')) {
        emit(doc._id)
      }
    }
    if (this.props.storages) {
      db.query(myMapFunction, {
        include_docs: true
      }).then((result) => {
        console.log(result)
        let arr = result.rows.map((item)=> item.doc)
        console.log('loaded storage:',arr[0])
        this.setState({selectedStorage: arr[0]})
       this.props.updateStorageArray(arr)
      }).catch(function (err) {
        console.log('error' + err)
      })
    }
  }

  displayStorageNames(){
    if (this.props.storages) {
      return this.props.storages.map(item => {
        return (
        <li>
          <div className='info' onClick={(event) => this.viewStorage(item._id)}>
              <div  className='storage_name'>{item.name}</div>
              <div  className='storage_total'  >{item.array.length?item.array.length : '0'} <FaCube size='20' /></div>
          </div>
            <div className='storage_disc'>{item.desc}</div>
            <button id={item._id} onClick={(e)=>{this.onOpenModalEdit(e)}}>Edit</button>
        </li>
      )}
      )
    }
  }

  createEvent (startDate, endDate, action) {
    this.setState({
      eventStart: startDate,
      eventEnd: endDate,
      eventName: '',
      eventDesc: '',
      eventId: 0,
    })
    this.onOpenModal()
    
  }

  editEvent (e) {
    console.log(e)
    this.setState({
      eventId: e.id,
      eventStart: e.start,
      eventEnd: e.end,
      eventName: e.title,
      eventDesc: e.desc,
    })
    this.onOpenModal()
  }

  viewStorage(e){
    console.log(e)
    let selected = this.props.storages.filter(item => item._id === e)
    this.setState({
      selectedStorage: selected["0"]
    },()=>console.log('SelectedStorage:', this.state.selectedStorage ))
    console.log(this.state.selectedStorage)
    
  }

  addServiceToStorage(){
    let service = {
    id: moment().unix(),
    name : this.state.serviceName,
    serial: this.state.serviceSerial,
    color: this.state.serviceColor,
    disc: this.state.serviceDiscription,
    size: this.state.serviceSize,
    qty: this.state.serviceQty
    }
    //.array.push(service)
    this.state.selectedStorage.array.push(service)
    console.log(this.state.selectedStorage)
    let arr = this.props.storages.filter(item => item._id !== this.state.selectedStorage._id)
    arr.push(this.state.selectedStorage)
    this.props.updateStorageArray(arr)
    alert('Added to redux')

    var db = new PouchDB(`${sessionStorage.getItem('user')}`)
    db.get(this.state.selectedStorage._id).then((doc) => {
      doc.array = this.state.selectedStorage.array
      return db.put(doc);
    }).then((result) => {
      alert('Update Success')
      this.onCloseAddService();
      db.replicate.to(`http://localhost:5984/${sessionStorage.getItem('user')}`).on('complete', function () {
          console.log('replicated to server')
        }).on('error', function (err) {
            console.log('replication to server faled')
            console.log(err)
          })
    }).catch(function (err) {
      console.log(err);
      alert('error')
    })

  }

  addStorageClick(e){
    this.addStorageToLocalDb()  
  }

  deleteStorageClick(){
    this.removeReStorageClick()
  }

  updateStorageClick(){
    this.saveStorageChanges()
  }
  
  saveStorageChanges(){
    console.log('update')
    let edditing = this.state.storageId
    console.log(edditing)
    var db = new PouchDB(`${sessionStorage.getItem('user')}`)

    db.get(edditing).then((doc) => {
      doc.name = this.state.storageName
      doc.desc = this.state.storageDiscription
      return db.put(doc);
    }).then((result) => {
       alert('Update Success')
       let arr = this.props.storages.filter(item => item._id !== edditing)
       let newChanges = {
        _id: edditing,
        id: this.state.storageId,
        name: this.state.storageName,
        desc: this.state.storageDiscription,
        array: this.state.storageArray
       }
       arr.push(newChanges)
       this.props.updateStorageArray(arr)
       this.onCloseModalEdit();
       db.replicate.to(`http://localhost:5984/${sessionStorage.getItem('user')}`).on('complete', function () {
          console.log('replicated to server')
        }).on('error', function (err) {
            console.log('replication to server faled')
            console.log(err)
          })
    }).catch(function (err) {
      alert('error')
    })
  }

  removeReStorageClick(){
    console.log('delete')
    let edditing = this.state.storageId
    console.log(edditing)
    var db = new PouchDB(`${sessionStorage.getItem('user')}`)

    db.get(edditing).then((doc) => {
      return db.remove(doc);
    }).then((result) => {
       alert('Delete Success')
       let arr = this.props.storages.filter(item => item._id !== edditing)
       this.props.updateStorageArray(arr)
       this.onCloseModalEdit();
       db.replicate.to(`http://localhost:5984/${sessionStorage.getItem('user')}`).on('complete', function () {
          console.log('replicated to server')
        }).on('error', function (err) {
            console.log('replication to server faled')
            console.log(err)
          })
    }).catch(function (err) {
      alert('Delete error')
    })
  }

  addStorageToLocalDb () {

    let id =  moment().unix()
    let docName = 'Storage-' + id
    var db = new PouchDB(`${sessionStorage.getItem('user')}`)

    let  data= { 
      _id: docName,
      id:id,
      name: this.state.storageName,
      desc: this.state.storageDiscription,
      array: []
      }  
    db.put(data)
      .then(() => {
        var array = this.props.storages
        array.push(data)
        console.log('upp', array);
        this.props.updateStorageArray(array)
        alert('Storage Added')
      })
      .then(() => {
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
        alert('Error Occured')
        })
  }

  deleteServiceToStorage(){

    // delete element from storage
    let storage = this.state.selectedStorage
    let arrayFiltered = storage.array.filter(item => item.id !== this.state.serviceId)
    storage.array = arrayFiltered
    // update storage with new array 

    var db = new PouchDB(`${sessionStorage.getItem('user')}`)
    db.get(this.state.selectedStorage._id).then((doc) => {
      doc.array = storage.array
      return db.put(doc);
    }).then((result) => {
      alert('Update Success')
      let withoutOldStorage = this.props.storages.filter(item => item._id !== storage._id)
      withoutOldStorage.push(storage)
      this.props.updateStorageArray(withoutOldStorage)
      this.onCloseEdditService();
      db.replicate.to(`http://localhost:5984/${sessionStorage.getItem('user')}`).on('complete', function () {
          console.log('replicated to server')
        }).on('error', function (err) {
            console.log('replication to server faled')
            console.log(err)
          })
    }).catch(function (err) {
      console.log(err);
      alert('error')
    })
  
  }

  updateServiceToStorage(){
    // delete element from storage
    let storage = this.state.selectedStorage
    let arrayFiltered = storage.array.filter(item => item.id !== this.state.serviceId) // remove our edditing item
    
    let data = {
     id:  this.state.serviceId,
     name:this.state.serviceName,
     serial: this.state.serviceSerial,
     color:this.state.serviceColor,
     disc: this.state.serviceDiscription,
     size:this.state.serviceSize,
     qty: this.state.serviceQty,
    }
    arrayFiltered.push(data)

    storage.array = arrayFiltered
    // update storage with new array 

    var db = new PouchDB(`${sessionStorage.getItem('user')}`)
    db.get(this.state.selectedStorage._id).then((doc) => {
      doc.array = storage.array
      return db.put(doc);
    }).then((result) => {
      alert('Update Success')
      let withoutOldStorage = this.props.storages.filter(item => item._id !== storage._id)
      withoutOldStorage.push(storage)
      this.props.updateStorageArray(withoutOldStorage)
      this.onCloseEdditService();
      db.replicate.to(`http://localhost:5984/${sessionStorage.getItem('user')}`).on('complete', function () {
          console.log('replicated to server')
        }).on('error', function (err) {
            console.log('replication to server faled')
            console.log(err)
          })
    }).catch(function (err) {
      console.log(err);
      alert('error')
    })
  }

  render () {
    if (!sessionStorage.getItem('Auth')) {
      return <Redirect to='/signup' />
    }

    const columns = [
      {
        Header: 'id',
        accessor: 'id'
      }, {
        Header: 'name',
        accessor: 'name'
      }, {
        Header: 'serial',
        accessor: 'serial'
      }, {
        Header: 'color',
        accessor: 'color'
      }, {
        Header: 'size',
        accessor: 'size'
      }, {
        Header: 'qty',
        accessor: 'qty'
      }, {
        Header: 'discripton',
        id: 'discripton',
        accessor: d => d.disc
      }, {
        Header: '',
        id: 'edit',
        accessor: d => ( 
          <div>
          <button className='edditProducts' id={d.id} onClick={(e)=> this.onOpenModalEdditService(e)}>Edit </button>
        </div>
<<<<<<< HEAD
        )
      }]
    return (
      <div className='component_container'>
        <Header isauth />
        <div className='container_right'>
          <Search />
          <div className='right_header'>
        <h1>Service</h1>
      </div>
          <div className='dashboard_container'>
          <Modal classNames='modal_add_products'  open={this.state.open} onClose={this.onCloseModal} center>
          <div className='modal_inner_box'>
            <h1>Add storage</h1>
            Storage Name<input  type="text" value={this.state.storageName} 
              onChange={(e)=>{this.setState({storageName: e.target.value})}}/>
            Description: <textarea rows="4" cols="50" type="text" value={this.state.storageDiscription} 
              onChange={(e)=>{this.setState({storageDiscription: e.target.value})}}/>
            <button type='submit' id='addEvent' onClick={(e)=>{this.addStorageClick(e)}}>Add</button>
            </div>
        </Modal>

        <Modal classNames='modal_add_products'  open={this.state.openEdit} onClose={this.onCloseModalEdit} center>
          <div className='modal_inner_box'>
            <h1>Edit storage</h1>
            Storage Name<input  type="text" value={this.state.storageName} 
              onChange={(e)=>{this.setState({storageName: e.target.value})}}/>
            Description: <textarea rows="4" cols="50" type="text" value={this.state.storageDiscription} 
              onChange={(e)=>{this.setState({storageDiscription: e.target.value})}}/>
            <button type='submit' id='addEvent' onClick={(e)=>{this.deleteStorageClick(e)}}>Delete</button>
            <button type='submit' id='addEvent' onClick={(e)=>{this.updateStorageClick(e)}}>Save</button>
            </div>
        </Modal>  
  
        <Modal classNames='modal_add_products'  open={this.state.openAddService} onClose={this.onCloseAddService} center>
          <div className='modal_inner_box'>
            <h1>Add Service</h1>
            Service Name<input  type="text" value={this.state.serviceName} 
              onChange={(e)=>{this.setState({serviceName: e.target.value})}}/>
            Quantity <input  type="number" value={this.state.serviceQty} 
              onChange={(e)=>{this.setState({serviceQty: e.target.value})}}/>
            Size<input  type="text" value={this.state.serviceSize} 
              onChange={(e)=>{this.setState({serviceSize: e.target.value})}}/>
            Color<input  type="text" value={this.state.serviceColor} 
              onChange={(e)=>{this.setState({serviceColor: e.target.value})}}/>
            Serial Number<input  type="text" value={this.state.serviceSerial} 
              onChange={(e)=>{this.setState({serviceSerial: e.target.value})}}/>  
            Description: <textarea rows="4" cols="50" type="text" value={this.state.serviceDiscription} 
              onChange={(e)=>{this.setState({serviceDiscription: e.target.value})}}/>
            <button type='submit' id='addEvent' onClick={(e)=>{this.addServiceToStorage(e)}}>Add</button>
            </div>
        </Modal>

               <Modal classNames='modal_edit_products'  open={this.state.openEdditService} onClose={this.onCloseEdditService} center>
          <div className='modal_inner_box'>
            <h1>Edit Service</h1>
            Service Name<input  type="text" value={this.state.serviceName} 
              onChange={(e)=>{this.setState({serviceName: e.target.value})}}/>
            Quantity <input  type="number" value={this.state.serviceQty} 
              onChange={(e)=>{this.setState({serviceQty: e.target.value})}}/>
            Size<input  type="text" value={this.state.serviceSize} 
              onChange={(e)=>{this.setState({serviceSize: e.target.value})}}/>
            Color<input  type="text" value={this.state.serviceColor} 
              onChange={(e)=>{this.setState({serviceColor: e.target.value})}}/>
            Serial Number<input  type="text" value={this.state.serviceSerial} 
              onChange={(e)=>{this.setState({serviceSerial: e.target.value})}}/>  
            Description: <textarea rows="4" cols="50" type="text" value={this.state.serviceDiscription} 
              onChange={(e)=>{this.setState({serviceDiscription: e.target.value})}}/>
            <button type='submit' id='delete' onClick={(e)=>{this.deleteServiceToStorage(e)}}>Delete</button>
            <button type='submit' id='addEvent' onClick={(e)=>{this.updateServiceToStorage(e)}}>Save</button>
            </div>
        </Modal>  

  
          <div className='service_box'>
            <div className='storage_control'>
            <a onClick={this.onOpenModal}>
                    <div className='storage'>
                        <FaCube size='100' />
                        <p>Create storage</p>
                      </div>
                    </a>
                      <div className='existing_storage'>
                        <p>Exisiting Service Storages:</p>
                        {this.displayStorageNames()}
                      </div>  
            </div>
            <div className='storage_conents'>
=======
      )
    }, {
      Header: 'Type',
      accessor: 'name'
    }, {
      Header: 'Serial',
      accessor: 'serial'
    }, {
      Header: 'Tech',
      accessor: 'color'
    }, {
      Header: 'Price',
      accessor: 'size'
    }, {
      Header: 'Qty',
      accessor: 'qty'
    }, {
      Header: 'Discripton',
      id: 'discripton',
      accessor: d => d.disc
    }, {
      Header: '',
      id: 'edit',
      accessor: d => ( 
        <div>
        <button className='edditProducts' id={d.id} onClick={(e)=> this.onOpenModalEdditService(e)}>Edit </button>
      </div>
      )
    }]
  return (
    <div className='component_container'>
      <Header isauth />
      <div className='container_right'>
        <Search />
        <Fade>
        <div className='right_header'>
      <h1>Service</h1>
    </div>
        <div className='dashboard_container'>
        <Modal classNames='modal_add_products'  open={this.state.open} onClose={this.onCloseModal} center>
        <div className='modal_inner_box'>
          <h1>Add service</h1>
          ServiceItem Name<input autoFocus type="text" value={this.state.serviceName} 
            onChange={(e)=>{this.setState({serviceName: e.target.value})}}/>
          Description: <textarea rows="4" cols="50" type="text" value={this.state.serviceDiscription} 
            onChange={(e)=>{this.setState({serviceDiscription: e.target.value})}}/>
          <button type='submit' id='addEvent' onClick={(e)=>{this.addServiceItemClick(e)}}>Add</button>
          </div>
      </Modal>

      <Modal classNames='modal_add_products'  open={this.state.openEdit} onClose={this.onCloseModalEdit} center>
        <div className='modal_inner_box'>
          <h1>Edit service</h1>
          ServiceItem Name<input autoFocus type="text" value={this.state.serviceName} 
            onChange={(e)=>{this.setState({serviceName: e.target.value})}}/>
          Description: <textarea rows="4" cols="50" type="text" value={this.state.serviceDiscription} 
            onChange={(e)=>{this.setState({serviceDiscription: e.target.value})}}/>
          <div className='button_set'>
            <button type='submit' id='addEvent' onClick={(e)=>{this.deleteServiceToServiceItem(e)}}>Delete</button>
            <button type='submit' id='addEvent' onClick={(e)=>{this.updateServiceItemClick(e)}}>Save</button>
          </div>
          
          </div>
      </Modal>  

      <Modal classNames='modal_add_products'  open={this.state.openAddService} onClose={this.onCloseAddService} center>
        <div className='modal_inner_box'>
          <h1>Add Service</h1>
          Service Name<input autoFocus type="text" value={this.state.serviceName} 
            onChange={(e)=>{this.setState({serviceName: e.target.value})}}/>
          Quantity <input  type="number" value={this.state.serviceQty} 
            onChange={(e)=>{this.setState({serviceQty: e.target.value})}}/>
          Size<input  type="text" value={this.state.serviceSize} 
            onChange={(e)=>{this.setState({serviceSize: e.target.value})}}/>
          Color<input  type="text" value={this.state.serviceColor} 
            onChange={(e)=>{this.setState({serviceColor: e.target.value})}}/>
          Serial Number<input  type="text" value={this.state.serviceSerial} 
            onChange={(e)=>{this.setState({serviceSerial: e.target.value})}}/>  
          Description: <textarea rows="4" cols="50" type="text" value={this.state.serviceDiscription} 
            onChange={(e)=>{this.setState({serviceDiscription: e.target.value})}}/>
          <button type='submit' id='addEvent' onClick={(e)=>{this.addServiceToServiceItem(e)}}>Add</button>
          </div>
      </Modal>

              <Modal classNames='modal_edit_products'  open={this.state.openEdditService} onClose={this.onCloseEdditService} center>
        <div className='modal_inner_box'>
          <h1>Edit Service</h1>
          Service Name<input autoFocus type="text" value={this.state.serviceName} 
            onChange={(e)=>{this.setState({serviceName: e.target.value})}}/>
          Quantity <input  type="number" value={this.state.serviceQty} 
            onChange={(e)=>{this.setState({serviceQty: e.target.value})}}/>
          Size<input  type="text" value={this.state.serviceSize} 
            onChange={(e)=>{this.setState({serviceSize: e.target.value})}}/>
          Color<input  type="text" value={this.state.serviceColor} 
            onChange={(e)=>{this.setState({serviceColor: e.target.value})}}/>
          Serial Number<input  type="text" value={this.state.serviceSerial} 
            onChange={(e)=>{this.setState({serviceSerial: e.target.value})}}/>  
          Description: <textarea rows="4" cols="50" type="text" value={this.state.serviceDiscription} 
            onChange={(e)=>{this.setState({serviceDiscription: e.target.value})}}/>
          <button type='submit' id='delete' onClick={(e)=>{this.deleteServiceItemClick(e)}}>Delete</button>
          <button type='submit' id='addEvent' onClick={(e)=>{this.updateServiceToServiceItem(e)}}>Save</button>
          </div>
      </Modal>  


        <div className='service_box'>
          <div className='service_control'>
          <a onClick={this.onOpenModal}>
                  <div className='service'>
                      <FaWrench size='100' />
                      <p>Service Equipment</p>
                    </div>
                  </a>
                    <div className='existing_service'>
                      <p>Exisiting Service ServiceItems:</p>
                      {this.displayServiceItemNames()}
                    </div>  
          </div>
          <div className='service_conents'>
          <div className='upper_service_contents'>
>>>>>>> Dist Commit
            <h2>Sotrage Service</h2>
            <button onClick={this.onOpenModalService}>Add Service to storage</button>
              <ReactTable
                      data={this.state.selectedStorage.array}
                      columns={columns}
                      defaultPageSize={10}
                      minRows={5}
                      className='tableProducts -striped -highlight'
                />
            </div>
          </div>
 
          </div>
        </div>
<<<<<<< HEAD
=======
        </div>
        </Fade>
>>>>>>> Dist Commit
      </div>
    )
  }
};

// These will be added as props to the component.
function mapState (state) {
  console.log(state.products)
  return {
    storages: state.storages,
    active_storage: state.active_storage
  }
}

const mapDispatch = (dispatch) => {
  return {
    updateStorageArray: (array) => {
      dispatch(updateStorageArray(array))
    }
    
  }
}

// Connect them:
export default connect(mapState, mapDispatch)(Service)
