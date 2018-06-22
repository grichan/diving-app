import React, { Component } from 'react'
import {connect} from 'react-redux'
import {addCustomer} from '../../actions'
import PouchDB from 'pouchdb'
PouchDB.plugin(require('pouchdb-quick-search'))

class searchCustomer extends Component {
  constructor (props) {
    super(props)

    this.state = {

    }
  }

  //   componentDidMount () {
  //     var localDB = new PouchDB(`${sessionStorage.getItem('user')}`, {skip_setup: true})

  //     localDB.search({
  //       query: 'Mask',
  //       fields: ['array.name'],
  //       filter: function (doc) {
  //         return doc.type === 'Customers' // only index persons
  //       }
  //     }).then(function (res) {
  //       console.log(res)
  //     }).catch(function (err) {
  //       console.log(err)
  //     })

  //     localDB.get('Customers').then((doc) => {
  //     // console.log('yea')
  //       console.log(doc)
  //       var array = []
  //       doc.array.map((item) => {
  //         array.push(item)
  //         // console.log(item);
  //       })
  //       this.props.dispatchAddCustomersArray(array).then(() => {
  //         console.log(this.props.products.map((item) => { console.log(item) }))
  //       })
  //     // console.log(array);
  //     }).catch(function (err) {
  //     // console.log(err);
  //     })
  //   }

  search (event) {
    this.setState({
      search_product_value: event.target.value
    })
    // console.log(event.target.value.length);
    if (event.target.value.length >= 2) {
      let keyword = event.target.value.toLowerCase()
      if (keyword && this.props.products) {
        console.log(this.props.products)
        var filtered = []
        var temp = 0
        this.props.products.forEach(item => {
          if (item.name.toLowerCase().indexOf(keyword) > -1 && temp < 10) {
            temp = temp + 1
            filtered.push(item)
          } else if (temp === 2) {

          }
        })
        // console.log(filtered)
        // let filtered = this.state.products.filter((item)=>{
        //     return item.name.toLowerCase().indexOf(keyword) > -1;
        // })
        console.log(filtered)
        this.setState({filteredProducts: filtered}, (ready) => {
          console.log(this.state.filteredProducts)
        })
      } else this.setState({filteredProducts: []})
    } else this.setState({filteredProducts: []})
  }

  addToPending (e, product) {
    e.preventDefault()
    if (product) {
      product.discount = '0'
      product.qtyToBuy = '1'
      let oldState = this.state.pending_items
      if (oldState.length <= 0) {
        console.log('empty state')
      }

      let duplicates = oldState.findIndex((element) => {
        if (element === product) {
          return true
        }
      })
      console.log(duplicates)
      if (duplicates >= 0) {
        alert('Already Added')
      } else if (duplicates === -1) {
        this.setState({
          pending_items: [ ...oldState, product]
        })
      }
      // console.log('added to state:')
      // console.log(this.state.pending_items)
      // empty the search query
      this.setState({
        filteredProducts: [],
        search_product_value: ''
      })
      this.search_product.current.focus()
      // focus search bar
    }
  }

  render () {
    return (
      <div>
        <input type='text' />
        as
      </div>
    )
  }
};

// Maps `state` to `props`:
// These will be added as props to the component.
function mapState (state) {
  return {
    // customers: state.custoners

  }
}

const mapDispatch = (dispatch) => {
  return {
    // // dispatchAddCustomersArray: (productsState, arr) => {
    // //   dispatch(addCustomersArray(productsState, arr))
    // }
  }
}

// Connect them:
export default connect(mapState, mapDispatch)(searchCustomer)
