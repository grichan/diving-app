export default function (state = [], action) {
  switch (action.type) {
    case 'ADD_CALENDAR_EVENTS':
      return action.payload
    case 'ADD_EVENT':
      return action.payload
    default:
      return state
  }
}
