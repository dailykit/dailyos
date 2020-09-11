import React from 'react'
import _ from 'lodash'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { IconButton, CloseIcon } from '@dailykit/ui'

import { useConfig } from '../../../context'
import { useOrder } from '../../../context'
import { UserIcon } from '../../../assets/icons'
import { CREATE_PRINT_JOB } from '../../../graphql'
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
   const { switchView, selectInventory } = useOrder()
   const [current, setCurrent] = React.useState(null)

   const [printLabel] = useMutation(CREATE_PRINT_JOB, {
      onCompleted: () => {
         const product = inventories.find(node => node.id === current)
         toast.success(
            `Label for ${product?.inventoryProduct?.name} has been printed!`
         )
      },
      onError: () => {
         const product = inventories.find(node => node.id === current)
         toast.error(
            `Printing label for ${product?.inventoryProduct?.name} failed!`
         )
      },
   })

   const print = () => {
      if (_.isEmpty(state.stations)) {
         toast.error('No printers available')
         return
      }
      const url = `${process.env.REACT_APP_TEMPLATE_URL}?template={"name":"inventory_product1","type":"label","format":"html"}&data={"id":${current}}`

      if (state.print.print_simulation.value.isActive) {
         setLabel(url)
      } else {
         const product = inventories.find(node => node.id === current)
         printLabel({
            variables: {
               url,
               source: 'DailyOS',
               contentType: 'pdf_uri',
               title: `${product?.inventoryProduct?.name}`,
               printerId: state.stations[0].defaultLabelPrinter.printNodeId,
            },
         })
      }
   }

   const selectProduct = id => {
      setCurrent(id)
      setLabel('')
      const product = inventories.find(node => id === node.id)
      if ('id' in product) {
         selectInventory(product.id)
      } else {
         switchView('SUMMARY')
      }
   }

   React.useEffect(() => {
      if (inventories.length > 0) {
         const [product] = inventories
         setCurrent(product.id)
      }
   }, [inventories])

   if (inventories.length === 0) return <div>No inventories products!</div>
   return (
      <>
         <OrderItems>
            {inventories.map(inventory => (
               <OrderItem
                  key={inventory.id}
                  isActive={current === inventory.id}
                  onClick={() => selectProduct(inventory.id)}
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
                        frameborder="0"
                        title="label preview"
                     />
                  </div>
               </StyledLabelPreview>
            )}
         </Flex>
      </>
   )
}
