import React from 'react'
import {Link} from 'react-router-dom'
import './retail.css'

const RetailHeader = (props) => {
  return (
    <div className='header_inner'>
      <h1>Point of sales</h1>
      <ul className='navigation'>
        <Link to='/retail/register' className='pure-button' > Sales Register </Link>
        <Link className='pure-button' to='/retail/history'> History </Link>
        <Link to='/retail/products' className='pure-button'> Products </Link>
        <Link to='/retail/courses' className='pure-button'> Courses </Link>
        <Link to='/retail/customers' className='pure-button'> Customers </Link>
      </ul>
    </div>
  )
}

export default RetailHeader
