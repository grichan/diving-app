import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Fade from 'react-reveal/Fade'
import MockupPC from './images/mockup.png'
import {IoAndroidAddCircle, IoCalendar, IoAndroidList, IoAndroidPerson, IoAndroidCloud} from 'react-icons/lib/io'
import Scroll from 'react-scroll-to-element'

export default class Landing extends Component {
  constructor (props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount () {
  }
  componentDidUpdate () {
  }

  click () {
  }

  render () {
    return (
      <div className='landing' >
        <div>
          <div className='menu'>
            <a className='pure-menu-heading pure-menu-link'>DIVING-HUB</a>
            <ul className='menu-items'>
              <Scroll type='id' element='home'><li className='menu-item logo'><a className='pure-menu-link'>Home</a></li></Scroll>
              <Scroll type='id' element='features'><li className='menu-item' onClick={this.click}><a className='pure-menu-link'>Features</a></li></Scroll>
              <Scroll type='id' element='app'><li className='menu-item'><a className='pure-menu-link'>App</a></li></Scroll>
              <Scroll type='id' element='pricing'><li className='menu-item'><a className='pure-menu-link'>Pricing</a></li></Scroll>
              <li className='menu-item sign_up'><Link to='/signup'>Sign Up</Link></li>
            </ul>
          </div>
        </div>

        <div className='pure-g cover' id='home'>

          <div className='pure-u-1 cover_image'>
            <div className='pure-g '>
              <div className='inner_section'>
                <Fade>
                  <div className='cover_inner_elements'>
                    <h1>Your Managment Hub For Diving </h1>
                    <p>All the esential tools needed for running a Dive Shop<br />Available offline and online.</p>
                    <div className='cover_buttons'>
                      <Link to='/signup'> <button className='pure-button'>Sign Up</button></Link>
                      <a href={MockupPC} download='proposed_file_name'><button className='pure-button download'>Download</button></a>
                    </div>
                  </div>
                </Fade>
              </div>
            </div>
          </div>
        </div>
        <Fade>
          <div className='box' id='features'>
            <section className='pure-g features_header'>
              <img className='features_image' src={MockupPC} alt='' />
              <div className='features_paragraph'>
           Featues Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, at repudiandae. Saepe eaque, voluptate assumenda quidem quasi delectus veniam quia quis magnam, aspernatur quod veritatis. Tempora inventore omnis commodi dolorem.
              </div>
            </section>
          </div>
        </Fade>
        <Fade bottom cascade>
          <div>
            <div className='pure-g features_app' id='app'>
              <div className='feature_box'>
                <IoAndroidAddCircle size={100} />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio earum delectus animi, rem, et autem quis debitis asperiores esse, vel veniam iure similique iusto. Reiciendis distinctio nobis eos sit inventore.</p>
            a
              </div>
              <div className='feature_box'>
                <IoAndroidCloud size={100} />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio earum delectus animi, rem, et autem quis debitis asperiores esse, vel veniam iure similique iusto. Reiciendis distinctio nobis eos sit inventore.</p>
            b
              </div>
              <div className='feature_box'>
                <IoAndroidAddCircle size={100} />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio earum delectus animi, rem, et autem quis debitis asperiores esse, vel veniam iure similique iusto. Reiciendis distinctio nobis eos sit inventore.</p>
            c
              </div>
            </div>

            <div className='pure-g features_app'>
              <div className='feature_box'>
                <IoAndroidPerson size={100} />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio earum delectus animi, rem, et autem quis debitis asperiores esse, vel veniam iure similique iusto. Reiciendis distinctio nobis eos sit inventore.</p>
            a
              </div>
              <div className='feature_box'>
                <IoAndroidList size={100} />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio earum delectus animi, rem, et autem quis debitis asperiores esse, vel veniam iure similique iusto. Reiciendis distinctio nobis eos sit inventore.</p>
            b
              </div>
              <div className='feature_box'>
                <IoCalendar size={100} />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio earum delectus animi, rem, et autem quis debitis asperiores esse, vel veniam iure similique iusto. Reiciendis distinctio nobis eos sit inventore.</p>
            c
              </div>
            </div>
          </div>

        </Fade>
        <div className='pricing'>
          <Fade bottom >
            <div className='pricing_box'>
              <h4>Free</h4>
              <h5>$0 / Month</h5>
              <ul>
                <li>Early Development Stage</li>
                <li>No Offline Support</li>
                <li>Bugs Crawling Inside</li>
              </ul>
              <button className='pure-button'>Purchase</button>
            </div>
          </Fade>
          <Fade bottom >
            <div className='pricing_box' id='pricing'>
              <h4>Paid</h4>
              <h5>$20 / Month</h5>
              <ul>
                <li>Upon Official Release</li>
                <li>Offline Support Available</li>
                <li>Polished Dime</li>
              </ul>
              <button className='pure-button' disabled>Purchase</button>
            </div>
          </Fade>
        </div>
        <Fade bottom>
          <div className='landing_footer'>
            <div className='landing_footer_box'>
              <ul>
                <li>FaceBook</li>
                <li>Instagram </li>
                <li>YouTube</li>
                <li>Twitter</li>
              </ul>
            </div>
            <div className='landing_footer_box'>Copyright ©2018 All rights reserved</div>
            <div className='landing_footer_box'>
              <ul>
                <li id='test'>Legal Terms</li>
                <li>More About Us </li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
        </Fade>
      </div>
    )
  }
}
