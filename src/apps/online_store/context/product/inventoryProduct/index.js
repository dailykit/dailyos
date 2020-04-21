import React from 'react'

export const InventoryProductContext = React.createContext()

export const state = {
   id: '',
   description: '',
   realtime: true,
   preOrder: {
      isActive: false,
      days: 0
   },
   tags: [],
   items: [{ id: 1, label: '', inventoryItems: [], accompaniments: [] }],
   itemView: {},
   activeAccomp: {},
   currentInventoryItem: {},
   activeProduct: {},
   pricingConfigFor: ''
}

export const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_PRODUCT_META':
         return {
            ...state,
            description: payload.description,
            tags: payload.tags
         }

      case 'SET_AVAILABILITY':
         const { isRealtime: realtime, isPreOrder: isActive, days } = payload
         return { ...state, realtime, preOrder: { isActive, days } }

      case 'REFINE_ITEMS':
         if (state.items.length === 1) return state
         if (state.items[state.items.length - 1].label.length === 0) {
            const newItems = [...state.items]
            newItems.pop()
            return { ...state, items: newItems }
         }
         return state
      case 'ADD_PRODUCT_ITEM':
         return {
            ...state,
            items: [
               ...state.items,
               { id: state.items.length + 1, label: '', recipes: [] }
            ]
         }
      case 'SET_PRODUCT_ITEM':
         const newItems = [...state.items]

         newItems[payload.index].label = payload.label
         return {
            ...state,
            items: newItems
         }

      case 'SET_ITEM_VIEW':
         return { ...state, itemView: payload }

      case 'SET_CURRENT_INVENTORY_ITEM':
         return { ...state, currentInventoryItem: payload }

      case 'SELECT_INVENTORY_ITEMS':
         const newItemsWithRecipes = [...state.items]
         newItemsWithRecipes.find(
            item => item.id === state.itemView.id
         ).inventoryItems = payload.map(item => ({ ...item, variants: [] }))
         return { ...state, items: newItemsWithRecipes }

      case 'ACTIVATE_SERVING':
         //console.log(payload, state.itemView, state.currentRecipe)
         // return new items list with the currentItem changed.
         // change currentItem->recipes[currentRecipe]-> MEAL_KIT | READY_TO_EAT -> {size: serving, price, discountedPrice}

         const newItemsArray = [...state.items]

         const indexOfcurrentItem = newItemsArray.findIndex(
            item => item.id === state.itemView.id
         )
         const indexOfCurrentRecipe = state.itemView.recipes.findIndex(
            recipe => recipe.id === state.currentRecipe.id
         )

         const pricingObject = {}

         state.pricingConfigFor === 'MEAL_KIT'
            ? (pricingObject.mealKit = payload)
            : (pricingObject.readyToEat = payload)

         newItemsArray[indexOfcurrentItem].recipes[indexOfCurrentRecipe] = {
            ...state.currentRecipe,
            ...pricingObject
         }

         return {
            ...state,
            items: newItemsArray,
            currentRecipe: { ...state.currentRecipe, ...pricingObject }
         }

      case 'ADD_PRODUCT_VARIANT':
         const newItemsWithVariants = [...state.items]
         newItemsWithVariants
            .find(item => item.id === state.itemView.id)
            .inventoryItems.find(
               item => item.id === state.currentInventoryItem.id
            ).variants = [
            ...state.currentInventoryItem.variants,
            { name: '', quantity: '', price: '', discount: '' }
         ]

         return { ...state, items: newItemsWithVariants }

      case 'SET_VARIANT':
         const newItemsWithConfiguredVariants = [...state.items]
         newItemsWithConfiguredVariants
            .find(item => item.id === state.itemView.id)
            .inventoryItems.find(
               item => item.id === state.currentInventoryItem.id
            ).variants[payload.index][payload.field] = payload.value || ''
         return { ...state, items: newItemsWithConfiguredVariants }
      default:
         return state
   }
}
