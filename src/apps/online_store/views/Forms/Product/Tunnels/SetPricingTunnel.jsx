import React from 'react'
import { Text, Checkbox, Input } from '@dailykit/ui'

import { ProductContext } from '../../../../context/product/index'

import { TunnelContainer, TunnelHeader, Spacer } from '../../../../components'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.tunnels.'

export default function SetPricingTunnel({ close }) {
   const { t } = useTranslation()
   const {
      productState: {
         pricingConfigFor,
         currentRecipe: { title, img, servings },
      },
      productDispatch,
   } = React.useContext(ProductContext)

   const [localPricing, setLocalPricing] = React.useState([])

   const handleServingCheck = servingSize => {
      const index = localPricing.findIndex(
         serving => serving.size === servingSize
      )

      if (index >= 0) {
         const newPricing = [...localPricing]
         newPricing.splice(newPricing[index], 1)
         setLocalPricing(newPricing)
      } else {
         const newPricing = [...localPricing]
         newPricing.push({ size: servingSize })
         setLocalPricing(newPricing)
      }
   }

   const checkIfChecked = servingSize => {
      const pricing = localPricing.find(price => price.size === servingSize)

      if (pricing && pricing.size) return true

      return false
   }

   const showPriceValue = servingSize => {
      const pricing = localPricing.find(price => price.size === servingSize)
      if (pricing && pricing.price) return pricing.price
   }

   const showDiscountValue = servingSize => {
      const pricing = localPricing.find(price => price.size === servingSize)
      if (pricing && pricing.discount) return pricing.discount
   }

   const addPricing = (servingSize, priceString) => {
      const index = localPricing.findIndex(
         pricing => pricing.size === servingSize
      )
      const newPricings = [...localPricing]

      if (!newPricings[index] && !newPricings[index].size) return
      const price = parseInt(priceString)

      console.log(price)

      if (!price) return

      newPricings[index].price = price

      setLocalPricing(newPricings)
   }
   const addDiscountedPricing = (servingSize, priceString) => {
      const index = localPricing.findIndex(
         pricing => pricing.size === servingSize
      )
      const newPricings = [...localPricing]

      if (!newPricings[index] && !newPricings[index].size) return
      const price = parseInt(priceString)

      console.log(price)

      if (!price) return

      newPricings[index].discount = price

      setLocalPricing(newPricings)
   }

   return (
      <TunnelContainer>
         <TunnelHeader
            title={`Configure ${
               pricingConfigFor === 'MEAL_KIT' ? 'Meal Kit' : 'Ready to Eat'
               }: ${title}`}
            close={() => {
               close(4)
            }}
            next={() => {
               productDispatch({
                  type: 'ACTIVATE_SERVING',
                  payload: localPricing,
               })
               close(4)
            }}
            nextAction="Save"
         />
         <Spacer />

         <img
            src={img}
            alt="title"
            style={{ width: '242px', height: '88px' }}
         />

         <Text as="title">{title}</Text>

         <div>
            <div
               style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '70%',
                  margin: '0 auto',
               }}
            >
               <Text as="subtitle">{t(address.concat('servings'))}</Text>
               <Text as="subtitle">{t(address.concat('price'))}</Text>
               <Text as="subtitle">{t(address.concat('discounted price'))}</Text>
            </div>
            {servings.map(serving => (
               <div
                  key={serving}
                  style={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     width: '70%',
                     margin: '10px auto',
                  }}
               >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     <Checkbox
                        checked={checkIfChecked(serving)}
                        onChange={() => {
                           handleServingCheck(serving)
                        }}
                     />
                     <span style={{ marginLeft: '5px' }}>
                        <Text as="subtitle">{serving}</Text>
                     </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     <div>$</div>
                     <Input
                        disabled={!checkIfChecked(serving)}
                        name="Price"
                        type="text"
                        onChange={e => {
                           addPricing(serving, e.target.value)
                        }}
                        value={showPriceValue(serving) || ''}
                     />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                     <div>$</div>
                     <Input
                        disabled={!checkIfChecked(serving)}
                        name="discountedPrice"
                        type="text"
                        onChange={e => {
                           addDiscountedPricing(serving, e.target.value)
                        }}
                        value={showDiscountValue(serving) || ''}
                     />
                  </div>
               </div>
            ))}
         </div>
      </TunnelContainer>
   )
}
