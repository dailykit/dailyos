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
            <br />
            <FlexContainer style={{ width: '90%' }}>
               <Input
                  type="number"
                  label="width"
                  name="width"
                  value={itemWidth}
                  onChange={e => setItemWidth(e.target.value)}
               />
               <span style={{ width: '30px' }} />
               <Input
                  type="number"
                  label="height"
                  name="height"
                  value={itemHeight}
                  onChange={e => setItemHeight(e.target.value)}
               />
               <span style={{ width: '30px' }} />
               <Input
                  type="number"
                  label="depth"
                  name="depth"
                  value={itemDepth}
                  onChange={e => setItemDepth(e.target.value)}
               />
            </FlexContainer>

            <br />
            <br />

            <FlexContainer
               style={{ justifyContent: 'space-between', width: '90%' }}
            >
               <Input
                  type="number"
                  label="Set Par Level"
                  name="itemName"
                  value={itemPar}
                  onChange={e => setItemPar(e.target.value)}
               />

               <span style={{ width: '40px' }} />
               <Input
                  type="number"
                  label="Maximum Inventory Value"
                  name="itemSKU"
                  value={itemMaxValue}
                  onChange={e => setItemMaxValue(e.target.value)}
               />
            </FlexContainer>
         </TunnelContainer>
      </>
   )
}
