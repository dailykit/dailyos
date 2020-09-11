import React from 'react'
import { useTranslation } from 'react-i18next'

import { useOrder } from '../../../context'
import { UserIcon } from '../../../assets/icons'
import {
   OrderItem,
   OrderItems,
   StyledServings,
   StyledProductTitle,
} from '../styled'

const address = 'apps.order.views.order.'

export const ReadyToEats = ({ readytoeats }) => {
   const { t } = useTranslation()
   const { switchView, selectReadyToEat } = useOrder()
   const [current, setCurrent] = React.useState(null)

   const selectProduct = id => {
      setCurrent(id)
      const product = readytoeats.find(mealkit => id === mealkit.id)
      if ('id' in product) {
         selectReadyToEat(product.id)
      } else {
         switchView('SUMMARY')
      }
   }

   React.useEffect(() => {
      if (readytoeats.length > 0) {
         const [product] = readytoeats
         setCurrent(product.id)
      }
   }, [readytoeats])

   if (readytoeats.length === 0) return <div>No ready to eat products!</div>
   return (
      <OrderItems>
         {readytoeats.map(readytoeat => (
            <OrderItem
               key={readytoeat.id}
               onClick={() => selectProduct(readytoeat.id)}
               isActive={current === readytoeat.id}
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
   )
}
