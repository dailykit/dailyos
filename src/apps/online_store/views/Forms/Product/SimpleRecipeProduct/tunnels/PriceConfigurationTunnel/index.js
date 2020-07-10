import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Checkbox, Input, TunnelHeader } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'
import { UPDATE_SIMPLE_RECIPE_PRODUCT_OPTION } from '../../../../../../graphql'
import { StyledTable } from '../../components/Recipe/styled'
import { StyledInputWrapper, TunnelBody } from '../styled'

const address =
   'apps.online_store.views.forms.product.simplerecipeproduct.tunnels.priceconfigurationtunnel.'

const PriceConfigurationTunnel = ({ close }) => {
   const { t } = useTranslation()
   const { productState } = React.useContext(SimpleProductContext)

   const [busy, setBusy] = React.useState(false)
   const [isActive, setIsActive] = React.useState(productState.edit.isActive)
   const [price, setPrice] = React.useState(productState.edit.price[0])

   // Mutation
   const [updateOption] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT_OPTION, {
      variables: {
         id: productState.edit.id,
         set: {
            isActive,
            price: [price],
         },
      },
      onCompleted: () => {
         toast.success('Option updated!')
         close(1)
      },
      onError: () => {
         toast.error('Error')
         setBusy(false)
      },
   })

   // Handlers
   const save = () => {
      if (busy) return
      setBusy(true)
      updateOption()
   }

   return (
      <>
         <TunnelHeader
            title={t(address.concat('configure pricing for serving'))}
            right={{
               action: save,
               title: busy
                  ? t(address.concat('saving'))
                  : t(address.concat('save')),
            }}
            close={() => close(1)}
         />
         <TunnelBody>
            <StyledTable full>
               <thead>
                  <tr>
                     <th> </th>
                     <th>{t(address.concat('visibility'))}</th>
                     <th>{t(address.concat('serving'))}</th>
                     <th>{t(address.concat('price'))}</th>
                     <th>{t(address.concat('discount'))}</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td>
                        {productState.edit.type === 'mealKit'
                           ? t(address.concat('meal kit'))
                           : t(address.concat('ready to eat'))}
                     </td>
                     <td>
                        <Checkbox
                           checked={isActive}
                           onChange={value => setIsActive(value)}
                        />
                     </td>
                     <td>
                        {productState.edit.simpleRecipeYield.yield.serving}
                     </td>
                     <td>
                        <StyledInputWrapper width="60">
                           $
                           <Input
                              type="text"
                              name="price"
                              value={price.value}
                              onChange={e =>
                                 setPrice({ ...price, value: e.target.value })
                              }
                           />
                        </StyledInputWrapper>
                     </td>
                     <td>
                        <StyledInputWrapper width="60">
                           <Input
                              type="text"
                              value={price.discount}
                              onChange={e =>
                                 setPrice({
                                    ...price,
                                    discount: e.target.value,
                                 })
                              }
                           />
                           %
                        </StyledInputWrapper>
                     </td>
                  </tr>
               </tbody>
            </StyledTable>
         </TunnelBody>
      </>
   )
}

export default PriceConfigurationTunnel
