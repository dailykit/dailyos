import React, { useState, useContext } from 'react'
import { Input, Text } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'

import {
   Spacer,
   TunnelContainer,
   TunnelHeader,
} from '../../../../../components'
import { FlexContainer } from '../../../styled'
import { SachetPackagingContext } from '../../../../../context'

const address = 'apps.inventory.views.forms.item.tunnels.suppliers.'

export default function ItemInformationTunnel({ close, next }) {
   const { t } = useTranslation()
   const { sachetPackagingState, sachetPackagingDispatch } = useContext(
      SachetPackagingContext
   )

   const [itemName, setItemName] = useState(
      sachetPackagingState.info.itemName || ''
   )
   const [itemSku, setItemSku] = useState(
      sachetPackagingState.info.itemSku || ''
   )
   const [itemWidth, setItemWidth] = useState(
      sachetPackagingState.info.itemWidth || ''
   )
   const [itemHeight, setItemHeight] = useState(
      sachetPackagingState.info.itemHeight || ''
   )
   const [itemDepth, setItemDepth] = useState(
      sachetPackagingState.info.itemDepth || ''
   )
   const [itemPar, setItemPar] = useState(
      sachetPackagingState.info.itemPar || ''
   )
   const [itemMaxValue, setItemMaxValue] = useState(
      sachetPackagingState.info.itemMaxValue || ''
   )

   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title="Item Information"
               next={() => {
                  sachetPackagingDispatch({
                     type: 'ADD_ITEM_INFO',
                     payload: {
                        itemName,
                        itemSku,
                        itemWidth,
                        itemHeight,
                        itemDepth,
                        itemPar,
                        itemMaxValue,
                     },
                  })
                  close(2)
                  next(3)
               }}
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
