import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Input, Loader } from '@dailykit/ui'
import { toast } from 'react-toastify'

import {
   Spacer,
   TunnelContainer,
   TunnelHeader,
} from '../../../../../components'
import { FlexContainer, StyledSelect } from '../../../styled'
import { PaddedInputGroup } from './styled'
import { UPDATE_PACKAGING } from '../../../../../graphql'

export default function MoreItemInfoTunnel({ close, state }) {
   const [unitQuantity, setUnitQuantity] = useState(state.unitQuantity || '')
   const [unitPrice, setUnitPrice] = useState(state.unitPrice || '')
   const [caseQuantity, setCaseQuantity] = useState(state.caseQuantity || '')
   const [minOrderValue, setMinOrderValue] = useState(state.minOrderValue || '')
   const [leadTime, setLeadTime] = useState(state.leadTime?.value || '')
   const [leadTimeUnit, setLeadTimeUnit] = useState(
      state.leadTime?.unit || 'hours'
   )

   const [updatePackaging, { loading }] = useMutation(UPDATE_PACKAGING, {
      onCompleted: () => {
         close(3)
         toast.info('updated successfully!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error, Please try again')
         close(3)
      },
   })

   const handleNext = () => {
      updatePackaging({
         variables: {
            id: state.id,
            object: {
               unitPrice,
               unitQuantity,
               caseQuantity,
               minOrderValue,
               leadTime: { unit: leadTimeUnit, value: leadTime },
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title="More Item Information"
               next={handleNext}
               close={() => close(3)}
               nextAction="Save"
            />

            <Spacer />

            <PaddedInputGroup>
               <div style={{ width: '70%' }}>
                  <Input
                     type="number"
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
                     type="number"
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
                     type="number"
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
                  type="number"
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
                  type="number"
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
