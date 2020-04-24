import React from 'react'

export const ItemContext = React.createContext()

export const state = {
   form_meta: {
      shipped: false,
   },
   supplier: '',
   title: '',
   sku: '',
   unit_quantity: {
      value: '',
      unit: '',
   },
   unit_price: {
      unit: '$',
      value: '',
   },
   case_quantity: {
      unit: '',
      value: '',
   },
   min_order_value: {
      unit: '',
      value: '',
   },
   lead_time: {
      unit: '',
      value: '',
   },
   processing: {
      name: '',
      par_level: {
         value: '',
         unit: '',
      },
      max_inventory_level: {
         value: '',
         unit: '',
      },
      labor_time: {
         value: '',
         unit: '',
      },
      yield: '',
      shelf_life: {
         value: '',
         unit: '',
      },
      bulk_density: '',
      allergens: [],
   },
   activeProcessing: {},
   derivedProcessings: [],
   configurable: {},
}

export const reducer = (state, { type, payload }) => {
   switch (type) {
      case 'META': {
         return {
            ...state,
            form_meta: {
               ...state.form_meta,
               [payload.name]: payload.value,
            },
         }
      }
      case 'SUPPLIER': {
         return {
            ...state,
            supplier: payload.supplier,
         }
      }
      case 'TITLE': {
         return {
            ...state,
            title: payload.title,
         }
      }
      case 'SKU': {
         return {
            ...state,
            sku: payload.sku,
         }
      }
      case 'QUANTITY': {
         return {
            ...state,
            unit_quantity: {
               ...state.unit_quantity,
               [payload.name]: payload.value,
            },
         }
      }
      case 'PRICE': {
         return {
            ...state,
            unit_price: {
               ...state.unit_price,
               [payload.name]: payload.value,
            },
         }
      }
      case 'CASE': {
         return {
            ...state,
            case_quantity: {
               ...state.case_quantity,
               [payload.name]: payload.value,
            },
         }
      }
      case 'MIN_ORDER': {
         return {
            ...state,
            min_order_value: {
               ...state.min_order_value,
               [payload.name]: payload.value,
            },
         }
      }
      case 'LEAD_TIME': {
         return {
            ...state,
            lead_time: {
               ...state.lead_time,
               [payload.name]: payload.value,
            },
         }
      }
      case 'PROCESSING': {
         return {
            ...state,
            processing: {
               ...state.processing,
               name: payload.value,
            },
         }
      }
      case 'PAR_LEVEL': {
         return {
            ...state,
            processing: {
               ...state.processing,
               par_level: {
                  ...state.processing.par_level,
                  [payload.name]: payload.value,
               },
            },
         }
      }
      case 'MAX_INVENTORY_LEVEL': {
         return {
            ...state,
            processing: {
               ...state.processing,
               max_inventory_level: {
                  ...state.processing.max_inventory_level,
                  [payload.name]: payload.value,
               },
            },
         }
      }
      case 'LABOR_TIME': {
         return {
            ...state,
            processing: {
               ...state.processing,
               labor_time: {
                  ...state.processing.labor_time,
                  [payload.name]: payload.value,
               },
            },
         }
      }
      case 'YIELD': {
         return {
            ...state,
            processing: {
               ...state.processing,
               yield: payload.value,
            },
         }
      }
      case 'SHELF_LIFE': {
         return {
            ...state,
            processing: {
               ...state.processing,
               shelf_life: {
                  ...state.processing.shelf_life,
                  [payload.name]: payload.value,
               },
            },
         }
      }
      case 'BULK_DENSITY': {
         return {
            ...state,
            processing: {
               ...state.processing,
               bulk_density: payload.value,
            },
         }
      }
      case 'ALLERGENS': {
         return {
            ...state,
            processing: {
               ...state.processing,
               allergens: payload.value,
            },
         }
      }

      case 'SET_ACTIVE_PROCESSING':
         return { ...state, activeProcessing: payload }

      case 'ADD_DERIVED_PROCESSING':
         const newDerivedProcessings = [...state.derivedProcessings]
         const index = newDerivedProcessings.findIndex(
            proc => proc.id === payload.id
         )

         if (index >= 0) {
            newDerivedProcessings.splice(index, 1, payload)
         } else {
            newDerivedProcessings.push(payload)
         }

         return { ...state, derivedProcessings: newDerivedProcessings }

      case 'ADD_CONFIGURABLE_PROCESSING':
         return { ...state, configurable: payload }

      case 'CONFIGURE_DERIVED_PROCESSING':
         const {
            par,
            parUnit,
            maxInventoryLevel,
            maxInventoryUnit,
            laborTime,
            laborUnit,
            yieldPercentage,
            shelfLife,
            shelfLifeUnit,
            bulkDensity,
         } = payload
         const configuredDerivedProcessings = [...state.derivedProcessings]
         const activeConfigurable = configuredDerivedProcessings.findIndex(
            config => config.id === state.configurable.id
         )
         configuredDerivedProcessings.splice(activeConfigurable, 1, {
            ...state.configurable,
            par_level: { unit: parUnit, value: par },
            max_inventory_level: {
               unit: maxInventoryUnit,
               value: maxInventoryLevel,
            },
            labor_time: { unit: laborUnit, value: laborTime },
            yield: yieldPercentage,
            shelf_life: { unit: shelfLifeUnit, value: shelfLife },
            bulk_density: bulkDensity,
         })
         return { ...state, derivedProcessings: configuredDerivedProcessings }

      case 'ADD_ALLERGENS_FOR_DERIVED_PROCESSING':
         return {
            ...state,
            configurable: { ...state.configurable, allergens: payload },
         }
      default:
         return state
   }
}
