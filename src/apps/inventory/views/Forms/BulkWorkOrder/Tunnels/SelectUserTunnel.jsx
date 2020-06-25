import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   Loader,
   TunnelHeader,
} from '@dailykit/ui'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'

import { TunnelContainer } from '../../../../components'
import { BulkOrderContext } from '../../../../context/bulkOrder'
import { SETTINGS_USERS_SUBSCRIPTION } from '../../../../graphql'

const address = 'apps.inventory.views.forms.bulkworkorder.tunnels.'

export default function SelectUserTunnel({ close }) {
   const { t } = useTranslation()
   const { bulkOrderDispatch } = useContext(BulkOrderContext)

   const [data, setData] = React.useState([])

   const [search, setSearch] = React.useState('')
   const [list, current, selectOption] = useSingleList(data)

   const { loading } = useSubscription(SETTINGS_USERS_SUBSCRIPTION, {
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.settings_user
         setData(data)
      },
   })

   const handleNext = () => {
      bulkOrderDispatch({ type: 'SELECT_USER', payload: current })
      close(1)
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select user'))}
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
