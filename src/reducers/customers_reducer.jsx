
export default function (state = [], action) {
  switch (action.type) {
    case 'UPDATE_CUSTOMER_ARRAY':
      return action.payload
    case 'ADD_CUSTOMER':
      return action.payload
    default:
      return state
  }
}
