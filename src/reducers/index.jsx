import { combineReducers } from 'redux'
import products from './products_reducer'
import customers from './customers_reducer'
import services from './services_reducer'
import pending_products from './pending_products'
import pending_customers from './pending_customers'
import pending_services from './pending_services'
import storages from './storages_reducer'
import calendar from './calendar'

const rootReducer = combineReducers({
  products,
  customers,
  services,
  pending_products,
  pending_customers,
  pending_services,
  calendar,
  storages
})

export default rootReducer
