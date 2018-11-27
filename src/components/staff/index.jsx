import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'

import Search from '../search'
import Header from '../header'
// import CalendarHeader from './header'

// Redux
import {connect} from 'react-redux'
import {addCalendarEvents, addEvent, getStaffArray} from '../../actions'
import './staff.css'
import {FaEdit, FaPlus} from 'react-icons/lib/fa'

import PouchDB from 'pouchdb'

import moment from 'moment'
import BigCalendar from 'react-big-calendar'
import Modal from 'react-responsive-modal'
import DatePicker from 'react-datepicker'
// import {FaInfo} from 'react-icons/lib/fa'
import Fade from 'react-reveal/Fade'

// CSS
import 'react-datepicker/dist/react-datepicker.css';
import 'react-big-calendar/lib/css/react-big-calendar.css'
// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment) // or globalizeLocalizer


class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

class Staff extends Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false,
      addStaffModalOpen: false,
      edditStaffModalOpen: false, 
      eventStart: '',
      eventEnd: '',
      eventName: '',
      eventDesc: '',
      eventId: 0,
      selectable: true,
      selectedStaff: 'EMPTY',
      staffName: '',
      staffAddress: '',
      staffPhone: 0,
      staffInfo: '',
      staffId: 0,
      selectedStaffName: 'Please Select Staff member'
    }
  }

  componentWillMount () {
    this.getStaff()
  }
  componentDidMount() {
    this.getEvents()
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
          'array': [],
          'members': []
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
    onCloseModal = () => {
        this.setState({ open: false });
        };
    onCloseAddStaffMemberModal = () => {
        this.setState({ addStaffModalOpen: false });
        };
    onCloseEdditStaffMemberModal = () => {
        this.setState({ edditStaffModalOpen: false });
        };

  getEvents () {
    // BY MONTH
    // let date = new moment().format('YYYY')
    let docName = 'Staff'
    let doc = this.getLocalDbDoc(docName).then((doc)=>{
      console.log('Doc transfered:', doc)
      this.props.dispatchAddCalendarEvents(doc.array)
    })
    if (doc.array !== null) {
    }
  }

  getStaff () {
    // BY MONTH
    // let date = new moment().format('YYYY')
    let docName = 'StaffMembers'
    let doc = this.getLocalDbDoc(docName).then((doc)=>{
      console.log('Doc transfered:', doc)
      this.setState({
        staffArray: doc.array
      })
      this.props.dispachAddStaff(doc.array)
      console.log(doc.array)

    })
    if (doc.array !== null) {
    }
  }

  createEvent (startDate, endDate, action) {
    this.setState({
      eventStart: moment(startDate),
      eventEnd: moment(endDate),
      eventName: this.state.selectedStaffName,
      eventDesc: '',
      eventId: 0,
    })
    this.onOpenModal()
  }

  editEvent (e) {
    console.log(e)
    this.setState({
      eventId: e.id,
      eventStart: moment(e.start),
      eventEnd: moment(e.end),
      eventName: e.title,
      eventDesc: e.desc,
    })
    this.onOpenModal()
  }

  addEventClick(e){
    this.addEventToLocalDb()  
  }
  deleteEventClick(e){
    this.setState({
      eventId: e.id
    }).then(()=>{this.deleteEventLocalDb()})
    

  }
  addStaffClick(e){
    //alert('Clicked')
    this.onCloseAddStaffMemberModal()
    this.addStaffToLocalDb()
  }

  deleteStaffClick(e){
    //alert('Clicked')
    this.deleteStaffToLocalDb()
  }

  staffSelectEvent(e){
    e.preventDefault()
    console.log('Clicked', e.target.id)
    this.setState({
      selectedStaffName: e.target.name,
      selectedStaffId: e.target.id

    })
  }

  addStaffToLocalDb () {

    let data = { 
                id: 0, // default 0 
                name: this.state.staffName,
                address: this.state.staffAddress,
                phone:  this.state.staffPhone,
                info: this.state.staffInfo
                }

    // let date = new moment().format('MM-YYYY')
    let docName = 'StaffMembers'
    var db = new PouchDB(`${sessionStorage.getItem('user')}`)

    db.get(docName).then((doc) => {
      // alert('This is doc from DB',doc)
      let arr = doc.array
      // alert('Array of the doc',arr)
      if ( data.id == 0) {
        // alert('New Event')
        data.id = moment().unix()
        arr.push(data)

      } else {
        // alert('Editing Existing')
        let eventsWithoutEdit = doc.array.filter(item => item.id != data.id)
        eventsWithoutEdit.push(data)
        arr = eventsWithoutEdit
      }
      console.log(arr)
      db.put({
        _id: docName,
        _rev: doc._rev,
        array: arr
      })      
      this.onCloseEdditStaffMemberModal()
      this.props.dispachAddStaff(arr)
      this.replicateToDb(db)
      this.state.setState({staffId:0 })

    })
    .catch((err) => {
      console.log(err)
    })
  }

  deleteStaffToLocalDb () {

    let data = { 
                id: this.state.staffId, // default 0 
                name: this.state.staffName,
                address: this.state.staffAddress,
                phone:  this.state.staffPhone,
                info: this.state.staffInfo
                }

    // let date = new moment().format('MM-YYYY')
    let docName = 'StaffMembers'
    var db = new PouchDB(`${sessionStorage.getItem('user')}`)

    db.get(docName).then((doc) => {
      let arr = doc.array
      if ( data.id == 0) {
        //alert('Could not find')
      } else {
        //alert('Deleting')
       arr = arr.filter(obj => obj.id !== this.state.staffId)
      }
      console.log(arr)
      db.put({
        _id: docName,
        _rev: doc._rev,
        array: arr
      })      
      this.onCloseEdditStaffMemberModal()
      this.props.dispachAddStaff(arr)
      this.replicateToDb(db)
      this.state.setState({staffId:0 })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  addEventToLocalDb () {
    let data = { 
                id: this.state.eventId,
                title: this.state.selectedStaffName,
                start: moment(this.state.eventStart._d).toDate(),
                end:  moment(this.state.eventEnd._d).toDate(),
                desc: this.state.eventDesc
                }

    // let date = new moment().format('MM-YYYY')
    let docName = 'Staff'
    var db = new PouchDB(`${sessionStorage.getItem('user')}`)

    db.get(docName).then((doc) => {
      alert('This is doc from DB',doc)
      let arr = doc.array
      alert('Array of the doc',arr)
      if ( data.id === 0) {
        alert('New Event')
        data.id = moment().unix()
        arr.push(data)
      } else {
        alert('Editing Existing')
        let eventsWithoutEdit = doc.array.filter(item => item.id !== data.id)
        eventsWithoutEdit.push(data)
        arr = eventsWithoutEdit
      }
      console.log(arr)
      db.put({
        _id: docName,
        _rev: doc._rev,
        array: arr
      })      
      this.onCloseModalWithData(arr)
      this.replicateToDb(db)
    })
    .catch((err) => {
      console.log(err)
    })
  }

deleteEventLocalDb(){
    let data = { 
      id: this.state.eventId,
      }

    // let date = new moment().format('MM-YYYY')
    let docName = 'Staff'
    var db = new PouchDB(`${sessionStorage.getItem('user')}`)

    db.get(docName).then((doc) => {
      alert('This is doc from DB',doc)
      let arr = doc.array
      alert('Array of the doc',arr)
      if ( data.id === 0) {
      alert('Does not exist')
      } else {
      alert('Deleting')
      let eventsWithoutEdit = doc.array.filter(item => item.id !== data.id)
      arr = eventsWithoutEdit
    }
      console.log(arr)
    db.put({
      _id: docName,
      _rev: doc._rev,
      array: arr
    })      
    this.onCloseModalWithData(arr)
    this.replicateToDb(db)
    })
    .catch((err) => {
    console.log(err)
    })
  }

  addMemberClick() {
    this.setState({addStaffModalOpen: true})

  }

  editStaff(id) {
    console.log(id)
    let array = this.props.staff
    let selected = array.filter(item => item.id == id)
    console.log(selected)
    this.setState({
      staffId: selected[0].id,
      staffName: selected[0].name,
      staffAddress: selected[0].address,
      staffPhone: selected[0].phone,
      staffInfo: selected[0].info,
      edditStaffModalOpen : true
    })
  }

  displayStaff() {
    if (this.props.staff) {
      return this.props.staff.map(item => {
        return (
        <li>
          <div className='service_name'><a href='#' id={item.id} name={item.name} 
          onClick={(e)=>{this.staffSelectEvent(e)}}>{item.name}</a></div>
          {/* eddit modal  */}
          <button onClick={(event) => this.editStaff(item.id)}>Info</button>
        </li>
      )}
      )
    }
  }

  render () {

    return (
      <div className='component_container'>
        <Header isauth />
        <div className='container_right'>
          <Search />
          <Fade>
          <div className='right_header'>
        <h1>Staff Time Table</h1>
      </div>
          <div className='dashboard_container'>
          
        {/* ###################### ADD Event MODAL #################### */}
        <Modal classNames='modal_add_products'  open={this.state.open} onClose={this.onCloseModal} center>
          <div className='modal_inner_box'>
            <h1>{this.state.selectable? 'Add New Event':'Edit Event'}</h1>
            <br/>

            <DatePicker
                selected={this.state.eventStart}
                onChange={(e)=>{this.setState({eventStart: e}), console.log(e);}}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="LLL"
                timeCaption="time"
            />
            <DatePicker
              selected={this.state.eventEnd}
              onChange={(e)=>{this.setState({eventEnd: e})}}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="LLL"
              timeCaption="time"
          />
               <p>(Please Keep Formating Consistent Month/Day/Year AM/PM)</p>
            Extra Info: <input type="text" value={this.state.eventDesc} 
              onChange={(e)=>{this.setState({eventDesc: e.target.value})}}/>
            deleteEventClick
            <button type='submit' id='addEvent' onClick={(e)=>{this.addEventClick(e)}}>Add</button>
            </div>
        </Modal>
        {/* ###################### ADD STAFF MODAL #################### */}
        <Modal classNames='modal_add_products'  open={this.state.addStaffModalOpen} onClose={this.onCloseAddStaffMemberModal} center>
          <div className='modal_inner_box'>
            <h1>Add new Member</h1>
            Member Name:  <input type="text" value={this.state.staffName} 
              onChange={(e)=>{this.setState({staffName: e.target.value})}}/> <br/>
            Address: <input type="text" value={this.state.staffAddress} 
              onChange={(e)=>{this.setState({staffAddress: e.target.value})}}/> <br/>
            Phone Number:  <input type="number" value={this.state.staffNumber} 
              onChange={(e)=>{this.setState({staffPhone: e.target.value})}}/> <br/>
            Additional Information: <input type="text" value={this.state.staffInfo} 
              onChange={(e)=>{this.setState({staffInfo: e.target.value})}}/> <br/>
            <button type='submit' id='addEvent' onClick={(e)=>{this.addStaffClick(e)}}>Add</button>
            </div>
        </Modal>
        {/* ###################### EDIT STAFF MODAL #################### */}
        <Modal classNames='modal_add_products'  open={this.state.edditStaffModalOpen} onClose={this.onCloseEdditStaffMemberModal} center>
          <div className='modal_inner_box'>
            <h1>Edit Member Information</h1>
            Member Name:  <input type="text" value={this.state.staffName} 
              onChange={(e)=>{this.setState({staffName: e.target.value})}}/> <br/>
            Address: <input type="text" value={this.state.staffAddress} 
              onChange={(e)=>{this.setState({staffAddress: e.target.value})}}/> <br/>
            Phone Number:  <input type="number" value={this.state.staffPhone} 
              onChange={(e)=>{this.setState({staffPhone: e.target.value})}}/> <br/>
            Additional Information: <input type="text" value={this.state.staffInfo} 
              onChange={(e)=>{this.setState({staffInfo: e.target.value})}}/> <br/>
            <button type='submit' id='addEvent' onClick={(e)=>{this.addStaffClick(e)}}>Save</button>
            <button onClick={(e)=>{this.deleteStaffClick(e)}}>Del</button>
            </div>
        </Modal>

       
          
          <div className={`color_box ${this.state.selectable ? 'selectable': 'editable'}`}>

          <div className='upper_box'>
          <p>Select Staff</p>
          </div>
          <br/><br/>
          <div className='staff_box'>
          <div className='button_div'>
            <button onClick={() => this.addMemberClick()}>Add New Member</button>
              </div>  
            { this.displayStaff()}   
                 
          </div>
          <div className='selected_staff'>
            Selected Staff: <div className='staff_name'>{this.state.selectedStaffName}</div> <br/>
          </div>

         
          <h3>{this.state.selectable?'Add Event':'Edit Event'}</h3>
          <div className='calendar_buttons'>
          <button onClick={()=>{this.setState({selectable: false})}}>Edit Event</button>
          <button onClick={()=>{this.setState({selectable: true})}}>Add Event</button>          
          </div> 
            <BigCalendar
              selectable= {this.state.selectable}
              events={this.props.calendar.map(date=>{
                date.start = new Date(date.start)
                date.end = new Date(date.end)
                return date
              })}
              style={{}}
              defaultView='week'
              scrollToTime={new Date(1970, 1, 1, 6)}
              defaultDate={new Date()}
              onSelectEvent={event => this.editEvent(event)}
              onSelectSlot={slotInfo =>
                // alert(
                //   `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
                //   `\nend: ${slotInfo.end.toLocaleString()}` +
                //   `\naction: ${slotInfo.action}`
                // )
                this.createEvent(slotInfo.start.toLocaleString(), slotInfo.end.toLocaleString(), slotInfo.action)

              }
              eventPropGetter={
                (event, start, end, isSelected) => {
                  //var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
                  console.log(event.title);
                  var hue = 'lightblue'
                  if (event.title == this.state.selectedStaffName) {
                    hue = '#4FC3F7'
                  }
                  let newStyle = {
                    backgroundColor: hue,
                    color: 'black',
                    borderRadius: "0px",
                    border: "none"
                  };
            
                  if (event.isMine){
                    newStyle.backgroundColor = "lightgreen"
                  }
            
                  return {
                    className: "",
                    style: newStyle
                  };
                }
              }
            />
            {/* end calendar */}
            <div className='round_button'>
          {this.state.selectable?<FaEdit onClick={()=>{this.setState({selectable: false})}} size='20'/> 
            :<FaPlus onClick={()=>{this.setState({selectable: true})}} size='40'/>}     
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
  console.log(state.services)
  return {
    calendar: state.calendar,
    staff: state.staff_reducer
  }
}

const mapDispatch = (dispatch) => {
  return {
    dispatchAddCalendarEvents: (array) => {
      dispatch(addCalendarEvents(array))
    },
    dispatchAddEvent: (servicesState, arr) => {
      dispatch(addEvent(servicesState, arr))
    },
    dispachAddStaff: (array) => {
      dispatch(getStaffArray(array))
    }

  }
}

// Connect them:
export default connect(mapState, mapDispatch)(Staff)
