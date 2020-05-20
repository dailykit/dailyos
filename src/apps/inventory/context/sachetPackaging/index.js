import React from 'react'

const SachetPackagingContext = React.createContext()

const state = {}

const reducers = (state, { type, payload }) => {
   switch (type) {
      default:
         return state
   }
}

export { SachetPackagingContext, state, reducers }
