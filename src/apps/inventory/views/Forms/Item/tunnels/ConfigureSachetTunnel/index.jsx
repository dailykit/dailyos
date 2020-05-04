import React, { useState, useContext } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Input } from '@dailykit/ui'

import { ItemContext } from '../../../../../context/item'

import {
   TunnelContainer,
   TunnelHeader,
   Spacer,
} from '../../../../../components'
import { FlexContainer } from '../../../styled'
import { CREATE_SACHET_ITEM } from '../../../../../graphql'

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.views.forms.item.tunnels.configuresachettunnel.'

export default function ConfigureSachetTunnel({ open, close }) {
   const { t } = useTranslation()
   const { state, dispatch } = useContext(ItemContext)

   const [quantity, setQuantity] = useState('')
   const [par, setPar] = useState('')
   const [maxInventoryLevel, setMaxInventoryLevel] = useState('')

   const [creatSachetItem] = useMutation(CREATE_SACHET_ITEM)

   const handleNext = async () => {
      const res = await creatSachetItem({
         variables: {
            unitSize: quantity,
            bulkItemId: state.activeProcessing.id,
            unit: state.unit_quantity.unit,
         },
      })

      if (res?.data?.createSachetItem?.returning[0]?.id) {
         dispatch({
            type: 'CONFIGURE_NEW_SACHET',
            payload: {
               id: res?.data?.createSachetItem?.returning[0]?.id,
               quantity,
               par,
               maxInventoryLevel,
            },
         })
         close(9)
      }
   }

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat("add sachet"))}
            next={handleNext}
            close={() => close(9)}
            nextAction="Save"
         />

         <Spacer />

         <br />

         <div style={{ width: '30%' }}>
            <Input
               type="text"
               name="quantity"
               value={quantity}
               placeholder={`Sachet Qty (in ${state.unit_quantity.unit})`}
               onChange={e => {
                  const value = parseInt(e.target.value)
                  if (e.target.value.length === 0) setQuantity('')
                  if (value) setQuantity(value)
               }}
            />
         </div>

         <br />

         <FlexContainer
            style={{
               justifyContent: 'space-between',
            }}
         >
            <FlexContainer style={{ alignItems: 'flex-end', width: '45%' }}>
               <Input
                  type="text"
                  name="par"
                  value={par}
                  placeholder={t(address.concat("set par level"))}
                  onChange={e => {
                     const value = parseInt(e.target.value)
                     if (e.target.value.length === 0) setPar('')
                     if (value) setPar(value)
                  }}
               />
               <span style={{ marginLeft: '5px' }}>{t(address.concat('pkt'))}</span>
            </FlexContainer>

            <FlexContainer style={{ alignItems: 'flex-end', width: '45%' }}>
               <Input
                  type="text"
                  name="inventory level"
                  value={maxInventoryLevel}
                  placeholder={t(address.concat("max inventory level"))}
                  onChange={e => {
                     const value = parseInt(e.target.value)
                     if (e.target.value.length === 0) setMaxInventoryLevel('')
                     if (value) setMaxInventoryLevel(value)
                  }}
               />
               <span style={{ marginLeft: '5px' }}>{t(address.concat('pkt'))}</span>
            </FlexContainer>
         </FlexContainer>
      </TunnelContainer>
   )
}
