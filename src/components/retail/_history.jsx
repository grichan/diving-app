import React, { Component } from 'react'
import Moment from 'moment'
import PouchDB from 'pouchdb'

export default class Test extends Component {
  constructor (props) {
    super(props)

    this.state = {
      position: 0,
      limit: 15
    }
  };
  componentDidMount () {
    this.queryView()
  }

  queryView () {
    var start = Moment().startOf('day').unix()
    console.log(start)
    let user = sessionStorage.getItem('user')
    let db = new PouchDB(`${user}`)
    console.log(start)
    let position = this.state.position
    let limit = this.state.limit
    db.query('new/by_order1', { // query it
      startkey: `${position}`,
      limit: limit
    }).then((res) => {
      console.log(res.rows)
      let newPosition = position + limit
      this.setState({
        history: res.rows,
        position: newPosition
      }, () => {
        console.log(this.state.actions_today)
      })
      //  query results
    }).catch(function (err) {
      console.log(err)
      // some error
    })
  }

  render () {
    return (
      <div>
Test
      </div>
    )
  }
}
