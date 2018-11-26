import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
// import PLaceholderLpgp from '../images/logo_placeholder.png'
import {FaFlask, FaArrowRight, FaCubes, FaArrowDown, FaHome, FaDesktop, FaCalendarO, FaWrench, FaGroup} from 'react-icons/lib/fa'

export default class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      dashboardExpand: false,
      retailExpand: false,
      calendarExpand: false,
      repairExpand: false,
      staffExpand: false,
      refillxpand: false,
      equipmentexpand: false
    }
  }
  navClicked (e) {
    console.log(this.refClick)
  }

  render () {
    return (

      <div className='header_box'>
        <div className='header'>
          <div>
            <Link to='/' className='logo'>
              <h3>Diving-Hub</h3>
            </Link>
          </div>
          <button className={`expandButton ${this.state.dashboardExpand ? 'active' : ''}`}onClick={(e) => { this.setState({dashboardExpand: !this.state.dashboardExpand}) }} >
            <div>
              <FaHome size='20' color='#2899F3' /> Dashboard
            </div>
            {this.state.dashboardExpand ? <FaArrowDown size='15' color='#ddd' /> : <FaArrowRight size='15' color='#eee' />}
          </button>
          <Link className={`submenu ${this.state.dashboardExpand ? 'active' : ''}`} to={{pathname: '/dashboard', isauth: true}}>Dashboard</Link>
          <button className='expandButton' onClick={(e) => { this.setState({retailExpand: !this.state.retailExpand}) }} >
            <div>
              <FaDesktop size='20' color='#2899F3' /> Retail
            </div>
            {this.state.retailExpand ? <FaArrowDown size='15' color='#ddd' /> : <FaArrowRight size='15' color='#eee' />}
          </button>
<<<<<<< HEAD
          <Link to={{pathname: '/retail', isauth: true}} className={`submenu ${this.state.retailExpand ? 'active' : ''}`}>POS</Link>
          <Link to={{pathname: '/retail/history', isauth: true}} className={`submenu ${this.state.retailExpand ? 'active' : ''}`}>History</Link>
          <Link to={{pathname: '/retail/products', isauth: true}} className={`submenu ${this.state.retailExpand ? 'active' : ''}`}>Products</Link>
          <Link to={{pathname: '/retail/courses', isauth: true}} className={`submenu ${this.state.retailExpand ? 'active' : ''}`}>Courses</Link>
          <Link to={{pathname: '/retail/customers', isauth: true}} className={`submenu ${this.state.retailExpand ? 'active' : ''}`}>Customers</Link>
          <button className='expandButton' onClick={(e) => { this.setState({calendarExpand: !this.state.calendarExpand}) }} >
=======
          <Link to={{pathname: '/retail', isauth: true}} className={`submenu ${this.props.global.retail ? 'active' : ''}`}>Sales</Link>
          <Link to={{pathname: '/retail/history', isauth: true}} className={`submenu ${this.props.global.retail ? 'active' : ''}`}>History</Link>
          <Link to={{pathname: '/retail/products', isauth: true}} className={`submenu ${this.props.global.retail ? 'active' : ''}`}>Products</Link>
          <Link to={{pathname: '/retail/courses', isauth: true}} className={`submenu ${this.props.global.retail ? 'active' : ''}`}>Courses</Link>
          <Link to={{pathname: '/retail/customers', isauth: true}} className={`submenu ${this.props.global.retail ? 'active' : ''}`}>Customers</Link>
          {/* CALENDAR ________________ */}
          <button className='expandButton' onClick={(e) => { this.props.dispatchExtended({calendar: !this.props.global.calendar}) }} >
>>>>>>> Dist Commit
            <div>
              <FaCalendarO size='20' color='#2899F3' /> Calendar
            </div>
            {this.state.calendarExpand ? <FaArrowDown size='15' color='#ddd' /> : <FaArrowRight size='15' color='#eee' />}
          </button>
          <Link to={{pathname: '/calendar', isauth: true}} className={`submenu ${this.state.calendarExpand ? 'active' : ''}`}>Calendar</Link>
          {/* //  */}
          <button className='expandButton' onClick={(e) => { this.setState({equipmentexpand: !this.state.equipmentexpand}) }} >
            <div>
              <FaCubes size='20' color='#2899F3' /> <text>Equipment</text>
            </div>
            {this.state.equipmentexpand ? <FaArrowDown size='15' color='#ddd' /> : <FaArrowRight size='15' color='#eee' />}
          </button>
          <Link to={{pathname: '/equipment', isauth: true}} className={`submenu ${this.state.equipmentexpand ? 'active' : ''}`}>Equipment</Link>
          <Link to={{pathname: '/filling-station/compressor', isauth: true}} className={`submenu ${this.state.equipmentexpand ? 'active' : ''}`}>Rental</Link>
          {/* //  */}
          <button className='expandButton' onClick={(e) => { this.setState({repairExpand: !this.state.repairExpand}) }} >
            <div>
              <FaWrench size='20' color='#2899F3' /> Service
            </div>
            {this.state.repairExpand ? <FaArrowDown size='15' color='#ddd' /> : <FaArrowRight size='15' color='#eee' />}
          </button>
          <Link to={{pathname: '/service', isauth: true}} className={`submenu ${this.state.repairExpand ? 'active' : ''}`}>Service</Link>
          <button className='expandButton' onClick={(e) => { this.setState({staffExpand: !this.state.staffExpand}) }} >
            <div>
              <FaGroup size='20' color='#2899F3' /> <text>Staff</text>
            </div>
            {this.state.staffExpand ? <FaArrowDown size='15' color='#ddd' /> : <FaArrowRight size='15' color='#eee' />}
          </button>
          <Link to={{pathname: '/staff', isauth: true}} className={`submenu ${this.state.staffExpand ? 'active' : ''}`}>Members</Link>
          <button className='expandButton' onClick={(e) => { this.setState({refillxpand: !this.state.refillxpand}) }} >
            <div>
              <FaFlask size='20' color='#2899F3' /> Refill
            </div>
            {this.state.refillxpand ? <FaArrowDown size='15' color='#ddd' /> : <FaArrowRight size='15' color='#eee' />}
          </button>
          <Link to={{pathname: '/refill', isauth: true}} className={`submenu ${this.state.refillxpand ? 'active' : ''}`}>Tank Refills</Link>
          <Link to={{pathname: '/refill-station/compressor', isauth: true}} className={`submenu ${this.state.refillxpand ? 'active' : ''}`}>Compressor</Link>

        </div>

      </div>

    )
  }
}

// import React from 'react'
// import {Link} from 'react-router-dom'
// import PLaceholderLpgp from '../images/logo_placeholder.png'
// import {FaHome, FaDesktop, FaCalendarO, FaWrench, FaGroup, FaRefresh} from 'react-icons/lib/fa'

// const Header = (props) => {
//   return (

//     <div className='header_box'>
//       <div className='header'>
//         <div>
//           <Link to='/' className='logo'>
//             <h3>Diving-Hub</h3>
//           </Link>
//         </div>
//         <div>
//           <Link to={{pathname: '/dashboard', isauth: true}}>
//             <button className='pure-button'> Dashboard
//             </button>
//           </Link>
//         </div>
//         <div><Link to={{pathname: '/retail', isauth: true}} > </Link></div>
//         <div><Link to={{pathname: '/calendar', isauth: true}} > <button className='pure-button'></button></Link></div>
//         <div><Link to={{pathname: '/repair', isauth: true}} > <button className='pure-button'></button></Link></div>
//         <div><Link to={{pathname: '/staff', isauth: true}} ><button className='pure-button'></button></Link></div>
//         <div><Link to={{pathname: '/refill', isauth: true}} ><button className='pure-button'></button></Link></div>

//       </div>
//     </div>

//   )
// }

// export default Header
