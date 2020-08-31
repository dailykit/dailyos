import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Input, Text, Loader, TunnelHeader } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { TunnelContainer } from '../../../../../components'
import { FlexContainer } from '../../../styled'
import { UPDATE_PACKAGING } from '../../../../../graphql'

const address = 'apps.inventory.views.forms.item.tunnels.suppliers.'

export default function ItemInformationTunnel({ close, state, next }) {
   const { t } = useTranslation()

   const [itemName, setItemName] = useState(state.packagingName || '')
   const [itemSku, setItemSku] = useState(state.packagingSku || '')
   const [itemWidth, setItemWidth] = useState(state.width || '')
   const [itemHeight, setItemHeight] = useState(state.height || '')
   const [itemLength, setItemLength] = useState(state.length || '')
   const [itemPar, setItemPar] = useState(state.parLevel || '')
   const [itemMaxValue, setItemMaxValue] = useState(state.maxLevel || '')

   const [updatePackaging, { loading }] = useMutation(UPDATE_PACKAGING, {
      onError: error => {
         console.log(error)
         toast.error('Error! Please try again')
         close(1)
      },
      onCompleted: () => {
         toast.success('Information Added')
         close(1)
         next(2)
      },
   })

   const handleNext = () => {
      updatePackaging({
         variables: {
            id: state.id,
            object: {
               name: itemName,
               packagingSku: itemSku,
               width: +itemWidth,
               height: +itemHeight,
               length: +itemLength,
               parLevel: +itemPar,
               maxLevel: +itemMaxValue,
               LWHUnit: 'mm',
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title="Item Information"
            close={() => close(1)}
            right={{ title: 'Next', action: handleNext }}
         />
         <TunnelContainer>
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

            <Text as="title">Dimensions (in mm)</Text>
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
                  label="length"
                  name="length"
                  value={itemLength}
                  onChange={e => setItemLength(e.target.value)}
               />
               <span style={{ width: '30px' }} />
               <Input
                  type="number"
                  label="height"
                  name="height"
                  value={itemHeight}
                  onChange={e => setItemHeight(e.target.value)}
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
