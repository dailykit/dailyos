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
import ProductDetails from './product_details'
import { UserIcon } from '../../../assets/icons'
import { MUTATIONS } from '../../../graphql'
import ProductModifiers from './modifiers'
import { logger } from '../../../../../shared/utils'
import { Legend, Styles, Scroll, StyledProductTitle } from '../styled'
import { ErrorState, InlineLoader } from '../../../../../shared/components'

const address = 'apps.order.views.order.'

export const MealKits = ({
   hideModifiers,
   data: { loading, error, mealkits },
}) => {
   const { state } = useConfig()
   const { t } = useTranslation()
   const [label, setLabel] = React.useState('')
   const [current, setCurrent] = React.useState({})

   const [update] = useMutation(MUTATIONS.ORDER.PRODUCT.MEALKIT.UPDATE, {
      onCompleted: () => {
         toast.success('Successfully updated the product!')
      },
      onError: error => {
         logger(error)
         toast.success('Failed to update the product!')
      },
   })

   React.useEffect(() => {
      if (!loading && !isEmpty(mealkits)) {
         const [product] = mealkits
         setCurrent(product)
      }
   }, [loading, mealkits, setCurrent])

   const print = () => {
      if (isNull(current?.labelTemplateId)) {
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

   if (loading) return <InlineLoader />
   if (error) return <ErrorState message="Failed to fetch mealkit products!" />
   if (isEmpty(mealkits))
      return <Filler message="No mealkit products available!" />
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
               fallBackMessage="Pending order confirmation!"
               hasAccess={Boolean(
                  current?.order?.isAccepted && !current?.order?.isRejected
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
               fallBackMessage="Pending order confirmation!"
               hasAccess={Boolean(
                  current?.order?.isAccepted && !current?.order?.isRejected
               )}
               disabled={
                  current?.isAssembled ||
                  current?.assemblyStatus !== 'COMPLETED'
               }
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
                     <Scroll.Tab
                        className={
                           window.location.hash === '#modifiers' ? 'active' : ''
                        }
                     >
                        <a href="#modifiers">Modifiers</a>
                     </Scroll.Tab>
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
            {!hideModifiers && (
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

const ProductCard = ({ mealkit, isActive, onClick }) => {
   const { t } = useTranslation()

   const assembled = mealkit?.orderSachets?.filter(sachet => sachet.isAssembled)
      .length
   const packed = mealkit?.orderSachets?.filter(
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
