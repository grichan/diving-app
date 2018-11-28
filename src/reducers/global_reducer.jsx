
export default function (
  state = {
    dashboard: false,
    rentail: false,
    calendar: false,
    equipment: false,
    service: false,
    staff: false,
    refill: false

  }, action
) {
  switch (action.type) {
    case 'EXPANDED_NAV':
      return action.payload
    default:
      return state
  }
}
