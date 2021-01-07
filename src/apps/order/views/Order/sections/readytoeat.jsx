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
import ProductModifiers from './modifiers'
import { MUTATIONS } from '../../../graphql'
import { logger } from '../../../../../shared/utils'
import { Legend, Styles, Scroll, StyledProductTitle } from '../styled'
import { ErrorState, InlineLoader } from '../../../../../shared/components'

const address = 'apps.order.views.order.'

export const ReadyToEats = ({
   hideModifiers,
   data: { loading, error, readytoeats },
}) => {
   const { state } = useConfig()
   const { t } = useTranslation()
   const { state: config } = useConfig()
   const [label, setLabel] = React.useState('')
   const [current, setCurrent] = React.useState({})

   const [update] = useMutation(MUTATIONS.ORDER.PRODUCT.READYTOEAT.UPDATE, {
      onCompleted: () => {
         toast.success('Successfully updated the product!')
      },
      onError: error => {
         logger(error)
         toast.success('Failed to update the product!')
      },
   })

   const print = () => {
      if (isNull(current?.labelTemplateId)) {
         toast.error('No template assigned!')
         return
      }
      const url = `${process.env.REACT_APP_TEMPLATE_URL}?template={"name":"readytoeat_product1","type":"label","format":"html"}&data={"id":${current.id}}`

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
                  name: 'printOrderReadyToEatProductLabel',
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

   React.useEffect(() => {
      if (!loading && !isEmpty(readytoeats)) {
         const [product] = readytoeats
         setCurrent(product)
      }
   }, [loading, readytoeats, setCurrent])

   if (loading) return <InlineLoader />
   if (error)
      return <ErrorState message="Failed to fetch ready to eat products!" />
   if (isEmpty(readytoeats))
      return <Filler message="No ready to eat products available!" />
   return (
      <>
         <Styles.Products>
            {readytoeats.map(readytoeat => (
               <ProductCard
                  key={readytoeat.id}
                  readytoeat={readytoeat}
                  onClick={() => {
                     setCurrent(readytoeat)
                     setLabel('')
                  }}
                  isActive={current?.id === readytoeat.id}
               />
            ))}
         </Styles.Products>
         <Spacer size="16px" />
         <Flex>
            <Flex container alignItems="center">
               <TextButton size="sm" type="solid" onClick={print}>
                  Print label
               </TextButton>
               <Spacer size="16px" xAxis />
               <TextButton
                  size="sm"
                  type="solid"
                  disabled={current?.assemblyStatus === 'COMPLETED'}
                  hasAccess={Boolean(
                     current?.order?.isAccepted &&
                        !current?.order?.isRejected &&
                        current?.assemblyStationId ===
                           config.current_station?.id
                  )}
                  fallBackMessage={
                     current?.assemblyStationId !== config.current_station?.id
                        ? ''
                        : 'Pending order confirmation!'
                  }
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
                        current?.assemblyStationId ===
                           config.current_station?.id
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

const ProductCard = ({ readytoeat, isActive, onClick }) => {
   const { t } = useTranslation()

   const serving =
      readytoeat?.simpleRecipeProductOption?.simpleRecipeYield?.yield?.serving

   return (
      <Styles.ProductItem onClick={onClick} isActive={isActive}>
         <div>
            <StyledProductTitle>
               {readytoeat?.simpleRecipeProduct?.name}
               {readytoeat?.comboProduct?.name}
               &nbsp;
               {readytoeat?.comboProductComponent?.label &&
                  `(${readytoeat?.comboProductComponent?.label})`}
            </StyledProductTitle>
         </div>
         <Spacer size="14px" />
         <Flex container alignItems="center" justifyContent="space-between">
            <span>
               {readytoeat.isAssembled ? 1 : 0} /{' '}
               {readytoeat.assemblyStatus === 'COMPLETED' ? 1 : 0} / 1
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
