import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'

import Search from '../search'
import Header from '../header'
import './service.css'

import {connect} from 'react-redux'
import {updateServiceItemArray} from '../../actions'

// 3d Party
import PouchDB from 'pouchdb'
import moment from 'moment'
import BigCalendar from 'react-big-calendar'
import Modal from 'react-responsive-modal';
import {FaWrench} from 'react-icons/lib/fa'
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
      serviceName: '',
      serviceDiscription: '',
      serviceArray: [],
      eventId: 0,
      selectable: false,
      serviceItems: [],
      selectedServiceItem: [],

      serviceName: '',
      serviceSerial: '',
      serviceColor: '',
      serviceDiscription:'',
      serviceSize: '',
      serviceQty: ''
    }
  }

// ############################### COMPONENT MOUNTS ###############################

  componentWillMount () {

  }
  
  componentDidMount() {
    this.getServiceItem() 
  }

// ############################### DATABASE CONNECTIONS ############################## 

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

// ############################### MODAL ###############################

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
  let item = this.state.selectedServiceItem.array.filter(item => item.id == e.target.id)
  console.log(this.state.selectedServiceItem.array);
  console.log(item);
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
  if (this.props.service_item_reducer) {
    let curentlyEdditing = this.props.service_item_reducer.filter(item => item._id === e.target.id)
    console.log(curentlyEdditing)
    this.setState({ 
      
      serviceName: curentlyEdditing[0].name,
      serviceDiscription: curentlyEdditing[0].desc,
      serviceArray: curentlyEdditing[0].array,
      serviceId: curentlyEdditing[0]._id,
      openEdit: true
      })
  }
}
    
onCloseModalEdit = () => {
    this.setState({ openEdit: false });
    };


getServiceItem () {
  let db = new PouchDB(sessionStorage.getItem('user'))
  let emit
  function myMapFunction (doc) {
    if (doc._id.startsWith('ServiceItem-')) {
      emit(doc._id)
    }
  }
  if (this.props.service_item_reducer) {
    db.query(myMapFunction, {
      include_docs: true
    }).then((result) => {
      console.log(result)
      let arr
      if (result) {
        arr = result.rows.map((item)=> item.doc)
        console.log('loaded service:',arr[0])
        this.setState({selectedServiceItem: arr[0]})
      } else arr = []
     
      this.props.updateServiceItemArray(arr)
    }).catch(function (err) {
      console.log('error' + err)
    })
  }
}

displayServiceItemNames(){
  if (this.props.service_item_reducer) {
    return this.props.service_item_reducer.map(item => {
      return (
        <div className='services_item_box'>
      <li>
        <div className='info' onClick={(event) => this.viewServiceItem(item._id)}>
            <div  className='service_name'>{item.name}</div>
            <div  className='service_total'  >{item.array.length?item.array.length : '0'} <FaWrench size='20' /></div>
        </div>
          <div className='service_disc'>{item.desc}</div>
          <button id={item._id} onClick={(e)=>{this.onOpenModalEdit(e)}}>Edit</button>
      </li>  
        </div>
      
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

viewServiceItem(e){
  console.log(e)
  let selected = this.props.service_item_reducer.filter(item => item._id == e)
  this.setState({
    selectedServiceItem: selected[0]
  },()=>console.log('SelectedServiceItem:', this.state.selectedServiceItem ))
  console.log(this.state.selectedServiceItem)
  
}

addServiceToServiceItem(){
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
  this.state.selectedServiceItem.array.push(service)
  console.log(this.state.selectedServiceItem)
  let arr = this.props.service_item_reducer.filter(item => item._id !== this.state.selectedServiceItem._id)
  arr.push(this.state.selectedServiceItem)
  this.props.updateServiceItemArray(arr)
  alert('Added to redux')

  var db = new PouchDB(`${sessionStorage.getItem('user')}`)
  db.get(this.state.selectedServiceItem._id).then((doc) => {
    doc.array = this.state.selectedServiceItem.array
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

addServiceItemClick(e){
  this.addServiceItemToLocalDb()  
}

deleteServiceToServiceItem(e){
  this.removeService()
}

updateServiceItemClick(){
  this.saveServiceItemChanges()
}

deleteServiceItemClick(){
  this.deleteServiceToStorage()
}

removeService(){
  console.log('delete')
  let edditing = this.state.serviceId
  console.log(edditing)
  var db = new PouchDB(`${sessionStorage.getItem('user')}`)

  db.get(edditing).then((doc) => {
    return db.remove(doc);
  }).then((result) => {
      alert('Update Success')
      let arr = this.props.service_item_reducer.filter(item => item._id !== edditing)
      this.props.updateServiceItemArray(arr)
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



saveServiceItemChanges(){
  // Update Service 
  console.log('update')
  let edditing = this.state.serviceId
  console.log(edditing)
  var db = new PouchDB(`${sessionStorage.getItem('user')}`)

  db.get(edditing).then((doc) => {
    doc.name = this.state.serviceName
    doc.desc = this.state.serviceDiscription
    return db.put(doc);
  }).then((result) => {
      alert('Update Success')
      let arr = this.props.service_item_reducer.filter(item => item._id !== edditing)
      let newChanges = {
      _id: edditing,
      id: this.state.serviceId,
      name: this.state.serviceName,
      desc: this.state.serviceDiscription,
      array: this.state.serviceArray
      }
      arr.push(newChanges)
      this.props.updateServiceItemArray(arr)
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


saveServiceItemChanges(){
  console.log('update')
  let edditing = this.state.serviceId
  console.log(edditing)
  var db = new PouchDB(`${sessionStorage.getItem('user')}`)

  db.get(edditing).then((doc) => {
    doc.name = this.state.serviceName
    doc.desc = this.state.serviceDiscription
    return db.put(doc);
  }).then((result) => {
      alert('Update Success')
      let arr = this.props.service_item_reducer.filter(item => item._id !== edditing)
      let newChanges = {
      _id: edditing,
      id: this.state.serviceId,
      name: this.state.serviceName,
      desc: this.state.serviceDiscription,
      array: this.state.serviceArray
      }
      arr.push(newChanges)
      this.props.updateServiceItemArray(arr)
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

addServiceItemToLocalDb () {

  let id =  moment().unix()
  let docName = 'ServiceItem-' + id
  var db = new PouchDB(`${sessionStorage.getItem('user')}`)

  let  data = { 
    _id: docName,
    id:id,
    name: this.state.serviceName,
    desc: this.state.serviceDiscription,
    array: []
    }  
  db.put(data)
    .then(() => {
      var array = this.props.service_item_reducer
      array.push(data)
      console.log('adding service item', array);
      this.props.updateServiceItemArray(array)
      alert('ServiceItem Added')
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
      console.log('Error: ', err)
      })
}

deleteServiceToStorage(){

  // delete element from service
  let service = this.state.selectedServiceItem
  let arrayFiltered = service.array.filter(item => item.id !== this.state.serviceId)
  service.array = arrayFiltered
  // update service with new array 

  var db = new PouchDB(`${sessionStorage.getItem('user')}`)
  db.get(this.state.selectedServiceItem._id).then((doc) => {
    doc.array = service.array
    return db.put(doc);
  }).then((result) => {
    alert('Update Success')
    let withoutOldServiceItem = this.props.service_item_reducer.filter(item => item._id !== service._id)
    withoutOldServiceItem.push(service)
    this.props.updateServiceItemArray(withoutOldServiceItem)
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

updateServiceToServiceItem(){
  // delete element from service
  let service = this.state.selectedServiceItem
  let arrayFiltered = service.array.filter(item => item.id !== this.state.serviceId) // remove our edditing item
  
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

  service.array = arrayFiltered
  // update service with new array 

  var db = new PouchDB(`${sessionStorage.getItem('user')}`)
  db.get(this.state.selectedServiceItem._id).then((doc) => {
    doc.array = service.array
    return db.put(doc);
  }).then((result) => {
    alert('Update Success')
    let withoutOldServiceItem = this.props.service_item_reducer.filter(item => item._id !== service._id)
    withoutOldServiceItem.push(service)
    this.props.updateServiceItemArray(withoutOldServiceItem)
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


  const columns = [
    {
      Header: 'Date',
      accessor: 'id',
      sortMethod: (a, b) => {
        if (a == b) {
          return a > b ? 1 : -1
        }
        return a > b ? 1 : -1
      },
      Cell: row => (
        <div>
          {moment.unix(row.value).format('HH:mm , Do/MM/YYYY dd')}
        </div>
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
            <h2>Sotrage Service</h2>
            <button onClick={this.onOpenModalService}>Add Service to service</button>
          </div>
            <ReactTable
                    data={this.state.selectedServiceItem.array ? this.state.selectedServiceItem.array : []}
                    columns={columns}
                    defaultPageSize={10}
                    minRows={5}
                    className='tableProducts -striped -highlight'
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
    service_item_reducer: state.service_item_reducer,
    active_service: state.active_service
  }
}

const mapDispatch = (dispatch) => {
  return {
    updateServiceItemArray: (array) => {
      dispatch(updateServiceItemArray(array))
    }// updateEqServiceArray
    
  }
}

// Connect them:
export default connect(mapState, mapDispatch)(Service)
