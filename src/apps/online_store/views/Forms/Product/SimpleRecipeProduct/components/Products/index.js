import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ButtonTile, Input, useTunnel, Tunnels, Tunnel } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { DeleteIcon } from '../../../../../../assets/icons'
import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'
import { UPDATE_SIMPLE_RECIPE_PRODUCT } from '../../../../../../graphql'
import { StyledInputWrapper } from '../../tunnels/styled'
import {
   StyledLayout,
   StyledListing,
   StyledListingTile,
   StyledPanel,
} from './styled'
import { ProductsTypeTunnel, ProductsTunnel } from '../../tunnels'

const address =
   'apps.online_store.views.forms.product.simplerecipeproduct.components.products.'

const Products = ({ state }) => {
   const { t } = useTranslation()
   const { productState } = React.useContext(SimpleProductContext)

   const [current, setCurrent] = React.useState(0)
   const [discount, setDiscount] = React.useState(
      state.accompaniments[productState.meta.accompanimentTabIndex].products[
         current
      ]?.discount || { value: '' }
   )

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

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

   // Mutation
   const [updateProduct] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT, {
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
      if (discount.value && !Number.isNaN(discount.value)) {
         const { accompaniments } = state
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
      if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
         const { accompaniments } = state
         const updatedProducts = accompaniments[
            productState.meta.accompanimentTabIndex
         ].products.filter(pro => pro.id !== product.id)
         accompaniments[
            productState.meta.accompanimentTabIndex
         ].products = updatedProducts
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
               <ProductsTypeTunnel close={closeTunnel} open={openTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <ProductsTunnel close={closeTunnel} state={state} />
            </Tunnel>
         </Tunnels>
         <>
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
                           <span
                              tabIndex="0"
                              role="button"
                              onKeyDown={e =>
                                 e.charCode === 13 && deleteProduct(product)
                              }
                              onClick={() => deleteProduct(product)}
                           >
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
         </>
      </>
   )
}

export default Products
