import React from 'react'
import { useParams } from 'react-router-dom'

import Main from './Main'
import { useTabs } from '../../../context'

const RecurrencesForm = () => {
   const params = useParams()
   const { addTab, tab } = useTabs()

   React.useEffect(() => {
      if (!tab) {
         addTab(
            'Recurrences',
            `/online-store/settings/recurrences/${params.type}`
         )
      }
   }, [tab, addTab])
   return (
      <>
         <Main />
      </>
   )
}

export default RecurrencesForm
