import React from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { isEmpty, isNull, stubTrue } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@reach/tabs'
import {
   Flex,
   Text,
   Spacer,
   Filler,
   IconButton,
   CloseIcon,
   TextButton,
} from '@dailykit/ui'

import Sachets from './sachets'
import ProductModifiers from './modifiers'
import { MUTATIONS } from '../../../graphql'
import { findAndSelectSachet } from '../methods'
import { UserIcon } from '../../../assets/icons'
import { logger } from '../../../../../shared/utils'
import { useConfig, useOrder } from '../../../context'
import { useAccess } from '../../../../../shared/providers'
import { Legend, Styles, Scroll, StyledProductTitle } from '../styled'
import { ErrorState, InlineLoader } from '../../../../../shared/components'

const address = 'apps.order.views.order.'

export const Products = ({
   hideModifiers,
   order,
   loading,
   error,
   products,
}) => {
   const { t } = useTranslation()
   const { isSuperUser } = useAccess()
   const { state, dispatch } = useOrder()
   const { state: config } = useConfig()
   const [label, setLabel] = React.useState('')
   const [current, setCurrent] = React.useState({})

   const [updateCartItem] = useMutation(MUTATIONS.CART_ITEM.UPDATE, {
      onCompleted: () => {
         toast.success('Successfully updated the product!')
      },
      onError: error => {
         logger(error)
         toast.success('Failed to update the product!')
      },
   })

   const print = () => {
      if (
         isNull(
            state.current_product?.parent?.productOption?.operationConfig
               ?.labelTemplateId
         )
      ) {
         toast.error('No template assigned!')
         return
      }
      const url = `${process.env.REACT_APP_TEMPLATE_URL}?template={"name":"mealkit_product1","type":"label","format":"html"}&data={"id":${state.current_product?.id}}`

      if (config.print.print_simulation.value.isActive) {
         setLabel(url)
      } else {
         const url = `${
            new URL(process.env.REACT_APP_DATA_HUB_URI).origin
         }/datahub/v1/query`

         const data = {
            id: state.current_product?.id,
            assemblyStatus: 'COMPLETED',
            labelTemplateId:
               state.current_product?.parent?.productOption?.operationConfig
                  ?.labelTemplateId,
            assemblyStationId:
               state.current_product?.parent?.productOption?.operationConfig
                  ?.stationId,
            // simpleRecipeProductId: current.simpleRecipeProductId,
            // simpleRecipeProductOptionId: current.simpleRecipeProductOptionId,
         }
         axios.post(
            url,
            {
               type: 'invoke_event_trigger',
               args: {
                  name: 'printOrderMealKitProductLabel',
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

   const isOrderConfirmed = Boolean(order?.isAccepted && !order?.isRejected)
   const hasStationAccess = () => {
      let access = false

      if (!isOrderConfirmed) return access

      if (isSuperUser) {
         access = true
      } else if (
         state.current_product?.parent?.productOption?.operationConfig
            ?.stationId === config.current_station?.id
      ) {
         access = true
      } else {
         access = false
      }
      return access
   }

   const selectProduct = product => {
      setLabel('')
      dispatch({
         type: 'SELECT_PRODUCT',
         payload: product,
      })
      // findAndSelectSachet({
      //    dispatch,
      //    product,
      //    isSuperUser,
      //    station: config.current_station,
      // })
   }

   const packFallBackMessage = () => {
      if (isOrderConfirmed) {
         if (
            state.current_product?.parent?.productOption?.operationConfig
               ?.stationId === config.current_station?.id
         ) {
            return 'Mark Packed'
         }
         return 'You do not have access to pack this product'
      }
      return 'Pending order confirmation!'
   }

   const assembleFallBackMessage = () => {
      if (isOrderConfirmed) {
         if (
            state.current_product?.parent?.productOption?.operationConfig
               ?.stationId === config.current_station?.id
         ) {
            return ''
         }
         return 'You do not have access to assemble this product'
      }
      return 'Pending order confirmation!'
   }

   if (loading) return <InlineLoader />
   if (error) return <ErrorState message="Failed to fetch mealkit products!" />
   if (isEmpty(products))
      return <Filler message="No mealkit products available!" />
   return (
      <>
         <Tabs>
            <ProductsList>
               {products.map(product => (
                  <Tab key={product.id} as="div">
                     <ProductCard
                        product={product}
                        onClick={() => selectProduct(product)}
                        isActive={state?.current_product?.id === product.id}
                     />
                  </Tab>
               ))}
            </ProductsList>
            <TabPanels>
               {products.map(
                  product =>
                     state.current_product?.id === product.id && (
                        <TabPanel>
                           <Spacer size="16px" />
                           <Flex container alignItems="center">
                              <TextButton
                                 size="sm"
                                 type="solid"
                                 onClick={print}
                              >
                                 Print label
                              </TextButton>
                              <Spacer size="16px" xAxis />
                              <TextButton
                                 size="sm"
                                 type="solid"
                                 hasAccess={hasStationAccess()}
                                 disabled={
                                    state.current_product?.assemblyStatus ===
                                    'COMPLETED'
                                 }
                                 fallBackMessage={() => packFallBackMessage()}
                                 onClick={() =>
                                    updateCartItem({
                                       variables: {
                                          id: state.current_product?.id,
                                          _set: {
                                             assemblyStatus: 'COMPLETED',
                                          },
                                       },
                                    })
                                 }
                              >
                                 {state.current_product?.assemblyStatus ===
                                 'COMPLETED'
                                    ? 'Packed'
                                    : 'Mark Packed'}
                              </TextButton>
                              <Spacer size="16px" xAxis />
                              <TextButton
                                 size="sm"
                                 type="solid"
                                 hasAccess={hasStationAccess()}
                                 fallBackMessage={() =>
                                    assembleFallBackMessage()
                                 }
                                 disabled={
                                    state.current_product?.isAssembled ||
                                    state.current_product?.assemblyStatus !==
                                       'COMPLETED'
                                 }
                                 onClick={() =>
                                    updateCartItem({
                                       variables: {
                                          id: state.current_product?.id,
                                          _set: {
                                             isAssembled: true,
                                          },
                                       },
                                    })
                                 }
                              >
                                 {state.current_product?.isAssembled
                                    ? 'Assembled'
                                    : 'Mark Assembled'}
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
                                    <iframe
                                       src={label}
                                       frameBorder="0"
                                       title="label preview"
                                    />
                                 </>
                              )}
                           </Flex>
                           <Spacer size="24px" />
                           <section>
                              {/* 
                        {!hideModifiers && (
                           <>
                              <Scroll.Tabs>
                                 <Scroll.Tab
                                    className={
                                       window.location.hash === '#sachets'
                                          ? 'active'
                                          : ''
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
                         */}
                              <section id="sachets">
                                 <Text as="h2">Sachets</Text>
                                 <Legend>
                                    <h2>{t(address.concat('legends'))}</h2>
                                    <section>
                                       <span />
                                       <span>
                                          {t(address.concat('pending'))}
                                       </span>
                                    </section>
                                    <section>
                                       <span />
                                       <span>
                                          {t(address.concat('packed'))}
                                       </span>
                                    </section>
                                    <section>
                                       <span />
                                       <span>
                                          {t(address.concat('assembled'))}
                                       </span>
                                    </section>
                                 </Legend>
                                 {state.current_product?.id && <Sachets />}
                              </section>
                              {/* {!hideModifiers && current?.hasModifiers && (
                           <>
                              <Spacer size="32px" />
                              <section id="modifiers">
                                 <Text as="h2">Modifiers</Text>
                                 <Spacer size="16px" />
                                 {current && (
                                    <ProductModifiers product={current} />
                                 )}
                              </section>
                           </>
                        )} */}
                           </section>
                        </TabPanel>
                     )
               )}
            </TabPanels>
         </Tabs>
      </>
   )
}

const ProductsList = styled(TabList)`
   display: grid;
   grid-gap: 16px;
   grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
`

const ProductCard = ({ product, isActive, onClick }) => {
   const { t } = useTranslation()
   // const serving =
   //    product?.simpleRecipeProductOption?.simpleRecipeYield?.yield?.serving

   return (
      <Styles.ProductItem isActive={isActive} onClick={onClick}>
         {product?.displayImage && (
            <aside>
               <img src={product?.displayImage} alt={product?.displayName} />
            </aside>
         )}
         <main>
            <div>
               <StyledProductTitle>{product?.displayName}</StyledProductTitle>
            </div>
            <Spacer size="14px" />
            <Flex container alignItems="center" justifyContent="space-between">
               <span>
                  {product.assembledSachets?.aggregate?.count} /{' '}
                  {product.packedSachets?.aggregate?.count} /{' '}
                  {product.totalSachets?.aggregate?.count}
               </span>
               {/*
            <Flex container alignItems="center">
               <Flex as="span" container alignItems="center">
                  <UserIcon size={16} color="#555B6E" />
               </Flex>
               <Spacer size="6px" xAxis />
                <span>
                  {serving} {t(address.concat('servings'))}
               </span> 
            </Flex>
            */}
            </Flex>
         </main>
      </Styles.ProductItem>
   )
}
