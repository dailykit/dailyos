export const formatDate = date => {
   try {
      return new Intl.DateTimeFormat('en-US', {
         minute: 'numeric',
         hour: 'numeric',
         month: 'short',
         day: 'numeric',
         year: 'numeric',
      }).format(new Date(date))
   } catch (error) {
      return error.message
   }
}
