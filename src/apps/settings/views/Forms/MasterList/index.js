import React from 'react'
import { useParams } from 'react-router-dom'

import AccompanimentTypesForm from './AccompanimentTypes'

const MasterListForm = () => {
   const { list } = useParams()

   switch (list) {
      case 'accompaniment-types': {
         return <AccompanimentTypesForm />
      }
      default: {
         return <AccompanimentTypesForm />
      }
   }
}

export default MasterListForm
