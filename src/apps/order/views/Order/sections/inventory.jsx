import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { isEmpty, isNull } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'
import {
   Flex,
   Text,
   Spacer,
   Filler,
   IconButton,
   CloseIcon,
   TextButton,
} from '@dailykit/ui'

import { useConfig } from '../../../context'
import ProductModifiers from './modifiers'
import { MUTATIONS } from '../../../graphql'
import ProductDetails from './product_details'
import { logger } from '../../../../../shared/utils'
import { Legend, Styles, Scroll, StyledProductTitle } from '../styled'
import { ErrorState, InlineLoader } from '../../../../../shared/components'

const address = 'apps.order.views.order.'

export const Inventories = ({
   data: { loading, error, inventories },
   hideModifiers,
}) => {
   const { state } = useConfig()
   const { t } = useTranslation()
   const { state: config } = useConfig()
   const [label, setLabel] = React.useState('')
   const [current, setCurrent] = React.useState({})

   const [update] = useMutation(MUTATIONS.ORDER.PRODUCT.INVENTORY.UPDATE, {
      onCompleted: () => {
         toast.success('Successfully updated the product!')
      },
      onError: error => {
         logger(error)
         toast.success('Failed to update the product!')
      },
   })

   React.useEffect(() => {
      if (!loading && !isEmpty(inventories)) {
         const [product] = inventories
         setCurrent(product)
      }
   }, [loading, inventories, setCurrent])

   const print = () => {
      if (isNull(current?.labelTemplateId)) {
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
      setCurrent(product)
      setLabel('')
   }

   if (loading) return <InlineLoader />
   if (error)
      return <ErrorState message="Failed to fetch inventory products!" />
   if (isEmpty(inventories))
      return <Filler message="No inventory products available!" />
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
         <Flex container alignItems="center">
            <TextButton size="sm" type="solid" onClick={print}>
               Print label
            </TextButton>
            <Spacer size="16px" xAxis />
            <TextButton
               size="sm"
               type="solid"
               disabled={current?.assemblyStatus === 'COMPLETED'}
               fallBackMessage={
                  current?.assemblyStationId !== config.current_station?.id
                     ? ''
                     : 'Pending order confirmation!'
               }
               hasAccess={Boolean(
                  current?.order?.isAccepted &&
                     !current?.order?.isRejected &&
                     current?.assemblyStationId === config.current_station?.id
               )}
               onClick={() =>
                  update({
                     variables: {
                        id: current?.id,
                        _set: {
                           assemblyStatus: 'COMPLETED',
                        },
                     },
                  })
               }
            >
               {current?.assemblyStatus === 'COMPLETED'
                  ? 'Packed'
                  : 'Mark Packed'}
            </TextButton>
            <Spacer size="16px" xAxis />
            <TextButton
               size="sm"
               type="solid"
               disabled={
                  current?.isAssembled ||
                  current?.assemblyStatus !== 'COMPLETED'
               }
               fallBackMessage={
                  current?.assemblyStationId !== config.current_station?.id
                     ? ''
                     : 'Pending order confirmation!'
               }
               hasAccess={Boolean(
                  current?.order?.isAccepted &&
                     !current?.order?.isRejected &&
                     current?.assemblyStationId === config.current_station?.id
               )}
               onClick={() =>
                  update({
                     variables: {
                        id: current?.id,
                        _set: {
                           isAssembled: true,
                        },
                     },
                  })
               }
            >
               {current?.isAssembled ? 'Assembled' : 'Mark Assembled'}
            </TextButton>
         </Flex>
         <Spacer size="8px" />
         <Flex>
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
         <Spacer size="24px" />
         <section>
            {!hideModifiers && (
               <>
                  <Scroll.Tabs>
                     <Scroll.Tab
                        className={
                           window.location.hash === '#sachets' ? 'active' : ''
                        }
                     >
                        <a href="#sachets">Sachets</a>
                     </Scroll.Tab>
                     {current?.hasModifiers && (
                        <Scroll.Tab
                           className={
                              window.location.hash === '#modifiers'
                                 ? 'active'
                                 : ''
                           }
                        >
                           <a href="#modifiers">Modifiers</a>
                        </Scroll.Tab>
                     )}
                  </Scroll.Tabs>
                  <Spacer size="16px" />
               </>
            )}
            <section id="sachets">
               <Text as="h2">Sachets</Text>
               <Legend>
                  <h2>{t(address.concat('legends'))}</h2>
                  <section>
                     <span />
                     <span>{t(address.concat('pending'))}</span>
                  </section>
                  <section>
                     <span />
                     <span>{t(address.concat('packed'))}</span>
                  </section>
                  <section>
                     <span />
                     <span>{t(address.concat('assembled'))}</span>
                  </section>
               </Legend>
               {current && <ProductDetails product={current} />}
            </section>
            {!hideModifiers && current?.hasModifiers && (
               <>
                  <Spacer size="32px" />
                  <section id="modifiers">
                     <Text as="h2">Modifiers</Text>
                     <Spacer size="16px" />
                     {current && <ProductModifiers product={current} />}
                  </section>
               </>
            )}
         </section>
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
