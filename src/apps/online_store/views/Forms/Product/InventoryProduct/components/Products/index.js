import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   StyledListing,
   StyledLayout,
   StyledListingTile,
   StyledPanel,
} from './styled'
import { ButtonTile, Input } from '@dailykit/ui'
import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'

import { useTranslation, Trans } from 'react-i18next'
import { UPDATE_INVENTORY_PRODUCT } from '../../../../../../graphql'

import { toast } from 'react-toastify'
import { StyledInputWrapper } from '../../tunnels/styled'

const address =
   'apps.online_store.views.forms.product.inventoryproduct.components.products.'

const Products = ({ state, openTunnel, view }) => {
   const { t } = useTranslation()
   const { productState, productDispatch } = React.useContext(
      InventoryProductContext
   )

   const [current, setCurrent] = React.useState(0)
   const [discount, setDiscount] = React.useState(
      state.accompaniments[productState.meta.accompanimentTabIndex].products[
         current
      ]?.discount || { value: '' }
   )

   // Effects
   React.useEffect(() => {
      setDiscount(
         state.accompaniments[productState.meta.accompanimentTabIndex].products[
            current
         ]?.discount || { value: '' }
      )
   }, [current, productState.meta.accompanimentTabIndex])
   React.useEffect(() => {
      setCurrent(0)
   }, [productState.meta.accompanimentTabIndex])

   //Mutation
   const [updateProduct] = useMutation(UPDATE_INVENTORY_PRODUCT, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   // Handlers
   const updateDiscount = () => {
      const accompaniments = state.accompaniments
      accompaniments[productState.meta.accompanimentTabIndex].products[
         current
      ].discount = discount
      updateProduct({
         variables: {
            id: state.id,
            set: {
               accompaniments,
            },
         },
      })
   }

   return (
      <React.Fragment>
         {state.accompaniments[productState.meta.accompanimentTabIndex]
            ?.products.length ? (
            <StyledLayout>
               <StyledListing>
                  {state.accompaniments[
                     productState.meta.accompanimentTabIndex
                  ]?.products.map((product, i) => (
                     <StyledListingTile
                        key={product.id}
                        active={current === i}
                        onClick={() => setCurrent(i)}
                     >
                        {product.name}
                     </StyledListingTile>
                  ))}
                  <ButtonTile
                     type="secondary"
                     text={t(address.concat('add products'))}
                     onClick={() => openTunnel(5)}
                  />
               </StyledListing>
               <StyledPanel>
                  <h2>{current.title}</h2>
                  <StyledInputWrapper width="300">
                     <Input
                        type="text"
                        label={t(address.concat('discount as accompaniment'))}
                        name="discount"
                        value={discount.value}
                        onChange={e => setDiscount({ value: e.target.value })}
                        onBlur={updateDiscount}
                     />
                     %
                  </StyledInputWrapper>
               </StyledPanel>
            </StyledLayout>
         ) : (
            <ButtonTile
               type="secondary"
               text={t(address.concat('add products'))}
               onClick={() => openTunnel(5)}
            />
         )}
      </React.Fragment>
   )
}

export default Products
