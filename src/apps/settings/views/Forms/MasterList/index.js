import React from 'react'
import { useParams } from 'react-router-dom'

import AccompanimentTypesForm from './AccompanimentTypes'
import CuisineForm from './Cuisine'
import AllergensForm from './Allergens'

const MasterListForm = () => {
   const { list } = useParams()

   switch (list) {
      case 'accompaniment-types': {
         return <AccompanimentTypesForm />
      }
      case 'cuisines': {
         return <CuisineForm />
      }
      case 'allergens': {
         return <AllergensForm />
      }
      default: {
         return <AccompanimentTypesForm />
      }
   }
}

export default MasterListForm
