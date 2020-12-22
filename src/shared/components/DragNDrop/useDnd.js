
export const useDnd = () => {
   const initiatePriority = data => {
      let item = []
      if (data.length === 1 && data[0].priority === null) {
         item = data
         item[0].priority = 1000000
      }
      if (data.length > 1) {
         const nullPriorityData = data.filter(d => d.priority === null)
         if (nullPriorityData.length === 1) {
            item = nullPriorityData
            item[0].priority = 0
         }
         if (nullPriorityData.length > 1) {
            item = nullPriorityData
            if (nullPriorityData.length === data.length) {
               for (let i in nullPriorityData) {
                  if (i === nullPriorityData.length - 1) {
                     item[i].priority = 0
                     break
                  } else {
                     item[i].priority = 1000000 / Math.pow(2, i)
                     item[nullPriorityData.length - 1].priority = 0
                  }
               }
            } else {
               for (let i in nullPriorityData) {
                  const lastItemPriority =
                     data[data.length - nullPriorityData.length - 1].priority
                     if(lastItemPriority === 0){
                        data[data.length - nullPriorityData.length - 1].priority =
                     }
                  if (i === nullPriorityData.length - 1) {
                     item[i].priority = 0
                     break
                  } else {
                     item[i].priority = lastItemPriority / Math.pow(2, i)
                     item[nullPriorityData.length - 1].priority = 0
                  }
               }
            }
         }
         return item
      }
   }

   return { initiatePriority }
}
