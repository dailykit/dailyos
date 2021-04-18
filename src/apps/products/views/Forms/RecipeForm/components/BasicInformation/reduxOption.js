const initialState = {
   type: {
      value: 'Vegetarian',
   },
   cuisine: {
      value: '',
   },
   cookingTime: {
      value: '30',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   },
   author: {
      value: '',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   },
   notIncluded: {
      value: '',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   },
   utensils: {
      value: '',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   },
   description: {
      value: '',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   },
}

const reducer = (state, { type, payload }) => {
   switch (type) {
      case 'SEED': {
         return {
            ...state,
            ...payload.state,
         }
      }
      case 'SET_VALUE': {
         return {
            ...state,
            [payload.field]: {
               ...state[payload.field],
               value: payload.value,
            },
         }
      }
      case 'SET_ERRORS': {
         return {
            ...state,
            [payload.field]: {
               ...state[payload.field],
               meta: payload.meta,
            },
         }
      }
      default:
         return state
   }
}
export { initialState, reducer }
