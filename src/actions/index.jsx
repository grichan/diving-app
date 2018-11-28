
export function productsList () {
  return {
    type: 'PRODUCTS_LIST',
    payload: [
      {name: 'payload'}
    ]
  }
}

export function addProduct (productsState, arr) {
  const newNoMutation = [arr, ...productsState]
  return {
    type: 'ADD_PRODUCT',
    payload: newNoMutation

  }
}

export function addProductsArray (array) {
  return {
    type: 'ADD_PRODUCTS_ARRAY',
    payload:
      array

  }
}

export function addCustomer (pendingCustomers, newCustomer) {
  pendingCustomers.push(newCustomer)
  return {
    type: 'ADD_CUSTOMER',
    payload: pendingCustomers
  }
}

export function updateCustomerArray (newCustomerArray) {
  return {
    type: 'UPDATE_CUSTOMER_ARRAY',
    payload: newCustomerArray
  }
}

export function addServicesArray (array) {
  return {
    type: 'ADD_SERVICES_ARRAY',
    payload:
      array

  }
}
export function addService (pendingServices, newService) {
  pendingServices.push(newService)
  return {
    type: 'ADD_SERVICE',
    payload: pendingServices
  }
}
// ------------- ADD PENDING  -------------------
export function addToPendingServices (pendingState, newElement) {
  newElement.discount = '0'
  newElement.qtyToBuy = '1'
  const newNoMutation = [newElement, ...pendingState]
  return {
    type: 'ADD_TO_PENDING_SERVICES',
    payload: newNoMutation
  }
}

export function addToPendingProducts (pendingState, newElement) {
  if (newElement) {
    newElement.discount = '0'
  }
  if (newElement) {
    newElement.qtyToBuy = '1'
  }
  const newNoMutation = [newElement, ...pendingState]
  return {
    type: 'ADD_TO_PENDING_PRODUCTS',
    payload: newNoMutation
  }
}

export function addToPendingCustomers (pendingState, newElement) {
  const newNoMutation = [newElement, ...pendingState]
  return {
    type: 'ADD_TO_PENDING_CUSTOMERS',
    payload: newNoMutation
  }
}
// UPDATE --------------------
export function updateToPendingServices (pendingState) {
  const newNoMutation = [...pendingState]
  return {
    type: 'UPDATE_TO_PENDING_SERVICES',
    payload: newNoMutation
  }
}

export function updateToPendingEqService (pendingState) {
  const newNoMutation = [...pendingState]
  return {
    type: 'UPDATE_TO_PENDING_SERVICES',
    payload: newNoMutation
  }
}

export function updateToPendingCustomers (pendingState) {
  const newNoMutation = [...pendingState]
  return {
    type: 'UPDATE_TO_PENDING_CUSTOMERS',
    payload: newNoMutation
  }
}
export function updateToPendingProducts (pendingState) {
  const newNoMutation = [...pendingState]
  return {
    type: 'UPDATE_TO_PENDING_PRODUCTS',
    payload: newNoMutation
  }
}

// CALENDAR ---------------------

export function addEvent (pendingState, newElement) {
  const newNoMutation = [newElement, ...pendingState]
  return {
    type: 'ADD_EVENT',
    payload: newNoMutation
  }
}

export function addCalendarEvents (pendingState) {
  var newNoMutation = []
  if (pendingState) {
    newNoMutation = [...pendingState]
  }
  return {
    type: 'ADD_CALENDAR_EVENTS',
    payload: newNoMutation
  }
}

// EQ RENT

export function addEqRent (pendingState, newElement) {
  const newNoMutation = [newElement, ...pendingState]
  return {
    type: 'ADD_RENT',
    payload: newNoMutation
  }
}

export function addEqRentArray (pendingState) {
  var newNoMutation = []
  if (pendingState) {
    newNoMutation = [...pendingState]
  }
  return {
    type: 'ADD_RENT_ARRAY',
    payload: newNoMutation
  }
}

export function updateStorageArray (newArray) {
  var newNoMutation = []
  if (newArray) {
    newNoMutation = [...newArray]
  }
  return {
    type: 'UPDATE_STORAGE_ARRAY',
    payload: newNoMutation
  }
}

export function updateServiceItemArray (newArray) {
  var newNoMutation = []
  if (newArray) {
    newNoMutation = [...newArray]
  }
  return {
    type: 'UPDATE_SERVICE_ITEM_ARRAY',
    payload: newNoMutation
  }
}

export function addServiceItem (pendingServices, newService) {
  pendingServices.push(newService)
  return {
    type: 'ADD_SERVICE_ITEM',
    payload: pendingServices
  }
}

export function getStaffArray (newArray) {
  var newNoMutation = []
  if (newArray) {
    newNoMutation = [...newArray]
  }
  return {
    type: 'GET_STAFF_ARRAY',
    payload: newNoMutation
  }
}

export function expandedNav (newArray) {
  var newNoMutation = newArray
  return {
    type: 'EXPANDED_NAV',
    payload: newNoMutation
  }
}
