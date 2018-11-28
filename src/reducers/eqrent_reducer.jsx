export default function (state = [], action) {
  switch (action.type) {
    case 'ADD_RENT':
      return action.payload
    case 'ADD_RENT_ARRAY':
      return action.payload
    default:
      return state
  }
}
