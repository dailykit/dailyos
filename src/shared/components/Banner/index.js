import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { webRenderer } from '@dailykit/web-renderer'
import { GET_BANNER } from '../../graphql'
import { formatWebRendererData } from '../../utils'

const Banner = ({ id }) => {
   useSubscription(GET_BANNER, {
      variables: { id },
      onSubscriptionData: async ({
         subscriptionData: { data: { ux_dailyosDivId = [] } = {} } = {},
      } = {}) => {
         const result = await formatWebRendererData(ux_dailyosDivId)
         if (result.length) {
            webRenderer({
               type: 'file',
               config: {
                  uri: process.env.REACT_APP_DATA_HUB_URI,
                  adminSecret:
                     process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET,
                  expressUrl: process.env.REACT_APP_EXPRESS_URL,
               },
               fileDetails: result,
            })
         }
      },
   })

   return <div id={id} className={`${id}`} />
}

export default Banner
