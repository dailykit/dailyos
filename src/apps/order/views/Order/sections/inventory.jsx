import React from 'react'
import _ from 'lodash'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
   Flex,
   Text,
   Spacer,
   IconButton,
   CloseIcon,
   TextButton,
} from '@dailykit/ui'

import { useConfig } from '../../../context'
import { useOrder } from '../../../context'
import { Styles, StyledProductTitle } from '../styled'

export const Inventories = ({ inventories }) => {
   const { state } = useConfig()
   const [label, setLabel] = React.useState('')
   const { selectInventory } = useOrder()
   const [current, setCurrent] = React.useState({})

   const print = () => {
      if (_.isNull(current?.labelTemplateId)) {
         toast.error('No template assigned!')
         return
      }
      const url = `${process.env.REACT_APP_TEMPLATE_URL}?template={"name":"inventory_product1","type":"label","format":"html"}&data={"id":${current.id}}`

      if (state.print.print_simulation.value.isActive) {
         setLabel(url)
      } else {
         const url = `${
            new URL(process.env.REACT_APP_DATA_HUB_URI).origin
         }/datahub/v1/query`

         const data = {
            id: current.id,
            assemblyStatus: 'COMPLETED',
            labelTemplateId: current.labelTemplateId,
            assemblyStationId: current.assemblyStationId,
            inventoryProductId: current.inventoryProduct.id,
         }
         axios.post(
            url,
            {
               type: 'invoke_event_trigger',
               args: {
                  name: 'printOrderInventoryProductLabel',
                  payload: { new: data },
               },
            },
            {
               headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                  'x-hasura-admin-secret':
                     process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET,
               },
            }
         )
      }
   }

   const selectProduct = product => {
      setLabel('')
      setCurrent(product)
      selectInventory(product.id)
   }

   React.useEffect(() => {
      if (inventories.length > 0) {
         const [product] = inventories
         setCurrent(product)
      }
   }, [inventories])

   if (inventories.length === 0) return <div>No inventories products!</div>
   return (
      <>
         <Styles.Products>
            {inventories.map(inventory => (
               <ProductCard
                  key={inventory.id}
                  inventory={inventory}
                  onClick={() => selectProduct(inventory)}
                  isActive={current?.id === inventory.id}
               />
            ))}
         </Styles.Products>
         <Spacer size="16px" />
         <Flex>
            <TextButton size="sm" type="solid" onClick={print}>
               Print label
            </TextButton>
            <Spacer size="8px" />
            {label && (
               <>
                  <Flex
                     container
                     as="header"
                     width="300px"
                     alignItems="center"
                     justifyContent="space-between"
                  >
                     <Text as="h3">Label Preview</Text>
                     <IconButton
                        size="sm"
                        type="ghost"
                        onClick={() => setLabel('')}
                     >
                        <CloseIcon size={22} />
                     </IconButton>
                  </Flex>
                  <Spacer size="8px" />
                  <iframe src={label} frameBorder="0" title="label preview" />
               </>
            )}
         </Flex>
      </>
   )
}

const productTitle = inventory => {
   let name = ''
   if (inventory?.inventoryProductId) {
      name += inventory?.inventoryProduct?.name
   }
   if (inventory?.comboProductId) {
      name += ` - ${inventory?.comboProduct?.name}`
   }
   if (inventory?.comboProductComponentId) {
      name += ` (${inventory?.comboProductComponent?.label})`
   }
   return name || 'N/A'
}

const ProductCard = ({ onClick, isActive, inventory }) => {
   const quantity =
      inventory.quantity * inventory?.inventoryProductOption?.quantity || 1
   return (
      <Styles.ProductItem isActive={isActive} onClick={onClick}>
         <Flex container alignitems="center" justifyContent="space-between">
            <StyledProductTitle>{productTitle(inventory)}</StyledProductTitle>
            <span>Quantity: {quantity}</span>
         </Flex>
         <Spacer size="14px" />
         <Flex container alignItems="center" justifyContent="space-between">
            <span>
               {inventory.isAssembled ? 1 : 0} /{' '}
               {inventory.assemblyStatus === 'COMPLETED' ? 1 : 0} / 1
            </span>
            <span>{inventory?.inventoryProductOption?.label}</span>
         </Flex>
      </Styles.ProductItem>
   )
}
