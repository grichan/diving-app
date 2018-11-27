import React from 'react'
import {Link} from 'react-router-dom'
import './refill.css'

const CalendarHeader = (props) => {
  return (
    <div className='header_inner'>
      <h1>Calendar</h1>
      <div className='navigation'>

        <Link to='/calendar' className='pure-button' > Menu </Link>
        <Link className='pure-button' to='/calendar'> Menu </Link>
        <Link to='/calendar' className='pure-button'> Menu </Link>
        <Link to='/calendar' className='pure-button'> Menu </Link>
        <Link to='/calendar' className='pure-button'> Option </Link>
      </div>
    </div>
  )
}

export default CalendarHeader
