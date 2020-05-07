import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Input, Text, TextButton } from '@dailykit/ui'
import { useTranslation, Trans } from 'react-i18next'
import { toast } from 'react-toastify'

import { CloseIcon, MinusIcon, AddIcon } from '../../../../../../assets/icons'

import { TunnelHeader, TunnelBody, StyledInputWrapper, Grid } from '../styled'

import {
   CREATE_INVENTORY_PRODUCT_OPTIONS,
   UPDATE_INVENTORY_PRODUCT_OPTION,
} from '../../../../../../graphql'
import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'

const address =
   'apps.online_store.views.forms.product.inventoryproduct.tunnels.pricingtunnel.'

const PricingTunnel = ({ state, close }) => {
   const { t } = useTranslation()

   const { productState } = React.useContext(InventoryProductContext)

   const [busy, setBusy] = React.useState(false)
   const [_state, _setState] = React.useState(
      productState.updating
         ? {
              label: productState.option.label,
              quantity: productState.option.quantity,
              price: productState.option.price[0],
           }
         : {
              label: '',
              quantity: 1,
              price: {
                 rule: '',
                 value: '',
                 discount: '',
              },
           }
   )

   // Mutations
   const [createOption] = useMutation(CREATE_INVENTORY_PRODUCT_OPTIONS, {
      variables: {
         objects: [
            {
               ..._state,
               price: [_state.price],
               inventoryProductId: state.id,
            },
         ],
      },
      onCompleted: () => {
         toast.success('Option added!')
         close(7)
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
         setBusy(false)
      },
   })
   const [updateOption] = useMutation(UPDATE_INVENTORY_PRODUCT_OPTION, {
      variables: {
         id: productState.option?.id,
         set: {
            ..._state,
            price: [_state.price],
         },
      },
      onCompleted: () => {
         toast.success('Option updated!')
         close(7)
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
      if (productState.updating) updateOption()
      else createOption()
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(7)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <Text as="title">{t(address.concat('configure option'))}</Text>
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
            <Grid cols="4" gap="16">
               <Text as="p">Label</Text>
               <Text as="p">Quantity</Text>
               <Text as="p">Price</Text>
               <Text as="p">Discount</Text>
            </Grid>
            <Grid cols="4" gap="16">
               <Input
                  type="text"
                  name={`title`}
                  value={_state.label}
                  onChange={e =>
                     _setState({ ..._state, label: e.target.value })
                  }
               />
               <StyledInputWrapper align="center">
                  <span
                     onClick={() =>
                        _setState({
                           ..._state,
                           quantity:
                              _state.quantity - 1 === 0
                                 ? 1
                                 : _state.quantity - 1,
                        })
                     }
                  >
                     <MinusIcon color="#00A7E1" />
                  </span>
                  <Input
                     type="text"
                     name={`quantity`}
                     value={_state.quantity}
                     readOnly
                  />
                  <span
                     onClick={() =>
                        _setState({
                           ..._state,
                           quantity: _state.quantity + 1,
                        })
                     }
                  >
                     <AddIcon color="#00A7E1" />
                  </span>
               </StyledInputWrapper>
               <StyledInputWrapper>
                  $
                  <Input
                     type="text"
                     name={`price`}
                     value={_state.price.value}
                     onChange={e =>
                        _setState({
                           ..._state,
                           price: {
                              ..._state.price,
                              value: e.target.value,
                           },
                        })
                     }
                  />
               </StyledInputWrapper>
               <StyledInputWrapper>
                  <Input
                     type="text"
                     name={`discount`}
                     value={_state.price.discount}
                     onChange={e =>
                        _setState({
                           ..._state,
                           price: {
                              ..._state.price,
                              discount: e.target.value,
                           },
                        })
                     }
                  />
                  %
               </StyledInputWrapper>
            </Grid>
         </TunnelBody>
      </React.Fragment>
   )
}

export default PricingTunnel
