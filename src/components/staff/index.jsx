import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'

import Search from '../search'
import Header from '../header'
// import CalendarHeader from './header'

import {connect} from 'react-redux'
import {addCalendarEvents, addEvent} from '../../actions'

import PouchDB from 'pouchdb'

import moment from 'moment'
import BigCalendar from 'react-big-calendar'
import Modal from 'react-responsive-modal';
// import {FaInfo} from 'react-icons/lib/fa'
import Fade from 'react-reveal/Fade'

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
      eventStart: '',
      eventEnd: '',
      eventName: '',
      eventDesc: '',
      eventId: 0,
      selectable: false,
    }
  }

  componentWillMount () {
    this.getEvents()

  }
  componentDidMount() {

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
  onCloseModal = () => {
      this.setState({ open: false });
      };

  getEvents () {
    // BY MONTH
    let date = new moment().format('YYYY')
    let docName = 'Events-' + date
    let doc = this.getLocalDbDoc(docName).then(()=>{
      console.log('Doc transfered:', doc)
    })
    if (doc.array !== null) {
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

  addEventClick(e){
    this.addEventToLocalDb()  
  }

  addEventToLocalDb () {

    let data = { 
                id: this.state.eventId,
                title: this.state.eventName,
                start: moment(this.state.eventStart).toDate(),
                end:  moment(this.state.eventEnd).toDate(),
                desc: this.state.eventDesc
                }
    let date = new moment().format('YYYY')
    let docName = 'Events-' + date
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

  render () {
    if (!sessionStorage.getItem('Auth')) {
      return <Redirect to='/signup' />
    }
    return (
      <div className='component_container'>
        <Header isauth />
        <div className='container_right'>
          <Search />
          <Fade>
          <div className='right_header'>
        <h1>Staff</h1>
      </div>
          <div className='dashboard_container'>
          <Modal classNames='modal_add_products'  open={this.state.open} onClose={this.onCloseModal} center>
          <div className='modal_inner_box'>
            <h1>{this.state.selectable? 'Add New Event':'Edit Event'}</h1>
            Event Title: <input  type="text" value={this.state.eventName} 
              onChange={(e)=>{this.setState({eventName: e.target.value})}}/>
            Start:<input  type="text" value={this.state.eventStart} 
              onChange={(e)=>{this.setState({eventStart: e.target.value})}}/>
            End:<input  type="text" value={this.state.eventEnd}
               onChange={(e)=>{this.setState({eventEnd: e.target.value})}}/>
               <p>(Please Keep Formating Consistent Month/Day/Year AM/PM)</p>
            Description: <input type="text" value={this.state.eventDesc} 
              onChange={(e)=>{this.setState({eventDesc: e.target.value})}}/>
            
            <button type='submit' id='addEvent' onClick={(e)=>{this.addEventClick(e)}}>Add</button>
            </div>
        </Modal>  
        <div className='calendar_buttons'>
          <button onClick={()=>{this.setState({selectable: false})}}>Edit Event</button>
          <button onClick={()=>{this.setState({selectable: true})}}>Add Event</button>          
          </div> 
          
          <div className={`color_box ${this.state.selectable ? 'selectable': 'editable'}`}>
          <h3>{this.state.selectable?'Add Event':'Edit Event'}</h3>
            <BigCalendar
              selectable= {this.state.selectable}
              events={this.props.calendar.map(date=>{
                date.start = new Date(date.start)
                date.end = new Date(date.end)
                return date
              })}
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
            />
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
    calendar: state.calendar
  }
}

const mapDispatch = (dispatch) => {
  return {
    dispatchAddCalendarEvents: (array) => {
      dispatch(addCalendarEvents(array))
    },
    dispatchAddEvent: (servicesState, arr) => {
      dispatch(addEvent(servicesState, arr))
    }

  }
}

// Connect them:
export default connect(mapState, mapDispatch)(Staff)
