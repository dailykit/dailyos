import React from 'react'
import { Text, Checkbox, Input } from '@dailykit/ui'

import { ProductContext } from '../../../../context/product/index'
import { TunnelContainer, TunnelHeader, Spacer } from '../../../../components'

import { useTranslation } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.tunnels.'

export default function AvailabilityTunnel({ close }) {
   const { t } = useTranslation()
   const { productState, productDispatch } = React.useContext(ProductContext)
   const [isPreOrder, setIsPreOrder] = React.useState(
      productState.preOrder.isActive
   )
   const [isRealtime, setIsRealtime] = React.useState(productState.realtime)
   const [days, setDays] = React.useState(productState.preOrder.days)

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat("edit availability"))}
            close={() => {
               close(5)
            }}
            next={() => {
               productDispatch({
                  type: 'SET_AVAILABILITY',
                  payload: {
                     isPreOrder,
                     isRealtime,
                     days: parseInt(days),
                  },
               })
               close(5)
            }}
            nextAction="Save"
         />
         <Spacer />

         <Text as="title">{t(address.concat('available for'))}</Text>

         <br />

         <Checkbox
            id="label"
            checked={isPreOrder}
            onChange={() => setIsPreOrder(!isPreOrder)}
         >
            {t(address.concat('pre-orders'))}
         </Checkbox>

         {isPreOrder && (
            <div
               style={{ width: '30%', display: 'flex', alignItems: 'flex-end' }}
            >
               <Input
                  type="text"
                  placeholder="3"
                  name="days"
                  value={days}
                  onChange={e => setDays(e.target.value)}
               />
               {t(address.concat('days'))}
            </div>
         )}
         <br />
         <hr style={{ border: '1px solid rgb(243, 243, 243)' }} />
         <br />

         <Checkbox
            id="label"
            checked={isRealtime}
            onChange={() => setIsRealtime(!isRealtime)}
         >
            {t(address.concat('realtime'))}
         </Checkbox>
      </TunnelContainer>
   )
}
