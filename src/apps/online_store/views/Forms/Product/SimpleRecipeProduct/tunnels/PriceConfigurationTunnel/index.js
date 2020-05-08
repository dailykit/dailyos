import React from 'react'
import { TextButton, Checkbox, Input, Text } from '@dailykit/ui'

import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'
import { CloseIcon } from '../../../../../../assets/icons'

import { TunnelHeader, TunnelBody, StyledInputWrapper } from '../styled'

import { StyledTable } from '../../components/Recipe/styled'

import { UPDATE_SIMPLE_RECIPE_PRODUCT_OPTION } from '../../../../../../graphql'

import { useTranslation, Trans } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

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
         close(6)
      },
      onError: error => {
         console.log(error)
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
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(6)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <Text as="title">
                  {t(address.concat('configure pricing for serving'))}
               </Text>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {busy
                     ? t(address.concat('saving'))
                     : t(address.concat('save'))}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <StyledTable full>
               <thead>
                  <tr>
                     <th></th>
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
      </React.Fragment>
   )
}

export default PriceConfigurationTunnel
