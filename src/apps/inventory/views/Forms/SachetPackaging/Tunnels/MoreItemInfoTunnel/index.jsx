import React, { useState, useContext } from 'react'
import { Input, Text } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'

import {
   Spacer,
   TunnelContainer,
   TunnelHeader,
} from '../../../../../components'
import { FlexContainer, StyledSelect } from '../../../styled'
import { PaddedInputGroup } from './styled'
import { SachetPackagingContext } from '../../../../../context'

const address = 'apps.inventory.views.forms.item.tunnels.suppliers.'

export default function MoreItemInfoTunnel({ close, next }) {
   const { t } = useTranslation()
   const { sachetPackagingDispatch } = useContext(SachetPackagingContext)

   const [unitQuantity, setUnitQuantity] = useState('')
   const [unitPrice, setUnitPrice] = useState('')
   const [caseQuantity, setCaseQuantity] = useState('')
   const [minOrderValue, setMinOrderValue] = useState('')
   const [leadTime, setLeadTime] = useState('')
   const [leadTimeUnit, setLeadTimeUnit] = useState('hours')

   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title={t(address.concat('select supplier'))}
               next={() => {
                  sachetPackagingDispatch({
                     type: 'ADD_ITEM_INFO',
                     payload: {
                        unitQuantity,
                        unitPrice,
                        caseQuantity,
                        minOrderValue,
                        leadTime,
                     },
                  })
                  close(3)
               }}
               close={() => close(3)}
               nextAction="Next"
            />

            <Spacer />

            <PaddedInputGroup>
               <div style={{ width: '70%' }}>
                  <Input
                     type="text"
                     placeholder="Unit qty (in pieces)"
                     name="unitQty"
                     value={unitQuantity}
                     onChange={e => {
                        const value = parseInt(e.target.value)
                        if (value) setUnitQuantity(value)
                        if (!e.target.value.length) setUnitQuantity('')
                     }}
                  />
               </div>

               <span style={{ width: '40px' }} />
               <FlexContainer style={{ alignItems: 'flex-end' }}>
                  <div style={{ marginRight: '5px', marginBottom: '5px' }}>
                     $
                  </div>
                  <Input
                     type="text"
                     placeholder="Unit Price"
                     name="unitPrice"
                     value={unitPrice}
                     onChange={e => {
                        const value = parseInt(e.target.value)
                        if (value) setUnitPrice(value)
                        if (!e.target.value.length) setUnitPrice('')
                     }}
                  />
               </FlexContainer>
            </PaddedInputGroup>
            <br />

            <PaddedInputGroup>
               <div style={{ width: '70%' }}>
                  <Input
                     type="text"
                     placeholder="Case qty (in pieces)"
                     name="caseQty"
                     value={caseQuantity}
                     onChange={e => {
                        const value = parseInt(e.target.value)
                        if (value) setCaseQuantity(value)
                        if (!e.target.value.length) setCaseQuantity('')
                     }}
                  />
               </div>

               <span style={{ width: '90px' }} />

               <Input
                  type="text"
                  placeholder="Min. value order (in case)"
                  name="unitPrice"
                  value={minOrderValue}
                  onChange={e => {
                     const value = parseInt(e.target.value)
                     if (value) setMinOrderValue(value)
                     if (!e.target.value.length) setMinOrderValue('')
                  }}
               />
            </PaddedInputGroup>

            <br />

            <PaddedInputGroup
               style={{ justifyContent: 'flex-start', width: '40%' }}
            >
               <Input
                  type="text"
                  placeholder="Lead time"
                  name="leadTime"
                  value={leadTime}
                  onChange={e => {
                     const value = parseInt(e.target.value)
                     if (value) setLeadTime(value)
                     if (!e.target.value.length) setLeadTime('')
                  }}
               />

               <StyledSelect
                  name="unit"
                  defaultValue={leadTimeUnit}
                  onChange={e => setLeadTimeUnit(e.target.value)}
               >
                  <option value="days">Days</option>
                  <option value="hours">Hours</option>
               </StyledSelect>
            </PaddedInputGroup>
         </TunnelContainer>
      </>
   )
}
