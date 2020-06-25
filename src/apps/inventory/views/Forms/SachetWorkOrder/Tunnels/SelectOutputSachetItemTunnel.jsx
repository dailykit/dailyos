import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   Loader,
   TunnelHeader,
} from '@dailykit/ui'
import React, { useContext, useState } from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'

import { TunnelContainer } from '../../../../components'
import { SachetOrderContext } from '../../../../context/sachetOrder'
import { SACHET_ITEMS_SUBSCRIPTION } from '../../../../graphql'

const address = 'apps.inventory.views.forms.sachetworkorder.tunnels.'

export default function SelectOutputSachetItemTunnel({ close }) {
   const { t } = useTranslation()
   const { sachetOrderState, sachetOrderDispatch } = useContext(
      SachetOrderContext
   )
   const [search, setSearch] = useState('')
   const [data, setData] = useState([])

   const [list, current, selectOption] = useSingleList(data)

   const { loading } = useSubscription(SACHET_ITEMS_SUBSCRIPTION, {
      variables: { bulkItemId: sachetOrderState.inputItemProcessing?.id },
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.sachetItems
         setData(data)
      },
   })

   const handleNext = () => {
      sachetOrderDispatch({
         type: 'ADD_OUTPUT_SACHET',
         payload: current,
      })
      close(1)
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select output bulk sachet'))}
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem
                     type="SSL2"
                     content={{
                        title: `${current.unitSize} ${current.unit}`,
                        description: `onHand: ${current.onHand} |  Par: ${current.parLevel}`,
                     }}
                  />
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
                        option.unitSize
                           .toString()
                           .toLowerCase()
                           .includes(search)
                     )
                     .map(option => (
                        <ListItem
                           type="SSL2"
                           key={option.id}
                           isActive={option.id === current.id}
                           onClick={() => selectOption('id', option.id)}
                           content={{
                              title: `${option.unitSize} ${option.unit}`,
                              description: `onHand: ${option.onHand} |  Par: ${option.parLevel}`,
                           }}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelContainer>
      </>
   )
}
