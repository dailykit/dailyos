import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Input, Text, Loader } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
   Spacer,
   TunnelContainer,
   TunnelHeader,
} from '../../../../../components'
import { FlexContainer } from '../../../styled'
import { UPDATE_PACKAGING } from '../../../../../graphql'

const address = 'apps.inventory.views.forms.item.tunnels.suppliers.'

export default function ItemInformationTunnel({ close, state, next }) {
   const { t } = useTranslation()

   const [itemName, setItemName] = useState(state.name || '')
   const [itemSku, setItemSku] = useState(state.sku || '')
   const [itemWidth, setItemWidth] = useState(state.dimensions?.width || '')
   const [itemHeight, setItemHeight] = useState(state.dimensions?.height || '')
   const [itemDepth, setItemDepth] = useState(state.dimensions?.depth || '')
   const [itemPar, setItemPar] = useState(state.parLevel || '')
   const [itemMaxValue, setItemMaxValue] = useState(state.maxLevel || '')

   const [updatePackaging, { loading }] = useMutation(UPDATE_PACKAGING, {
      onError: error => {
         console.log(error)
         toast.error('Error! Please try again')
      },
      onCompleted: () => {
         toast.success('Information Added')
         close(2)
         next(3)
      },
   })

   const handleNext = () => {
      updatePackaging({
         variables: {
            id: state.id,
            object: {
               name: itemName,
               sku: itemSku,
               dimensions: {
                  width: itemWidth,
                  height: itemHeight,
                  depth: itemDepth,
               },
               parLevel: itemPar,
               maxLevel: itemMaxValue,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title="Item Information"
               next={handleNext}
               close={() => close(2)}
               nextAction="Next"
            />

            <Spacer />

            <FlexContainer style={{ justifyContent: 'space-between' }}>
               <Input
                  type="text"
                  label="Item name"
                  name="itemName"
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
               />

               <span style={{ width: '40px' }} />
               <Input
                  type="text"
                  label="Item SKU"
                  name="itemSKU"
                  value={itemSku}
                  onChange={e => setItemSku(e.target.value)}
               />
            </FlexContainer>
            <br />

            <Text as="title">Dimensions (in cms)</Text>

            <FlexContainer style={{ width: '90%' }}>
               <Input
                  type="number"
                  placeholder="width"
                  name="width"
                  value={itemWidth}
                  onChange={e => {
                     const value = parseInt(e.target.value)
                     if (value) setItemWidth(value)
                     if (!e.target.value.length) setItemWidth('')
                  }}
               />
               <span style={{ width: '30px' }} />
               <Input
                  type="number"
                  placeholder="height"
                  name="height"
                  value={itemHeight}
                  onChange={e => {
                     const value = parseInt(e.target.value)
                     if (value) setItemHeight(value)
                     if (!e.target.value.length) setItemHeight('')
                  }}
               />
               <span style={{ width: '30px' }} />
               <Input
                  type="number"
                  placeholder="depth"
                  name="depth"
                  value={itemDepth}
                  onChange={e => {
                     const value = parseInt(e.target.value)
                     if (value) setItemDepth(value)
                     if (!e.target.value.length) setItemDepth('')
                  }}
               />
            </FlexContainer>

            <br />
            <br />

            <FlexContainer
               style={{ justifyContent: 'space-between', width: '90%' }}
            >
               <Input
                  type="number"
                  placeholder="Set Par Level"
                  name="itemName"
                  value={itemPar}
                  onChange={e => {
                     const value = parseInt(e.target.value)
                     if (value) setItemPar(value)
                     if (!e.target.value.length) setItemPar('')
                  }}
               />

               <span style={{ width: '40px' }} />
               <Input
                  type="number"
                  placeholder="Maximum Inventory Value"
                  name="itemSKU"
                  value={itemMaxValue}
                  onChange={e => {
                     const value = parseInt(e.target.value)
                     if (value) setItemMaxValue(value)
                     if (!e.target.value.length) setItemMaxValue('')
                  }}
               />
            </FlexContainer>
         </TunnelContainer>
      </>
   )
}
