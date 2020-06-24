import React, { useContext } from 'react'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   Loader,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'

import { ItemContext } from '../../../../../context/item'

import {
   TunnelContainer,
   TunnelHeader,
   Spacer,
} from '../../../../../components'
import { MASTER_PROCESSINGS_SUBSCRIPTION } from '../../../../../graphql'

const address = 'apps.inventory.views.forms.item.tunnels.processing.'

export default function ProcessingTunnel({ close, open, formState }) {
   const { t } = useTranslation()
   const { dispatch } = useContext(ItemContext)
   const [search, setSearch] = React.useState('')
   const [data, setData] = React.useState([])
   const [list, current, selectOption] = useSingleList(data)

   const { loading: processingsLoading } = useSubscription(
      MASTER_PROCESSINGS_SUBSCRIPTION,
      {
         variables: { supplierItemId: formState.id },
         onSubscriptionData: input => {
            const newProcessings =
               input.subscriptionData.data.masterProcessingsAggregate.nodes

            setData(newProcessings)
         },
      }
   )

   if (processingsLoading) return <Loader />

   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title={t(address.concat('select processing as item shipped'))}
               next={() => {
                  dispatch({ type: 'PROCESSING', payload: current })
                  close(1)
                  open(2)
               }}
               close={() => close(1)}
               nextAction="Next"
            />

            <Spacer />

            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem type="SSL1" title={current.title} />
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
                        option.title.toLowerCase().includes(search)
                     )
                     .map(option => (
                        <ListItem
                           type="SSL1"
                           key={option.id}
                           title={option.title}
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
