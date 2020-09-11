import React from 'react'
import _ from 'lodash'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'
import { IconButton, CloseIcon } from '@dailykit/ui'

import { useConfig } from '../../../context'
import { UserIcon } from '../../../assets/icons'
import { CREATE_PRINT_JOB } from '../../../graphql'
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
   const [current, setCurrent] = React.useState(null)
   const [printLabel] = useMutation(CREATE_PRINT_JOB, {
      onCompleted: () => {
         const product = mealkits.find(mealkit => mealkit.id === current)
         toast.success(
            `Label for ${product?.simpleRecipeProduct?.name} has been printed!`
         )
      },
      onError: () => {
         const product = mealkits.find(mealkit => mealkit.id === current)
         toast.error(
            `Printing label for ${product?.simpleRecipeProduct?.name} failed!`
         )
      },
   })

   React.useEffect(() => {
      if (mealkits.length > 0) {
         const [product] = mealkits
         setCurrent(product.id)
      }
   }, [mealkits, setCurrent])

   const print = () => {
      if (_.isEmpty(state.stations)) {
         toast.error('No printers available')
         return
      }
      const url = `${process.env.REACT_APP_TEMPLATE_URL}?template={"name":"mealkit_product1","type":"label","format":"html"}&data={"id":${current}}`

      if (state.print.print_simulation.value.isActive) {
         setLabel(url)
      } else {
         const product = mealkits.find(mealkit => mealkit.id === current)
         printLabel({
            variables: {
               url,
               source: 'DailyOS',
               contentType: 'pdf_uri',
               title: `${product?.simpleRecipeProduct?.name}`,
               printerId: state.stations[0].defaultLabelPrinter.printNodeId,
            },
         })
      }
   }

   if (mealkits.length === 0) return <div>No mealkit products!</div>
   return (
      <>
         <OrderItems>
            {mealkits.map(mealkit => (
               <OrderItem
                  key={mealkit.id}
                  isActive={current === mealkit.id}
                  onClick={() => {
                     setLabel('')
                     setCurrent(mealkit.id)
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
                        frameborder="0"
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
         {current && (
            <ProductDetails
               product={mealkits.find(({ id }) => id === current)}
            />
         )}
      </>
   )
}
