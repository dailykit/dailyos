import React from 'react'
import _ from 'lodash'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import {
   Flex,
   Text,
   Spacer,
   IconButton,
   CloseIcon,
   TextButton,
} from '@dailykit/ui'

import { UserIcon } from '../../../assets/icons'
import { useOrder, useConfig } from '../../../context'
import {
   OrderItem,
   OrderItems,
   StyledServings,
   StyledProductTitle,
} from '../styled'

const address = 'apps.order.views.order.'

export const ReadyToEats = ({ readytoeats }) => {
   const { state } = useConfig()
   const { t } = useTranslation()
   const [label, setLabel] = React.useState('')
   const { selectReadyToEat } = useOrder()
   const [current, setCurrent] = React.useState({})

   const selectProduct = product => {
      setCurrent(product)
      setLabel('')
      selectReadyToEat(product.id)
   }

   const print = () => {
      if (_.isNull(current?.labelTemplateId)) {
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
      if (readytoeats.length > 0) {
         const [product] = readytoeats
         setCurrent(product)
      }
   }, [readytoeats])

   if (readytoeats.length === 0) return <div>No ready to eat products!</div>
   return (
      <>
         <OrderItems>
            {readytoeats.map(readytoeat => (
               <OrderItem
                  key={readytoeat.id}
                  onClick={() => selectProduct(readytoeat)}
                  isActive={current?.id === readytoeat.id}
               >
                  <div>
                     <StyledProductTitle>
                        {readytoeat?.simpleRecipeProduct?.name}
                        {readytoeat?.comboProduct?.name}
                        &nbsp;
                        {readytoeat?.comboProductComponent?.label &&
                           `(${readytoeat?.comboProductComponent?.label})`}
                     </StyledProductTitle>
                  </div>
                  <section>
                     <span>
                        {readytoeat.isAssembled ? 1 : 0} /{' '}
                        {readytoeat.assemblyStatus === 'COMPLETED' ? 1 : 0} / 1
                     </span>
                     <StyledServings>
                        <span>
                           <UserIcon size={16} color="#555B6E" />
                        </span>
                        <span>
                           {
                              readytoeat?.simpleRecipeProductOption
                                 ?.simpleRecipeYield?.yield?.serving
                           }
                           &nbsp; {t(address.concat('servings'))}
                        </span>
                     </StyledServings>
                  </section>
               </OrderItem>
            ))}
         </OrderItems>
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