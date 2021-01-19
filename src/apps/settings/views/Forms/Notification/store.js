export const initialState = {


    email: {
       value: '',
       meta: {
          errors: [],
          isValid: false,
          isTouched: false,
       },
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
       case 'SET_ERRORS':
          return {
             ...state,
             [payload.field]: {
                ...state[payload.field],
                meta: payload.value,
             },
          }
       default:
          return state
    }
 }
 