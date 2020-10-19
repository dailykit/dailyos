const validator = {
   name: value => {
      const text = value.trim()
      let isValid = true
      let errors = []
      if (text.length < 1) {
         isValid = false
         errors = [...errors, 'Cannot be empty!']
      }
      return { isValid, errors }
   },
   quantity: value => {
      let isValid = true
      let errors = []
      if (value <= 0) {
         isValid = false
         errors = [...errors, 'Invalid quantity!']
      }
      return { isValid, errors }
   },
   price: value => {
      let isValid = true
      let errors = []
      if (value <= 0) {
         isValid = false
         errors = [...errors, 'Invalid input!']
      }
      return { isValid, errors }
   },
   csv: value => {
      const words = value.trim().split(',')
      let isValid = true
      let errors = []
      const hasDirtyValues = words.some(word => !word)
      if (words.length > 1 && hasDirtyValues) {
         isValid = false
         errors = [...errors, 'Invalid input!']
      }
      return { isValid, errors }
   },
}

export default validator
