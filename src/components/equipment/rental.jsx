import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'

import Search from '../search'
import Header from '../header'
// import CalendarHeader from './header'

import {connect} from 'react-redux'
import {addEqRentArray, addEqRent} from '../../actions'

import PouchDB from 'pouchdb'

import moment from 'moment'
import BigCalendar from 'react-big-calendar'
import Modal from 'react-responsive-modal';
// import {FaInfo} from 'react-icons/lib/fa'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Fade from 'react-reveal/Fade'

import 'react-big-calendar/lib/css/react-big-calendar.css'
// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment) // or globalizeLocalizer



class Rental extends Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false,
      open_edit: false,
      rentArray: [],
      rentItem: { 
        id:0,
        start: 'test',
        end: 'date',
        price: 122,
        name: 'Test Item',
        customer: 'customer info'
    },

      eventCustomerDescription: '',
      eventId: 0,
      selectable: false,
    }
  }

  componentWillMount () {

  }
  componentDidMount() {
    this.getRent()

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

  getLocalDbDoc(docName) {
    var db = new PouchDB(`${sessionStorage.getItem('user')}`)
    return db.get(docName).then((doc) => {
      console.log('Doc Recived:',doc);
      this.props.dispatchAddEqRentArray(doc.array)      
      this.setState({
        rentArray: doc.array
      })
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

    onOpenEditModal = () => {
      this.setState({ open_edit: true });
      };
  onCloseModalWithData = (arr) => {
    //this.props.dispatchAddCalendarEvents(arr)
    this.setState({ open: false });
    };

  onCloseModal = () => {
      this.setState({ open: false, rentItem: {} });
      };

  onCloseEditModal = (e) => {
    this.setState({ open_edit: false });
    };

    openEditModal = (e) => {
      console.log( e.target.id)
      let arr = this.props.eqRent
      let selected = arr.filter(item => item.id == e.target.id)
      this.setState({ 
        rentItem: { 
          id: selected[0].id,
          start: selected[0].start,
          end: selected[0].end,
          price: selected[0].price,
          name: selected[0].name,
          customer: selected[0].customer
      },
        open_edit: true });
    }

  getRent () {
    let date = new moment().format('MM-YYYY')
    let docName = 'Rent-' + date
    let doc = this.getLocalDbDoc(docName).then(()=>{
      console.log('Doc transfered:', doc)

    })
    if (doc.array !== null) {

    }
  }

  addRentalClick(e){
    // alert('Add event')
    let temp = this.state.rentItem
    this.getRent()
    console.log(temp.name, temp.start, temp.end, temp.customer, temp.price);
    // addRentItemToDb
    this.addRentToLocalDb()
}

updateRentalClick(e){
  // alert('Add event')
  let temp = this.state.rentItem
  //this.getRent()
  // addRentItemToDb
  this.updateRentToLocalDb()
}

deleteRentalClick(e){
  console.log(e);
  
  let data = this.state.rentItem
  let date = new moment().format('MM-YYYY')
  let docName = 'Rent-' + date
  var db = new PouchDB(`${sessionStorage.getItem('user')}`)
  let arrayWithoutSelected = this.props.eqRent.filter(item => item.id != this.state.rentItem.id)
  console.log(arrayWithoutSelected)
  console.log(this.state.rentItem.id)
  db.get(docName).then((doc) => {
    // alert('This is doc from DB',doc)
    let arr = doc.array
    // alert('Array of the doc',arr)

      // alert('New Event')
      // data.id = moment().unix()
      // arr.push(data)
    
    db.put({
      _id: docName,
      _rev: doc._rev,
      array: arrayWithoutSelected
    }).then(()=>{
      this.setState({
        rentArray: arrayWithoutSelected,
        rentItem: []
      })
        this.onCloseEditModal()
        this.props.dispatchAddEqRentArray(arrayWithoutSelected)

    })

 
  })
  .catch((err) => {
    console.log(err)
  })

}

  addRentToLocalDb () {

    let data = this.state.rentItem
    let date = new moment().format('MM-YYYY')
    let docName = 'Rent-' + date
    var db = new PouchDB(`${sessionStorage.getItem('user')}`)

    db.get(docName).then((doc) => {
      // alert('This is doc from DB',doc)
      let arr = doc.array
      // alert('Array of the doc',arr)

       //  alert('New Event')
        data.id = moment().unix()
        arr.push(data)
      
      db.put({
        _id: docName,
        _rev: doc._rev,
        array: arr
      })      
      this.onCloseModal()
      this.replicateToDb(db)
      this.props.disptatchAddEqRent(this.props.eqRent, data)
      
    })
    .catch((err) => {
      console.log(err)
    })

  }

  updateRentToLocalDb () {

    let data = this.state.rentItem
    let date = new moment().format('MM-YYYY')
    let docName = 'Rent-' + date
    var db = new PouchDB(`${sessionStorage.getItem('user')}`)
    let arrayWithoutSelected = this.state.rentArray.filter(item => item.id != this.state.rentItem.id)
    console.log(arrayWithoutSelected)
    console.log(this.state.rentItem.id)
    arrayWithoutSelected.push(this.state.rentItem)
    console.log(arrayWithoutSelected)
    db.get(docName).then((doc) => {
      // alert('This is doc from DB',doc)
      let arr = doc.array
      // alert('Array of the doc',arr)

        // alert('New Event')
        // data.id = moment().unix()
        // arr.push(data)
      
      db.put({
        _id: docName,
        _rev: doc._rev,
        array: arrayWithoutSelected
      })
      this.setState({
        rentArray: arrayWithoutSelected
      })
      this.onCloseModal()
      this.replicateToDb(db)
      this.props.dispatchAddEqRentArray(arrayWithoutSelected)

    })
    .catch((err) => {
      console.log(err)
    })

  }


  render () {
    if (sessionStorage.getItem('offline') == 'true') {

    } else if (sessionStorage.getItem('Auth') == 'false' || !sessionStorage.getItem('Auth')) {
      return <Redirect to='/signup' />
    }

    const columns = [{
      Header: 'id',
      id: 'id',
      accessor: d => moment.unix(d.id).format('HH:mm , Do/MM/YYYY dd  ')
    }, {
      Header: 'Name',
      accessor: 'name' // String-based value accessors!
    }, {
      Header: 'Start Date',
      accessor: 'start' // String-based value accessors!
    }, {
      Header: 'End Date',
      accessor: 'end' // String-based value accessors!
    },{
      Header: 'Price',
      accessor: 'price' // String-based value accessors!
    },{
      Header: 'Edit',
      id: 'card',
      accessor: d => (
        <div>
          <button id={d.id} onClick={(e)=>this.openEditModal(e)}>Edit</button>
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
        <h1>Rent</h1>
        <p>Rented out items</p>

      </div>
          <div className='dashboard_container'>
 
        <div className='calendar_buttons'>
          <button onClick={()=>{this.setState({open: true})}}>Add</button>      
        </div> 
          
          <div className={`color_box ${this.state.selectable ? 'selectable': 'editable'}`}>
            <h3>Items </h3>
            </div>
          </div>
        <Fade>
          <ReactTable
                data={this.props.eqRent}
                columns={columns}
                defaultPageSize={10}
                className='-striped -highlight'
              />
        </Fade>

        </Fade>
        </div>

        <Modal classNames='modal_add_products'  open={this.state.open} onClose={this.onCloseModal} center>
          <div className='modal_rental_edit'>
            <h1>Rent Out</h1>
            Item Name: 
            <input autoFocus type="text" value={this.state.rentItem.name} 
              onChange={(e)=>{
                var temp = this.state.rentItem
                temp.name = e.target.value
                this.setState({rentItem: temp})}}/> 
            Rent Start Date:<input  type="text" value={this.state.rentItem.start} 
              onChange={(e)=>{
                var temp = this.state.rentItem
                temp.start = e.target.value
                this.setState({
                rentItem: temp})}}/>
            Rent End Date:<input  type="text" value={this.state.rentItem.end}
               onChange={(e)=>{
                var temp = this.state.rentItem
                temp.end = e.target.value
                 this.setState({rentItem: temp})}}/>
            Price: <input type="number" value={this.state.rentPrice} 
              onChange={(e)=>{
                let temp = this.state.rentItem
                temp.price = e.target.value
                this.setState({
                rentItem: temp})}}/>
            Customer Information: <input type="text" value={this.state.rentItem.customer} 
              onChange={(e)=>{
                let temp = this.state.rentItem
                temp.customer = e.target.value
                this.setState({
                rentItem: temp})}}/>
            <br/>
            <div className='buttons_add_rental'>
            <button type='submit' id='addEvent' onClick={(e)=>{this.addRentalClick(e)}}>Add</button>
            </div>
            </div>
        </Modal> 

        {/* EDIT MODAL ------------------------- */}
                  
        <Modal classNames='modal_add_products'  open={this.state.open_edit} onClose={this.onCloseEditModal} center>
          <div className='modal_rental_edit'>
            <h1>Editing </h1>
            Item Name: <input autoFocus type="text" value={this.state.rentItem.name} 
              onChange={(e)=>{
                var temp = this.state.rentItem
                temp.name = e.target.value
                this.setState({rentItem: temp})}}/> 
            Rent Start Date:<input  type="text" value={this.state.rentItem.start} 
              onChange={(e)=>{
                var temp = this.state.rentItem
                temp.start = e.target.value
                this.setState({
                rentItem: temp})}}/> 
            Rent End Date:<input  type="text" value={this.state.rentItem.end}
               onChange={(e)=>{
                var temp = this.state.rentItem
                temp.end = e.target.value
                 this.setState({rentItem: temp})}}/>
            Price: <input type="number" value={this.state.rentItem.price} 
              onChange={(e)=>{
                let temp = this.state.rentItem
                temp.price = e.target.value
                this.setState({
                rentItem: temp})}}/>
            Customer Information: <input type="text" value={this.state.rentItem.customer} 
              onChange={(e)=>{
                let temp = this.state.rentItem
                temp.customer = e.target.value
                this.setState({
                rentItem: temp})}}/>
            <br/>
            <div className='buttons_edit_rental'>
            <button type='submit' id='addEvent' onClick={(e)=>{this.updateRentalClick(e)}}>Save</button>
            <button onClick={(e)=>{this.deleteRentalClick(e)}}>Delete</button>
            </div>
            </div>
        </Modal> 
      </div>
    )
  }
};
// These will be added as props to the component.
function mapState (state) {
  console.log(state.services)
  return {
    eqRent: state.eqrent
  }
}

const mapDispatch = (dispatch) => {
  return {
    dispatchAddEqRentArray: (array) => {
      dispatch(addEqRentArray(array))
    },
    disptatchAddEqRent: (pendingState, newElement) => {
      dispatch(addEqRent(pendingState, newElement))
    }

  }
}

// Connect them:
export default connect(mapState, mapDispatch)(Rental)
