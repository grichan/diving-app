
export default function (state = [], action) {
  switch (action.type) {
    case 'ADD_TO_PENDING_SERVICES':
      return action.payload
    case 'UPDATE_TO_PENDING_SERVICES':
      return action.payload
    default:
      return state
  }
}
