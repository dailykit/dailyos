import React from 'react'
import { useTranslation } from 'react-i18next'

import ProductDetails from './MealKitProductDetails'
import { UserIcon } from '../../../assets/icons'
import {
   Legend,
   OrderItem,
   OrderItems,
   StyledServings,
   StyledProductTitle,
} from '../styled'

const address = 'apps.order.views.order.'

export const MealKits = ({ mealkits }) => {
   const { t } = useTranslation()
   const [current, setCurrent] = React.useState(null)

   React.useEffect(() => {
      if (mealkits.length > 0) {
         const [product] = mealkits
         setCurrent(product.id)
      }
   }, [mealkits, setCurrent])

   if (mealkits.length === 0) return <div>No mealkit products!</div>
   return (
      <>
         <OrderItems>
            {mealkits.map(mealkit => (
               <OrderItem
                  key={mealkit.id}
                  isActive={current === mealkit.id}
                  onClick={() => setCurrent(mealkit.id)}
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
