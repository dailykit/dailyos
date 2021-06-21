const debounce = (func, wait, immediate) => {
   let timeout
   return function () {
      console.log('debounce')
      const context = this,
         args = arguments
      const later = function () {
         timeout = null
         if (!immediate) {
            console.log('calling fun')
            func.apply(context, args)
         }
      }
      let callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func.apply(context, args)
   }
}

export default debounce
