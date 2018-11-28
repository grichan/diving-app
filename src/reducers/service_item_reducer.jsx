
export default function (state = [], action) {
  switch (action.type) {
    case 'UPDATE_SERVICE_ITEM_ARRAY':
      return action.payload
    case 'ADD_SERVICE_ITEM':
      return action.payload
    default:
      return state
  }
}
