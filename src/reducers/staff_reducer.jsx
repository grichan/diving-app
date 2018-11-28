
export default function (state = [], action) {
  switch (action.type) {
    case 'GET_STAFF_ARRAY':
      return action.payload
    default:
      return state
  }
}
