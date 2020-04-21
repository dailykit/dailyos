import React from 'react'

export const ProductContext = React.createContext()

export const state = {
   id: '',
   description: '',
   realtime: true,
   preOrder: {
      isActive: false,
      days: 0
   },
   tags: [],
   items: [{ id: 1, label: '', recipes: [] }],
   itemView: {},
   activeAccomp: {},
   currentRecipe: { accompaniments: [] },
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
      case 'SET_ITEM_VIEW':
         return { ...state, itemView: payload }
      case 'SELECT_RECIPES':
         const pushableRecipes = payload.map(({ id, title, servings }) => ({
            recipe: id,
            title,
            servings: servings.map(({ size }) => size),
            accompaniments: []
         }))
         const newItemsWithRecipes = [...state.items]
         newItemsWithRecipes.find(
            item => item.id === state.itemView.id
         ).recipes = pushableRecipes
         return { ...state, items: newItemsWithRecipes }

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

      case 'SET_CURRENT_RECIPE':
         return { ...state, currentRecipe: payload }

      case 'SET_MEALKIT':
         return { ...state, pricingConfigFor: payload }

      case 'SET_AVAILABILITY':
         const { isRealtime: realtime, isPreOrder: isActive, days } = payload
         return { ...state, realtime, preOrder: { isActive, days } }

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

      case 'ADD_ACCOMPANIMENT_TYPES':
         const newItemsWithAccompTypes = [...state.items]
         const indexOfItems = newItemsWithAccompTypes.findIndex(
            item => item.id === state.itemView.id
         )

         const refinedPayload = payload.map(({ id, title }) => ({
            id,
            title,
            products: []
         }))

         newItemsWithAccompTypes[indexOfItems].recipes[
            newItemsWithAccompTypes[indexOfItems].recipes.findIndex(
               recipe => recipe.recipe === state.currentRecipe.recipe
            )
         ].accompaniments = refinedPayload

         return { ...state, items: newItemsWithAccompTypes }

      case 'SET_ACCOMP_TYPE_VIEW':
         return { ...state, activeAccomp: payload }

      case 'ADD_ACCOMPANIMENTS':
         const newItemsWithAccomps = [...state.items]
         const itemIndex = newItemsWithAccomps.findIndex(
            item => item.id === state.itemView.id
         )

         const newRecipesList = [...newItemsWithAccomps[itemIndex].recipes]
         const currentRecipeIndex = newRecipesList.findIndex(
            recipe => recipe.recipe === state.currentRecipe.recipe
         )

         const currentAccompIndex = newRecipesList[
            currentRecipeIndex
         ].accompaniments.findIndex(
            accomp => accomp.id === state.activeAccomp.id
         )

         const newAccomps = [
            ...newRecipesList[currentRecipeIndex].accompaniments
         ]
         newAccomps[currentAccompIndex].products = payload
         newItemsWithAccomps[itemIndex].recipes[
            currentRecipeIndex
         ].accompaniments = newAccomps

         return { ...state, items: newItemsWithAccomps }

      case 'SET_ACTIVE_PRODUCT':
         return { ...state, activeProduct: payload }

      case 'SET_ACCOMPANIMENT_DISCOUNT':
         const newItemsWithAccompDiscount = [...state.items]
         const index = newItemsWithAccompDiscount.findIndex(
            item => item.id === state.itemView.id
         )

         const newRecipeList = [...newItemsWithAccompDiscount[index].recipes]

         const i = newRecipeList.findIndex(
            recipe => recipe.recipe === state.currentRecipe.recipe
         )

         const freshAccompaimentList = newRecipeList[i].accompaniments

         const accIndex = freshAccompaimentList.findIndex(
            acc => acc.id === state.activeAccomp.id
         )

         const newProductsList = [...freshAccompaimentList[accIndex].products]

         console.log(newProductsList)

         const productIndex = newProductsList.findIndex(
            product => product.id === state.activeProduct.id
         )

         newProductsList[productIndex].discount = parseInt(payload)

         freshAccompaimentList[accIndex].products = newProductsList

         newRecipeList[i].accompaniments = freshAccompaimentList

         newItemsWithAccompDiscount[index].recipes = newRecipeList

         return {
            ...state,
            items: newItemsWithAccompDiscount
         }

      case 'SET_PRODUCT_ID':
         return { ...state, id: payload }

      default:
         return state
   }
}
