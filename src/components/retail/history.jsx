import React, { Component } from 'react'

import Search from '../search'
import AppNavigation from '../header'
// import RetailHeader from './header'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Moment from 'moment'
import PouchDB from 'pouchdb'
import Fade from 'react-reveal/Fade'

import { LineChart, Line, CartesianGrid, XAxis,
  YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const columns = [{
  Header: 'Date',
  id: 'date',
  accessor: d => Moment.unix(d.date).format('HH:mm , Do/MM/YYYY dd  ')
}, {
  Header: 'Id',
  accessor: 'id' // String-based value accessors!
}, {
  Header: 'Card',
  id: 'card',
  accessor: d => d.card ? 'yes' : 'no' // String-based value accessors!
}, {
  Header: 'Total',
  accessor: 'total' // String-based value accessors!
}]

class History extends Component {
  constructor (props) {
    super(props)

    this.state = {
      data: []
    }
  }

  componentDidMount () {
    this.getOrders()
  }

  componentDidUpdate () {

  }

  todayOrderData () {
    let arr = []
    let startOfDay = Moment().startOf('day').unix()
    let todaysOrders = this.state.data.filter(item =>
      item.date > startOfDay
    )
    let totalIncome = 0
    arr = todaysOrders.map((order) => {
      let total = 0
      totalIncome = totalIncome + parseInt(order.total, 10)
      order.products.map((product) => {
        if (product) {
          return (total = total + parseInt(product.qty, 10))
        } else return false
      })
      order.services.map((service) => {
        if (service) {
          return (total = total + parseInt(service.qty, 10))
        } else return false
      })
      return {name: Moment.unix(order.date).format('HH:MM'), products: total}
    })
    // reduce function
    let result = arr.reduce((res, obj) => {
      if (res[obj.name]) {
        res[obj.name] = res[obj.name] + obj.products
      } else res[obj.name] = obj.products
      return res
    }, [])
    console.log(result)
    var keys = Object.keys(result)
    console.log(keys)
    arr = keys.map((key) => {
      return {name: key, products: result[key]}
    })
    console.log(arr)
    console.log(arr)
    return arr
  }

  monthOrderData () {
    let arr = []
    // GROUP DATA IN TO DAYS
    var set = new Set()
    this.state.data.map((order) => {
      set.add(Moment.unix(order.date).format('dd, MM/Do'))
    })
    // console.log(arr)
    arr = set.forEach(element => {
      arr.push({date: element, total: ''})
    })

    let arrValues = this.state.data.map((order) => {
      let total = 0
      order.products.map((product) => {
        if (product) {
          return (total = total + parseInt(product.qty))
        }
      })
      order.services.map((service) => {
        if (service) {
          return (total = total + parseInt(service.qty))
        }
      })
      let date = Moment.unix(order.date).format('dd, MM/Do')
      return {name: date, products: total}
    })

    // console.log(arrValues)
    // reduce function
    let result = arrValues.reduce((res, obj) => {
      if (res[obj.name]) {
        res[obj.name] = res[obj.name] + obj.products
      } else res[obj.name] = obj.products
      return res
    }, [])
    console.log(result)
    var keys = Object.keys(result)
    console.log(keys)
    arr = keys.map((key) => {
      return {name: key, products: result[key]}
    })
    // console.log(arr)
    return arr
  }

  getOrders () {
    // BY MONTH
    var db = new PouchDB(`${sessionStorage.getItem('user')}`)
    let date = new Moment().format('MM-YYYY')
    let docName = date + '-orders'
    // let date_id = new Moment().unix()

    // fetch Db
    db.get(docName).then((doc) => {
      console.log(doc.array)
      this.setState({
        data: doc.array
      })
    }).then(() => {
      // fetch mittens again
      console.log('Complete!')
    }).catch((err) => {
      console.log('Placing Order Error')
      if (err.status === 404) {
        console.log('Missing Document')
        var doc = { // if doc missing create one
          '_id': `${docName}`,
          'array': []
        }
        db.put(doc)
        console.log('Added Document')
        this.getOrders() // retry function
      }
    })
  }

  render () {
    return (
      <div className='component_container'>
        <AppNavigation />

        <div className='container_right' >
          <Search />
          <Fade >
            <div className='right_header'>
              <h1>Sales History</h1>
            </div>
            <div className='right_content' />

            <div className='history'>
              <div className='charts_box'>
                <div className='sold_chart' id=''>
                  <div className='chart_box'>
                    <ResponsiveContainer width={400} height={200}>
                      <LineChart data={this.todayOrderData()} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                        <Line type='monotone' dataKey='products' stroke='#9CCC65' />
                        <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                </div>

                <div className='spent_chart'>
                  <ResponsiveContainer width={400} height={200}>
                    <LineChart width={200} height={200} data={this.monthOrderData()} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                      <Line type='monotone' dataKey='products' stroke='#ef5350' />
                      <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
                      <XAxis dataKey='name' />
                      <YAxis />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className='history_box'>

              <ReactTable
                data={this.state.data}
                columns={columns}
                defaultPageSize={10}
                className='-striped -highlight'
                SubComponent={
                  row => {
                    return (
                      <div style={{ padding: '5px' }}>
                        <p>Customers:</p>
                        <em> {this.state.data[row.index].customers.map((customer) => {
                          return (
                            <li>{customer.first_name}  {customer.first_name}</li>
                          )
                        })} </em>
                        <p>Products:</p>
                        <em> {this.state.data[row.index].products.map((product) => {
                          return (
                            <li>{product.name} - price: {product.price} - qty: {product.qty} - discount: {product.discount}</li>
                          )
                        })} </em>
                        <p>Services:</p>
                        <em> {this.state.data[row.index].services.map((service) => {
                          return (
                            <li>{service.name} - price: {service.price} - qty: {service.qty} - discount: {service.discount}</li>
                          )
                        })} </em>
                        <br />
                      </div>
                    )
                  }}
              />

            </div>
          </Fade>
        </div>

      </div>
    )
  }
};

export default History
