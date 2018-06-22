
export default function (state = [], action) {
  switch (action.type) {
    case 'SERVICES_LIST':
      return action.payload
    case 'ADD_SERVICE':
      return action.payload
    case 'ADD_SERVICES_ARRAY':
      return action.payload
    default:
      return state
  }
}
