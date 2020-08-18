import React from 'react'
import {
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
} from '@dailykit/ui'

import { usePlan } from '../state'
import Customers from './Customers'
import Occurences from './Occurences'
import DeliveryAreas from './DeliveryAreas'
import { DeliveryDaySection } from '../styled'

const DeliveryDay = ({ id }) => {
   const { dispatch } = usePlan()
   const [areasTotal, setAreasTotal] = React.useState(0)
   const [customersTotal, setCustomersTotal] = React.useState(0)
   const [occurencesTotal, setOccurencesTotal] = React.useState(0)

   React.useState(() => {
      dispatch({ type: 'SET_SUBSCRIPTION', payload: { id } })
      return () => {
         dispatch({ type: 'SET_SUBSCRIPTION', payload: { id: null } })
      }
   }, [])

   return (
      <DeliveryDaySection>
         <HorizontalTabs>
            <HorizontalTabList>
               <HorizontalTab>Occurences ({occurencesTotal})</HorizontalTab>
               <HorizontalTab>Delivery Areas ({areasTotal})</HorizontalTab>
               <HorizontalTab>Customers ({customersTotal})</HorizontalTab>
            </HorizontalTabList>
            <HorizontalTabPanels>
               <HorizontalTabPanel>
                  <Occurences id={id} setOccurencesTotal={setOccurencesTotal} />
               </HorizontalTabPanel>
               <HorizontalTabPanel>
                  <DeliveryAreas id={id} setAreasTotal={setAreasTotal} />
               </HorizontalTabPanel>
               <HorizontalTabPanel>
                  <Customers id={id} setCustomersTotal={setCustomersTotal} />
               </HorizontalTabPanel>
            </HorizontalTabPanels>
         </HorizontalTabs>
      </DeliveryDaySection>
   )
}

export default DeliveryDay
