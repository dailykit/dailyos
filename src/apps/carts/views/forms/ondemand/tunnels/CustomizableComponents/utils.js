export const getCartItemWithModifiers = (
   cartItemInput,
   selectedModifiersInput,
   type
) => {
   const finalCartItem = { ...cartItemInput }

   const combinedModifiers = selectedModifiersInput.reduce(
      (acc, obj) => [...acc, ...obj.data],
      []
   )

   if (type === 'combo') {
      const dataArr = finalCartItem?.childs?.data
      const dataArrLength = dataArr.length

      if (dataArrLength === 0) {
         finalCartItem.childs.data = combinedModifiers
         return finalCartItem
      } else {
         for (let i = 0; i < dataArrLength; i++) {
            const objWithModifiers = {
               ...dataArr[i],
               childs: {
                  data: combinedModifiers,
               },
            }
            finalCartItem.childs.data[i] = objWithModifiers
         }
         return finalCartItem
      }
   } else {
      const dataArr = finalCartItem?.childs?.data[0]?.childs?.data
      const dataArrLength = dataArr.length

      if (dataArrLength === 0) {
         finalCartItem.childs.data[0].childs.data = combinedModifiers
         return finalCartItem
      } else {
         for (let i = 0; i < dataArrLength; i++) {
            const objWithModifiers = {
               ...dataArr[i],
               childs: {
                  data: combinedModifiers,
               },
            }
            finalCartItem.childs.data[0].childs.data[i] = objWithModifiers
         }
         return finalCartItem
      }
   }
}
