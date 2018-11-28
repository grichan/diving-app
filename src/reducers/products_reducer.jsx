
export default function (state = [], action) {
  switch (action.type) {
    case 'PRODUCTS_LIST':
      return action.payload
    case 'ADD_PRODUCT':
      return action.payload
    case 'ADD_PRODUCTS_ARRAY':
      return action.payload
    default:
      return state
  }
}
