import { combineReducers } from 'redux'
import products from './products_reducer'
import customers from './customers_reducer'
import services from './services_reducer'
import pending_products from './pending_products'
import pending_customers from './pending_customers'
import pending_services from './pending_services'
import storages from './storages_reducer'
import calendar from './calendar'
import eqrent from './eqrent_reducer'
import service_item_reducer from './service_item_reducer'
import staff_reducer from './staff_reducer'
import global from './global_reducer'

const rootReducer = combineReducers({
  products,
  customers,
  services,
  pending_products,
  pending_customers,
  pending_services,
  calendar,
  storages,
  service_item_reducer,
  staff_reducer,
  global,
  eqrent
})

export default rootReducer
