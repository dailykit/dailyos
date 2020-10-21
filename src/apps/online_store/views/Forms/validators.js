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
   price: value => {
      let isValid = true
      let errors = []
      if (!value) {
         isValid = false
         errors = [...errors, 'Cannot be empty!']
      }
      if (+value <= 0) {
         isValid = false
         errors = [...errors, 'Should be greater than 0!']
      }
      return { isValid, errors }
   },
   time: value => {
      let isValid = true
      let errors = []
      if (!value) {
         isValid = false
         errors = [...errors, 'Invalid time!']
      }
      return { isValid, errors }
   },
}

export default validator
