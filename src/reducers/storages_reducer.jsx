
export default function (state = [], action) {
  switch (action.type) {
    case 'UPDATE_STORAGE_ARRAY':
      return action.payload
    case 'ADD_STORAGE':
      return action.payload
    default:
      return state
  }
}
