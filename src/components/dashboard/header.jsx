import React from 'react'
import {Link} from 'react-router-dom'

const DashBoardHeader = () => {
  return (
    <div>
      <div className='header_right'>
        <h1>Dashboard | Latest stuff</h1>
        <Link to='/'><button> Upcoming things </button></Link>
        <Link to='/'><button> Sales graph </button> </Link>
        <Link to='/'><button> Fills graph </button> </Link>
        <Link to='/'><button> Suppliers </button> </Link>
        <Link to='/'><button> Stores</button> </Link>
      </div>
    </div>
  )
}

export default DashBoardHeader
