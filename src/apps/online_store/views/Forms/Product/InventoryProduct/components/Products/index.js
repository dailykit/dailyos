import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ButtonTile, Input, Tunnel, useTunnel, Tunnels } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { DeleteIcon } from '../../../../../../assets/icons'
import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'
import { UPDATE_INVENTORY_PRODUCT } from '../../../../../../graphql'
import { StyledInputWrapper } from '../../tunnels/styled'
import {
   StyledLayout,
   StyledListing,
   StyledListingTile,
   StyledPanel,
} from './styled'
import { ProductsTypeTunnel, ProductsTunnel } from '../../tunnels'

const address =
   'apps.online_store.views.forms.product.inventoryproduct.components.products.'

const Products = ({ state }) => {
   const { t } = useTranslation()
   const { productState, productDispatch } = React.useContext(
      InventoryProductContext
   )
   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)
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
         toast.success(t(address.concat('updated!')))
      },
      onError: error => {
         console.log(error)
         toast.error(t(address.concat('error')))
      },
   })

   // Handlers
   const updateDiscount = () => {
      if (discount.value && !isNaN(discount.value)) {
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
   }
   const deleteProduct = product => {
      if (
         window.confirm(
            `t(address.concat('are you sure you want to delete')) ${product.name}?`
         )
      ) {
         const accompaniments = state.accompaniments
         const products = accompaniments[
            productState.meta.accompanimentTabIndex
         ].products.filter(pro => pro.id !== product.id)
         accompaniments[
            productState.meta.accompanimentTabIndex
         ].products = products
         updateProduct({
            variables: {
               id: state.id,
               set: {
                  accompaniments,
               },
            },
         })
      }
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <ProductsTypeTunnel open={openTunnel} close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <ProductsTunnel
                  state={state}
                  close={closeTunnel}
                  products={products[productState.meta.productsType]}
               />
            </Tunnel>
         </Tunnels>
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
                           <span onClick={() => deleteProduct(product)}>
                              <DeleteIcon color="#fff" />
                           </span>
                        </StyledListingTile>
                     ))}
                     <ButtonTile
                        type="secondary"
                        text={t(address.concat('add products'))}
                        onClick={() => openTunnel(1)}
                     />
                  </StyledListing>
                  <StyledPanel>
                     <h2>{current.title}</h2>
                     <StyledInputWrapper width="300">
                        <Input
                           type="text"
                           label={t(
                              address.concat('discount as accompaniment')
                           )}
                           name="discount"
                           value={discount.value}
                           onChange={e =>
                              setDiscount({ value: e.target.value })
                           }
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
                  onClick={() => openTunnel(1)}
               />
            )}
         </React.Fragment>
      </>
   )
}

export default Products
