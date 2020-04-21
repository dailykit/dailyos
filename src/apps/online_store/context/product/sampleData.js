export default {
   name: 'Best Product Ever!',
   description: 'Yup, it is the best.',
   realtime: true,
   preOrder: {
      isActive: false,
      days: 0
   },
   items: [
      {
         label: 'item1',
         recipes: [
            {
               recipe: {},
               defaultState: 'MEAL_KIT',
               mealkit: [{ size: 4, price: 24, discount: 20 }]
            }
         ]
      },
      {
         label: 'item2',
         recipes: [
            {
               recipe: {},
               defaultState: 'MEAL_KIT',
               mealkit: [{ size: 4, price: 24, discount: 20 }]
            }
         ]
      }
   ]
}
