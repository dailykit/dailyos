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
   procedures: [],
   sachetAddMeta: {
      yieldId: null,
      ingredientProcessingRecordId: null,
      ingredientId: null,
      processingId: null,
   },
}

export const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'UPSERT_SACHET': {
         return {
            ...state,
            sachetAddMeta: payload,
         }
      }
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
      case 'ADD_PROCEDURE': {
         return {
            ...state,
            procedures: state.procedures
               ? [...state.procedures, { title: '', steps: [] }]
               : [{ title: '', steps: [] }],
         }
      }
      case 'ADD_STEP': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps.push({
            title: '',
            isVisible: true,
            assets: {
               images: [],
               videos: [],
            },
            description: '',
         })
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'PROCEDURE_TITLE': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].title = payload.value
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'DELETE_PROCEDURE': {
         const updatedProcedures = state.procedures
         updatedProcedures.splice(payload.index, 1)
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'STEP_TITLE': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps[payload.stepIndex].title =
            payload.value
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'STEP_VISIBILITY': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps[
            payload.stepIndex
         ].isVisible = !updatedProcedures[payload.index].steps[
            payload.stepIndex
         ].isVisible
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'STEP_DESCRIPTION': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps[payload.stepIndex].description =
            payload.value
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'DELETE_STEP': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps.splice(payload.stepIndex, 1)
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'ADD_STEP_PHOTO': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps[payload.stepIndex].assets =
            payload.assets
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'REMOVE_STEP_PHOTO': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps[payload.stepIndex].assets = {
            images: [],
            videos: [],
         }
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'SEED_PROCEDURES': {
         return {
            ...state,
            procedures: payload.value,
         }
      }
      default:
         return state
   }
}
