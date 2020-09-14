import React from 'react'
import _ from 'lodash'
import axios from 'axios'
import { toast } from 'react-toastify'
import { IconButton, CloseIcon } from '@dailykit/ui'

import { useConfig } from '../../../context'
import { useOrder } from '../../../context'
import { UserIcon } from '../../../assets/icons'
import { Flex } from '../../../../../shared/components'
import { StyledButton, StyledLabelPreview } from './styled'
import {
   OrderItem,
   OrderItems,
   StyledServings,
   StyledProductTitle,
} from '../styled'

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
         <OrderItems>
            {inventories.map(inventory => (
               <OrderItem
                  key={inventory.id}
                  isActive={current?.id === inventory.id}
                  onClick={() => selectProduct(inventory)}
               >
                  <Flex
                     container
                     alignitems="center"
                     justifyContent="space-between"
                  >
                     <StyledProductTitle>
                        {inventory?.inventoryProduct?.name}
                        {inventory?.comboProduct?.name}
                        &nbsp;
                        {inventory?.comboProductComponent?.label &&
                           `(${inventory?.comboProductComponent?.label})`}
                     </StyledProductTitle>
                     <span>Quantity: {inventory.quantity}</span>
                  </Flex>
                  <section>
                     <span>
                        {inventory.isAssembled ? 1 : 0} /{' '}
                        {inventory.assemblyStatus === 'COMPLETED' ? 1 : 0} / 1
                     </span>
                     <StyledServings>
                        <span>
                           <UserIcon size={16} color="#555B6E" />
                        </span>
                        <span>
                           {inventory?.inventoryProductOption?.quantity}
                           &nbsp;-&nbsp;
                           {inventory?.inventoryProductOption?.label}
                        </span>
                     </StyledServings>
                  </section>
               </OrderItem>
            ))}
         </OrderItems>
         <Flex>
            <StyledButton type="button" onClick={() => print()}>
               Print label
            </StyledButton>
            {label && (
               <StyledLabelPreview>
                  <header>
                     <h3>Label Preview</h3>

                     <IconButton type="ghost" onClick={() => setLabel('')}>
                        <CloseIcon />
                     </IconButton>
                  </header>
                  <div>
                     <iframe
                        src={label}
                        frameBorder="0"
                        title="label preview"
                     />
                  </div>
               </StyledLabelPreview>
            )}
         </Flex>
      </>
   )
}
