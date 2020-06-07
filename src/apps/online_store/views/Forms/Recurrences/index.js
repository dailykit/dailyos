import React from 'react'
import { Loader, Text } from '@dailykit/ui'

import { RECURRENCES } from '../../../graphql'
import { useSubscription } from '@apollo/react-hooks'

import SideNav from './SideNav'
import Main from './Main'

const RecurrencesForm = () => {
   const [recurrences, setRecurrences] = React.useState(undefined)

   const { loading, error } = useSubscription(RECURRENCES, {
      variables: {
         time: 'PRE ORDER',
         type: 'DELIVERY',
      },
      onSubscriptionData: data => {
         console.log(data)
         setRecurrences(data.subscriptionData.data.recurrences)
      },
   })

   if (loading) return <Loader />

   if (error) return <Text as="p">Some error occured!</Text>

   return (
      <>
         <SideNav recurrences={recurrences} />
         <Main recurrences={recurrences} />
      </>
   )
}

export default RecurrencesForm
