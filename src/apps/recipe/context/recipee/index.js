import React from 'react'

export const RecipeContext = React.createContext()

export const state = {
   newIngredient: undefined,
   edit: undefined,
   serving: undefined,
   sachet: undefined,
   updating: false,
   stage: 0,
   preview: undefined,
   procedureIndex: 0,
   stepIndex: 0,
}

export const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'ADD_INGREDIENT': {
         return {
            ...state,
            newIngredient: payload,
         }
      }
      case 'EDIT_INGREDIENT': {
         return {
            ...state,
            edit: payload,
         }
      }
      case 'SERVING': {
         return {
            ...state,
            serving: payload,
         }
      }
      case 'SACHET': {
         return {
            ...state,
            sachet: payload,
         }
      }
      case 'UPDATING': {
         return {
            ...state,
            updating: payload,
         }
      }
      case 'STAGE': {
         return {
            ...state,
            stage: payload,
         }
      }
      case 'PREVIEW': {
         return {
            ...state,
            preview: {
               title: payload.title,
               img: payload.img,
            },
         }
      }
      case 'STEP_PHOTO': {
         return {
            ...state,
            procedureIndex: payload.procedureIndex,
            stepIndex: payload.stepIndex,
         }
      }
      default:
         return state
   }
}
