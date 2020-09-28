import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Input, Text, TunnelHeader } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { AddIcon, MinusIcon } from '../../../../../../assets/icons'
import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'
import {
   CREATE_INVENTORY_PRODUCT_OPTIONS,
   UPDATE_INVENTORY_PRODUCT_OPTION,
} from '../../../../../../graphql'
import { Grid, StyledInputWrapper, TunnelBody } from '../styled'

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
         close(1)
      },
      onError: () => {
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
         close(1)
      },
      onError: () => {
         toast.error('Error')
         setBusy(false)
      },
   })

   // Handlers
   const save = () => {
      try {
         if (busy) return
         setBusy(true)
         if (!_state.label) {
            throw Error('Invalid label!')
         }
         if (
            !_state.price.value ||
            Number.isNaN(_state.price.value) ||
            parseFloat(_state.price.value) === 0
         ) {
            throw Error('Invalid price!')
         }
         if (!_state.price.discount || Number.isNaN(_state.price.discount)) {
            throw Error('Invalid discount!')
         }
         if (productState.updating) updateOption()
         else createOption()
      } catch (e) {
         toast.error(e.message)
         setBusy(false)
      }
   }

   return (
      <>
         <TunnelHeader
            title={t(address.concat('configure option'))}
            right={{
               action: save,
               title: busy
                  ? t(address.concat('saving'))
                  : t(address.concat('save')),
            }}
            close={() => close(1)}
         />
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
                  name="title"
                  value={_state.label}
                  onChange={e =>
                     _setState({ ..._state, label: e.target.value })
                  }
               />
               <StyledInputWrapper align="center">
                  <span
                     role="button"
                     tabIndex="0"
                     onKeyDown={e =>
                        e.charCode === 13 &&
                        _setState({
                           ..._state,
                           quantity:
                              _state.quantity - 1 === 0
                                 ? 1
                                 : _state.quantity - 1,
                        })
                     }
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
                     name="quantity"
                     value={_state.quantity}
                     readOnly
                  />
                  <span
                     role="button"
                     tabIndex="0"
                     onKeyDown={e =>
                        e.charCode === 13 &&
                        _setState({
                           ..._state,
                           quantity: _state.quantity + 1,
                        })
                     }
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
                     name="price"
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
                     name="discount"
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
      </>
   )
}

export default PricingTunnel
