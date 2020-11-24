import React from 'react'
import _ from 'lodash'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'
import {
   Flex,
   Text,
   Spacer,
   IconButton,
   CloseIcon,
   TextButton,
} from '@dailykit/ui'

import { useConfig } from '../../../context'
import { UserIcon } from '../../../assets/icons'
import { UPDATE_MEALKIT } from '../../../graphql'
import { logger } from '../../../../../shared/utils'
import ProductDetails from './MealKitProductDetails'
import { Legend, Styles, Scroll, StyledProductTitle } from '../styled'

const address = 'apps.order.views.order.'

export const MealKits = ({ mealkits }) => {
   const { state } = useConfig()
   const { t } = useTranslation()
   const [label, setLabel] = React.useState('')
   const [current, setCurrent] = React.useState({})
   const [update] = useMutation(UPDATE_MEALKIT, {
      onCompleted: () => {
         toast.success('Successfully updated the product!')
      },
      onError: error => {
         logger(error)
         toast.success('Failed to update the product!')
      },
   })

   React.useEffect(() => {
      if (mealkits.length > 0) {
         const [product] = mealkits
         setCurrent(product)
      }
   }, [mealkits, setCurrent])

   const print = () => {
      if (_.isNull(current?.labelTemplateId)) {
         toast.error('No template assigned!')
         return
      }
      const url = `${process.env.REACT_APP_TEMPLATE_URL}?template={"name":"mealkit_product1","type":"label","format":"html"}&data={"id":${current.id}}`

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
            simpleRecipeProductId: current.simpleRecipeProductId,
            simpleRecipeProductOptionId: current.simpleRecipeProductOptionId,
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

   if (mealkits.length === 0) return <div>No mealkit products!</div>
   return (
      <>
         <Styles.Products>
            {mealkits.map(mealkit => (
               <ProductCard
                  key={mealkit.id}
                  mealkit={mealkit}
                  isActive={current?.id === mealkit.id}
                  onClick={() => {
                     setLabel('')
                     setCurrent(mealkit)
                  }}
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
               Mark Packed
            </TextButton>
            <Spacer size="16px" xAxis />
            <TextButton
               size="sm"
               type="solid"
               disabled={current?.isAssembled}
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
               Mark Assembled
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
         <Spacer size="32px" />
         <section>
            <Scroll.Tabs>
               <Scroll.Tab
                  className={
                     window.location.hash === '#sachets' ? 'active' : ''
                  }
               >
                  <a href="#sachets">Sachets</a>
               </Scroll.Tab>
               <Scroll.Tab
                  className={
                     window.location.hash === '#modifiers' ? 'active' : ''
                  }
               >
                  <a href="#modifiers">Modifiers</a>
               </Scroll.Tab>
            </Scroll.Tabs>
            <section id="sachets">
               <Spacer size="16px" />
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
            <Spacer size="32px" />
            <section id="modifiers">
               <Text as="h2">Modifiers</Text>
            </section>
         </section>
      </>
   )
}

const ProductCard = ({ mealkit, isActive, onClick }) => {
   const { t } = useTranslation()

   const assembled = mealkit?.orderSachets.filter(sachet => sachet.isAssembled)
      .length
   const packed = mealkit?.orderSachets.filter(
      sachet => sachet.status === 'PACKED'
   ).length
   const total = mealkit?.orderSachets?.length
   const serving =
      mealkit?.simpleRecipeProductOption?.simpleRecipeYield?.yield?.serving

   return (
      <Styles.ProductItem isActive={isActive} onClick={onClick}>
         <div>
            <StyledProductTitle>
               {mealkit?.simpleRecipeProduct?.name}
               {mealkit?.comboProduct?.name}
               &nbsp;
               {mealkit?.comboProductComponent?.label &&
                  `(${mealkit?.comboProductComponent?.label})`}
            </StyledProductTitle>
         </div>
         <Spacer size="14px" />
         <Flex container alignItems="center" justifyContent="space-between">
            <span>
               {assembled} / {packed} / {total}
            </span>
            <Flex container alignItems="center">
               <Flex as="span" container alignItems="center">
                  <UserIcon size={16} color="#555B6E" />
               </Flex>
               <Spacer size="6px" xAxis />
               <span>
                  {serving} {t(address.concat('servings'))}
               </span>
            </Flex>
         </Flex>
      </Styles.ProductItem>
   )
}
