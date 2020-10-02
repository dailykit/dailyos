import React from 'react'
import _ from 'lodash'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { IconButton, CloseIcon } from '@dailykit/ui'

import { useConfig } from '../../../context'
import { UserIcon } from '../../../assets/icons'
import ProductDetails from './MealKitProductDetails'
import { Flex } from '../../../../../shared/components'
import { StyledButton, StyledLabelPreview } from './styled'
import {
   Legend,
   OrderItem,
   OrderItems,
   StyledServings,
   StyledProductTitle,
} from '../styled'

const address = 'apps.order.views.order.'

export const MealKits = ({ mealkits }) => {
   const { state } = useConfig()
   const { t } = useTranslation()
   const [label, setLabel] = React.useState('')
   const [current, setCurrent] = React.useState({})

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
         <OrderItems>
            {mealkits.map(mealkit => (
               <OrderItem
                  key={mealkit.id}
                  isActive={current?.id === mealkit.id}
                  onClick={() => {
                     setLabel('')
                     setCurrent(mealkit)
                  }}
               >
                  <div>
                     <StyledProductTitle>
                        {mealkit?.simpleRecipeProduct?.name}
                        {mealkit?.comboProduct?.name}
                        &nbsp;
                        {mealkit?.comboProductComponent?.label &&
                           `(${mealkit?.comboProductComponent?.label})`}
                     </StyledProductTitle>
                  </div>
                  <section>
                     <span>
                        {
                           mealkit?.orderSachets.filter(
                              sachet => sachet.isAssembled
                           ).length
                        }
                        &nbsp;/&nbsp;
                        {
                           mealkit?.orderSachets.filter(
                              sachet => sachet.status === 'PACKED'
                           ).length
                        }
                        &nbsp; / {mealkit?.orderSachets?.length}
                     </span>
                     <StyledServings>
                        <span>
                           <UserIcon size={16} color="#555B6E" />
                        </span>
                        <span>
                           {
                              mealkit?.simpleRecipeProductOption
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
      </>
   )
}
