import React, { useState, useContext } from 'react'
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
import { SachetPackagingContext } from '../../../../../context'
import { CREATE_PACKAGING, UPDATE_PACKAGING } from '../../../../../graphql'

export default function MoreItemInfoTunnel({ close }) {
   const { sachetPackagingState, sachetPackagingDispatch } = useContext(
      SachetPackagingContext
   )

   const [unitQuantity, setUnitQuantity] = useState(
      sachetPackagingState.info.unitQuantity || ''
   )
   const [unitPrice, setUnitPrice] = useState(
      sachetPackagingState.info.unitPrice || ''
   )
   const [caseQuantity, setCaseQuantity] = useState(
      sachetPackagingState.info.caseQuantity || ''
   )
   const [minOrderValue, setMinOrderValue] = useState(
      sachetPackagingState.info.minOrderValue || ''
   )
   const [leadTime, setLeadTime] = useState(
      sachetPackagingState.info.leadTime || ''
   )
   const [leadTimeUnit, setLeadTimeUnit] = useState(
      sachetPackagingState.info.leadTimeUnit || 'hours'
   )

   const [loading, setLoading] = useState(false)

   const [createPackaging] = useMutation(CREATE_PACKAGING)
   const [updatePackaging] = useMutation(UPDATE_PACKAGING)

   const handleNext = async () => {
      try {
         if (sachetPackagingState.id) {
            // update the item info
            setLoading(true)
            const resp = await updatePackaging({
               variables: {
                  id: sachetPackagingState.id,
                  object: {
                     supplierId: sachetPackagingState.supplier.id,
                     name: sachetPackagingState.info.itemName,
                     sku: sachetPackagingState.info.itemSku,
                     dimensions: {
                        width: sachetPackagingState.info.itemWidth,
                        height: sachetPackagingState.info.itemHeight,
                        depth: sachetPackagingState.info.itemDepth,
                     },
                     parLevel: sachetPackagingState.info.itemPar,
                     maxLevel: sachetPackagingState.info.itemMaxValue,
                     unitPrice,
                     unitQuantity,
                     caseQuantity,
                     minOrderValue,
                     leadTime: { unit: leadTimeUnit, value: leadTime },
                  },
               },
            })

            if (resp?.data?.updatePackaging) {
               // success
               setLoading(false)
               close(3)
               return toast.info('updated successfully!')
            }
         }

         setLoading(true)

         const resp = await createPackaging({
            variables: {
               object: {
                  onHand: 0,
                  supplierId: sachetPackagingState.supplier.id,
                  name: sachetPackagingState.info.itemName,
                  sku: sachetPackagingState.info.itemSku,
                  dimensions: {
                     width: sachetPackagingState.info.itemWidth,
                     height: sachetPackagingState.info.itemHeight,
                     depth: sachetPackagingState.info.itemDepth,
                  },
                  parLevel: sachetPackagingState.info.itemPar,
                  maxLevel: sachetPackagingState.info.itemMaxValue,
                  unitPrice,
                  unitQuantity,
                  caseQuantity,
                  minOrderValue,
                  type: sachetPackagingState.type,
                  leadTime: { unit: leadTimeUnit, value: leadTime },
               },
            },
         })

         if (resp?.data?.createPackaging) {
            // success
            setLoading(false)
            toast.success('Packaging Created :)')
            sachetPackagingDispatch({
               type: 'ADD_ID',
               payload: resp.data.createPackaging.returning[0].id,
            })
            close(3)
         }
      } catch (error) {
         setLoading(false)
         toast.error('Err! I messed something up :(')
         close(3)
      }
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title="Item Information"
               next={handleNext}
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
