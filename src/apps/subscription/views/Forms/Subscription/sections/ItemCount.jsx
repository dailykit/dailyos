import React from 'react'
import { RRule } from 'rrule'
import { useSubscription } from '@apollo/react-hooks'
import {
   Text,
   SectionTab,
   SectionTabs,
   SectionTabList,
   SectionTabPanel,
   SectionTabPanels,
   SectionTabsListHeader,
} from '@dailykit/ui'

import { usePlan } from '../state'
import DeliveryDay from './DeliveryDay'
import { Spacer } from '../../../../styled'
import { ITEM_COUNT } from '../../../../graphql'
import { ItemCountHeader, ItemCountSection } from '../styled'
import { InlineLoader } from '../../../../../../shared/components'

const ItemCount = ({ id, isActive }) => {
   const { dispatch } = usePlan()
   const {
      loading,
      data: { itemCount = {} } = {},
   } = useSubscription(ITEM_COUNT, { variables: { id } })

   React.useEffect(() => {
      if (!loading && isActive) {
         dispatch({
            type: 'SET_ITEM',
            payload: {
               id: itemCount.id,
               count: itemCount.count,
               price: itemCount.price,
            },
         })
      }
   }, [loading, isActive])

   if (loading) return <InlineLoader />
   return (
      <>
         <ItemCountHeader>
            <Text as="title">Price per week: {itemCount.price}</Text>
         </ItemCountHeader>
         <Spacer size="16px" />
         <ItemCountSection>
            {itemCount?.subscriptions.length > 0 ? (
               <SectionTabs>
                  <SectionTabList>
                     <SectionTabsListHeader>
                        <Text as="title">Delivery Days</Text>
                     </SectionTabsListHeader>
                     {itemCount?.subscriptions.map(subscription => (
                        <SectionTab key={subscription.id}>
                           <Text as="title">
                              {RRule.fromString(subscription.rrule).toText()}
                           </Text>
                        </SectionTab>
                     ))}
                  </SectionTabList>
                  <SectionTabPanels>
                     {itemCount?.subscriptions.map(subscription => (
                        <SectionTabPanel key={subscription.id}>
                           <DeliveryDay id={subscription.id} />
                        </SectionTabPanel>
                     ))}
                  </SectionTabPanels>
               </SectionTabs>
            ) : (
               'no occurences'
            )}
         </ItemCountSection>
      </>
   )
}

export default ItemCount
