import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   Loader,
   TunnelHeader,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { TunnelContainer } from '../../../../components'
import {
   STATIONS_SUBSCRIPTION,
   UPDATE_BULK_WORK_ORDER,
} from '../../../../graphql'

const address = 'apps.inventory.views.forms.bulkworkorder.tunnels.'

export default function SelectStationTunnel({ close, state }) {
   const { t } = useTranslation()

   const [search, setSearch] = React.useState('')
   const [data, setData] = React.useState([])

   const [list, current, selectOption] = useSingleList(data)

   const { loading } = useSubscription(STATIONS_SUBSCRIPTION, {
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.stations
         setData(data)
      },
   })

   const [updateBulkWorkOrder] = useMutation(UPDATE_BULK_WORK_ORDER, {
      onError: error => {
         console.log(error)
         toast.error(error.message)
         close(1)
      },
      onCompleted: () => {
         toast.success('User assigned!')
         close(1)
      },
   })

   const handleNext = () => {
      if (!current || !current.id) return toast.error('Please select a user.')

      updateBulkWorkOrder({
         variables: {
            id: state.id,
            object: {
               stationId: current.id,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select station'))}
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem type="SSL1" title={current.name} />
               ) : (
                  <ListSearch
                     onChange={value => setSearch(value)}
                     placeholder={t(
                        address.concat("type what you're looking for")
                     )}
                  />
               )}
               <ListOptions>
                  {list
                     .filter(option =>
                        option.name.toLowerCase().includes(search)
                     )
                     .map(option => (
                        <ListItem
                           type="SSL1"
                           key={option.id}
                           title={option.name}
                           isActive={option.id === current.id}
                           onClick={() => selectOption('id', option.id)}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelContainer>
      </>
   )
}
