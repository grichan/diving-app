import React, { Component } from 'react'
import PouchDB from 'pouchdb'

import {connect} from 'react-redux'
import {addProduct,
  addToPendingServices,
  addToPendingProducts,
  addToPendingCustomers} from '../../actions'

class SelectiveSearch extends Component {
  constructor (props) {
    super(props)

    this.state = {
      search: '',
      searchOptionSelected: 'Product',
      suggestions: []
    }
  }

  slectedSearchType (e) {
    var value = e.target.options[e.target.selectedIndex].value
    this.setState({searchOptionSelected: value,
      search: ''})
  }
  search (e) {
    this.setState({search: e.target.value})
    switch (this.state.searchOptionSelected) {
      case 'Product':
        return this.searchProducts(e.target.value)
      case 'Service':
        return this.searchServices(e.target.value)
      case 'Customer':
        return this.searchCustomers(e.target.value)
      default:
        return console.log('Error')
    }
  }

  searchProducts (search) {
    console.log(this.props.products)
    let keyword = search.toLowerCase()
    if (keyword && this.props.products) {
      var filtered = []
      var temp = 0
      this.props.products.forEach(item => {
        if (item.name.toLowerCase().indexOf(keyword) > -1 && temp < 10) {
          let temp = {name: item.name, id: item._id, type: 'Product'}
          filtered.push(temp)
        }
      })
      this.setState({
        suggestions: filtered
      })
    } else this.setState({suggestions: []})
  }

  searchServices (search) {
    console.log('searchServices')

    let keyword = search.toLowerCase()
    var filtered = []
    let db = new PouchDB(sessionStorage.getItem('user'))
    let emit
    function myFunction (doc) {
      if (doc._id.toLowerCase() === 'services') {
        doc.array.forEach(element => {
          emit(element.name.toLowerCase(), element._id)
        })
      }
    }
    if (keyword) {
      db.query(myFunction, {
        startkey: `${keyword}`,
        limit: 10,
        include_docs: true
      }).then((result) => {
        console.log(result)
        result.rows.map(item => {
          let temp = {name: item.key, id: item.value, type: 'Service'}
          filtered.push(temp)
          return temp
        })
        this.setState({suggestions: filtered})
      }).catch(function (err) {
        console.log('error' + err)
      })
    }

    this.setState({
      suggestions: filtered
    })
  }

  searchCustomers (search) {
    console.log(this.props.products)
    let keyword = search.toLowerCase()
    var filtered = []
    let db = new PouchDB(sessionStorage.getItem('user'))
    let emit
    function myMapFunction (doc) {
      if (doc._id.startsWith('Customer-')) {
        emit(`${doc.first_name.toLowerCase()} ${doc.last_name.toLowerCase()}`, doc._id)
      }
    }
    if (keyword) {
      db.query(myMapFunction, {
        startkey: `${keyword}`,
        limit: 10,
        include_docs: false
      }).then((result) => {
        console.log(result)
        result.rows.map(item => {
          let temp = {name: item.key, id: item.value, type: 'Customer'}
          filtered.push(temp)
        })
        this.setState({suggestions: filtered}) // NEED TO FINISH THIS !!!!!!
      }).catch(function (err) {
        console.log('error' + err)
      })
    }

    this.setState({
      suggestions: filtered
    })
  }

  displaySuggestions () {
    let array = this.state.suggestions
    return array.map(suggestion => {
      return (
        <li key={suggestion.id}>{suggestion.name} <button id={suggestion.id} onClick={(e) => { this.addSuggestion(e, suggestion.type) }}>add</button></li>
      )
    })
  }
  addSuggestion (e, type) {
    switch (type) {
      case 'Product':
        return this.addProductToPending(e.target.id)
      case 'Service':
        return this.addServiceToPending(e.target.id)
      case 'Customer':
        return this.addCustomerToPending(e.target.id)
      default:
        break
    }
  }

  addProductToPending (e) {
    console.log(this.props.products_pending)
    let temp = this.props.products_pending.filter(item => item._id == e)
    console.log(temp.length)
    if (this.props.products_pending) {
      if (temp.length <= 0) {
        console.log(e)
        let arr = this.props.products.filter(item => item._id == e)
        this.props.dispatchToPendingProducts(this.props.products_pending, arr[0])
        this.setState({search: '', suggestions: []})
        this.refs.search.focus()
        console.log('to be added:', arr)
      } else { this.refs.search.focus() }
    }
  }
  addServiceToPending (e) {
    console.log(this.props.services_pending)
    let temp = this.props.services_pending.filter(item => item._id == e)
    console.log(e)

    if (this.props.services_pending) {
      if (temp.length <= 0) {
        let db = new PouchDB(sessionStorage.getItem('user'))
        db.get('Services').then((doc) => {
          console.log(doc)
          let toBeAdded = doc.array.filter(item => item._id == e)
          console.log(toBeAdded)
          this.props.dispatchAddToPendingServices(this.props.services_pending, toBeAdded[0])
          this.setState({search: '', suggestions: []})
          this.refs.search.focus()
        }).catch((err) => {
          console.log(err)
        })
      } else { this.refs.search.focus() }
    }
  }
  addCustomerToPending (e) {
    console.log(this.props.customers_pending)
    let temp = this.props.customers_pending.filter(item => item._id === e)
    console.log(e)

    if (this.props.customers_pending) {
      if (temp.length <= 0) {
        let db = new PouchDB(sessionStorage.getItem('user'))

        db.get(e).then((doc) => {
          console.log(doc)
          this.props.dispatchToPendingCustomers(this.props.customers_pending, doc)
          this.setState({search: '', suggestions: []})
          this.refs.search.focus()
        }).catch((err) => {
          console.log(err)
        })
      } else { this.refs.search.focus() }
    }
  }

  render () {
    return (
      <div className='selective_search'>
        <div className='search_box'>
          <ul className='sugestions'>
            <div className='sugestions_box'>
              {this.displaySuggestions()}
            </div>
          </ul>
          <input ref='search' type='text' value={this.state.search} onChange={(e) => { this.search(e) }} placeholder='search' />

          <select onChange={(e) => { this.slectedSearchType(e) }}>
            <option value='Product'>Products</option>
            <option value='Service'>Service</option>
            <option value='Customer'>Customer</option>
          </select>
        </div>

      </div>
    )
  }
}
// Maps `state` to `props`:
// These will be added as props to the component.
function mapState (state) {
  return {
    products: state.products,
    products_pending: state.pending_products,
    customers_pending: state.pending_customers,
    services_pending: state.pending_services
  }
}

const mapDispatch = (dispatch) => {
  return {
    dispatchAddProduct: (productsState, arr) => {
      dispatch(addProduct(productsState, arr))
    },
    dispatchAddToPendingServices: (productsState, arr) => {
      dispatch(addToPendingServices(productsState, arr))
    },
    dispatchToPendingProducts: (productsState, arr) => {
      dispatch(addToPendingProducts(productsState, arr))
    },
    dispatchToPendingCustomers: (productsState, arr) => {
      dispatch(addToPendingCustomers(productsState, arr))
    }
  }
}

// Connect them:
export default connect(mapState, mapDispatch)(SelectiveSearch)
