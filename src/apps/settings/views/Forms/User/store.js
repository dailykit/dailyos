export const initialState = {
   firstName: {
      value: '',
      error: '',
   },
   lastName: {
      value: '',
      error: '',
   },
   email: {
      value: '',
      error: '',
   },
   phoneNo: {
      value: '',
      error: '',
   },
}

export const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_FIELD':
         return {
            ...state,
            [payload.field]: {
               ...state[payload.field],
               value: payload.value,
            },
         }
      case 'SET_FIELD_ERROR':
         return {
            ...state,
            [payload.field]: {
               ...state[payload.field],
               error: payload,
            },
         }
      case 'CLEAR_FIELD_ERROR':
         return {
            ...state,
            [payload.field]: {
               ...state[payload.field],
               error: '',
            },
         }
      default:
         return state
   }
}
