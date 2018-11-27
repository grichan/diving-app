import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import {Link, Redirect} from 'react-router-dom'
// import PLaceholderLpgp from '../images/logo_placeholder.png'
import {FaFlask, FaArrowRight, FaCubes, FaArrowDown, FaHome, FaDesktop, FaCalendarO, FaWrench, FaGroup} from 'react-icons/lib/fa'

// Redux
import {connect} from 'react-redux'
import {expandedNav} from '../actions'

class Header extends Component {
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
    if (sessionStorage.getItem('offline') == 'true') {

    } else if (sessionStorage.getItem('Auth') == 'false' || !sessionStorage.getItem('Auth')) {
      return <Redirect to='/signup' />
    }
    return (

      <div className='header_box'>
        <div className='header'>
          <div>
            <Link to='/' className='logo'>
              <h3>Diving-Hub</h3>
            </Link>
          </div>
          {/* DASHBOARD */}
          <button className={`expandButton ${this.props.global.dashboard ? 'active' : ''}`}onClick={(e) => { this.props.dispatchExtended({dashboard: !this.props.global.dashboard}) }} >
            <div>
              <FaHome size='20' color='#2899F3' /> Dashboard
            </div>
            {this.props.global.dashboard ? <FaArrowDown size='15' color='#ddd' /> : <FaArrowRight size='15' color='#eee' />}
          </button>
          <Link className={`submenu ${this.props.global.dashboard ? 'active' : ''}`} to={{pathname: '/dashboard', isauth: true}}>Dashboard</Link>
          {/* RETAIL ____________ */}
          <button className='expandButton' onClick={(e) => { this.props.dispatchExtended({retail: !this.props.global.retail}) }} >
            <div>
              <FaDesktop size='20' color='#2899F3' /> Retail
            </div>
            {this.props.global.retail ? <FaArrowDown size='15' color='#ddd' /> : <FaArrowRight size='15' color='#eee' />}
          </button>
          <Link to={{pathname: '/retail', isauth: true}} className={`submenu ${this.props.global.retail ? 'active' : ''}`}>Sales</Link>
          <Link to={{pathname: '/retail/history', isauth: true}} className={`submenu ${this.props.global.retail ? 'active' : ''}`}>History</Link>
          <Link to={{pathname: '/retail/products', isauth: true}} className={`submenu ${this.props.global.retail ? 'active' : ''}`}>Products</Link>
          <Link to={{pathname: '/retail/courses', isauth: true}} className={`submenu ${this.props.global.retail ? 'active' : ''}`}>Courses</Link>
          <Link to={{pathname: '/retail/customers', isauth: true}} className={`submenu ${this.props.global.retail ? 'active' : ''}`}>Customers</Link>
          {/* CALENDAR ________________ */}
          <button className='expandButton' onClick={(e) => { this.props.dispatchExtended({calendar: !this.props.global.calendar}) }} >
            <div>
              <FaCalendarO size='20' color='#2899F3' /> Calendar
            </div>
            {this.props.global.calendar ? <FaArrowDown size='15' color='#ddd' /> : <FaArrowRight size='15' color='#eee' />}
          </button>
          <Link to={{pathname: '/calendar', isauth: true}} className={`submenu ${this.props.global.calendar ? 'active' : ''}`}>Calendar</Link>
          {/* EQUIPMENT_______________  */}
          <button className='expandButton' onClick={(e) => { this.props.dispatchExtended({equipment: !this.props.global.equipment}) }} >
            <div>
              <FaCubes size='20' color='#2899F3' /> <text>Equipment</text>
            </div>
            {this.props.global.equipment ? <FaArrowDown size='15' color='#ddd' /> : <FaArrowRight size='15' color='#eee' />}
          </button>
          <Link to={{pathname: '/equipment', isauth: true}} className={`submenu ${this.props.global.equipment ? 'active' : ''}`}>Equipment</Link>
          <Link to={{pathname: '/equipment/rental', isauth: true}} className={`submenu ${this.props.global.equipment ? 'active' : ''}`}>Rental</Link>
          {/* SERVICE_____________  */}
          <button className='expandButton' onClick={(e) => { this.props.dispatchExtended({service: !this.props.global.service}) }} >
            <div>
              <FaWrench size='20' color='#2899F3' /> Service
            </div>
            {this.props.global.service ? <FaArrowDown size='15' color='#ddd' /> : <FaArrowRight size='15' color='#eee' />}
          </button>
          <Link to={{pathname: '/service', isauth: true}} className={`submenu ${this.props.global.service ? 'active' : ''}`}>Service</Link>
          {/* STAFF_____________ */}
          <button className='expandButton' onClick={(e) => { this.props.dispatchExtended({staff: !this.props.global.staff}) }} >
            {/* <button className='expandButton' onClick={(e) => { this.setState({staffExpand: !this.state.staffExpand}) }} > */}
            <div>
              <FaGroup size='20' color='#2899F3' /> <text>Staff</text>
            </div>
            {this.props.global.staff ? <FaArrowDown size='15' color='#ddd' /> : <FaArrowRight size='15' color='#eee' />}
          </button>
          <Link to={{pathname: '/staff', isauth: true}} className={`submenu ${this.props.global.staff ? 'active' : ''}`}>Members</Link>
          {/* REFIL________________  */}
          <button className='expandButton' >
            {/* onClick={(e) => { this.props.dispatchExtended({refill: !this.props.global.refill})  }} > */}
            <div>
              <FaFlask size='20' color='#2899F3' /> Refill
            </div>
            {this.props.global.refill ? <FaArrowDown size='15' color='#ddd' /> : <FaArrowRight size='15' color='#eee' />}
          </button>
          <Link to={{pathname: '/refill', isauth: true}} className={`submenu ${this.props.global.refill ? 'active' : ''}`}>Tank Refills</Link>
          <Link to={{pathname: '/refill-station/compressor', isauth: true}} className={`submenu ${this.props.global.refill ? 'active' : ''}`}>Compressor</Link>

        </div>

      </div>

    )
  }
}

// These will be added as props to the component.
function mapState (state) {
  console.log(state.services)
  return {
    global: state.global
  }
}

const mapDispatch = (dispatch) => {
  return {
    dispatchExtended: (array) => {
      dispatch(expandedNav(array))
    }
  }
}

// Connect them:
export default connect(mapState, mapDispatch)(Header)

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
