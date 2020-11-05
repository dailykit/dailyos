import { useMutation } from '@apollo/react-hooks'
import { Flex, Form, Spacer, Text, TunnelHeader } from '@dailykit/ui'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { InlineLoader } from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import { TunnelContainer } from '../../../../../components'
import { GENERAL_ERROR_MESSAGE } from '../../../../../constants/errorMessages'
import { useTabs } from '../../../../../context'
import { UPDATE_PACKAGING } from '../../../../../graphql'
import { StyledInputGroup } from '../../../Item/tunnels/styled'

export default function ItemInformationTunnel({ close, state, next }) {
   const { setTabTitle } = useTabs()

   const [itemName, setItemName] = useState(state.packagingName || '')
   const [itemSku, setItemSku] = useState(state.packagingSku || '')
   const [itemWidth, setItemWidth] = useState(state.width || '')
   const [itemHeight, setItemHeight] = useState(state.height || '')
   const [itemLength, setItemLength] = useState(state.length || '')
   const [itemPar, setItemPar] = useState(state.parLevel || '')
   const [itemMaxValue, setItemMaxValue] = useState(state.maxLevel || '')

   const [updatePackaging, { loading }] = useMutation(UPDATE_PACKAGING, {
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
         close(1)
      },
      onCompleted: () => {
         toast.success('Information Added')
         setTabTitle(itemName)
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

   if (loading) return <InlineLoader />

   return (
      <>
         <TunnelHeader
            title="Item Information"
            close={() => close(1)}
            right={{ title: 'Next', action: handleNext }}
         />
         <TunnelContainer>
            <StyledInputGroup>
               <Form.Group>
                  <Form.Label htmlFor="packagingName" title="packagingName">
                     Item name
                  </Form.Label>
                  <Form.Text
                     id="packagingName"
                     placeholder="Item name"
                     name="packagingName"
                     value={itemName}
                     onChange={e => setItemName(e.target.value)}
                  />
               </Form.Group>
               <Form.Group>
                  <Form.Label htmlFor="itemSKU" title="itemSKU">
                     Item SKU
                  </Form.Label>
                  <Form.Text
                     id="itemSKU"
                     placeholder="Item SKU"
                     name="itemSKU"
                     value={itemSku}
                     onChange={e => setItemSku(e.target.value)}
                  />
               </Form.Group>
            </StyledInputGroup>

            <Spacer size="16px" />

            <Text as="title">Dimensions (in mm)</Text>
            <Flex
               style={{
                  display: 'grid',
                  columnGap: '32px',
                  gridTemplateColumns: 'repeat(3, 1fr)',
               }}
            >
               <Form.Group>
                  <Form.Label htmlFor="width" title="width">
                     width
                  </Form.Label>
                  <Form.Number
                     id="width"
                     placeholder="width"
                     name="width"
                     value={itemWidth}
                     onChange={e => setItemWidth(e.target.value)}
                  />
               </Form.Group>
               <Form.Group>
                  <Form.Label htmlFor="length" title="length">
                     length
                  </Form.Label>
                  <Form.Number
                     id="length"
                     placeholder="length"
                     name="length"
                     value={itemLength}
                     onChange={e => setItemLength(e.target.value)}
                  />
               </Form.Group>
               <Form.Group>
                  <Form.Label htmlFor="height" title="height">
                     height
                  </Form.Label>
                  <Form.Number
                     id="height"
                     placeholder="height"
                     name="height"
                     value={itemHeight}
                     onChange={e => setItemHeight(e.target.value)}
                  />
               </Form.Group>
            </Flex>

            <Spacer size="16px" />

            <StyledInputGroup>
               <Form.Group>
                  <Form.Label htmlFor="par" title="par">
                     Set Par Level
                  </Form.Label>
                  <Form.Number
                     id="par"
                     placeholder="Set Par Level"
                     name="par"
                     value={itemPar}
                     onChange={e => setItemPar(e.target.value)}
                  />
               </Form.Group>
               <Form.Group>
                  <Form.Label htmlFor="maxLevel" title="maxLevel">
                     Maximum Inventory Value
                  </Form.Label>
                  <Form.Number
                     id="maxLevel"
                     placeholder="Maximum Inventory Value"
                     name="maxLevel"
                     value={itemMaxValue}
                     onChange={e => setItemMaxValue(e.target.value)}
                  />
               </Form.Group>
            </StyledInputGroup>
         </TunnelContainer>
      </>
   )
}
