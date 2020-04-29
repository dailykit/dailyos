import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import {
   Input,
   TextButton,
   ButtonTile,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'

// context
import {
   state as initialState,
   CustomizableProductContext,
   reducers,
} from '../../../../context/product/customizableProduct'

// styles
import { StyledWrapper } from '../../styled'
import { StyledHeader, StyledBody, StyledMeta, StyledRule } from '../styled'

// graphql
import {
   RECIPES,
   ACCOMPANIMENT_TYPES,
   SIMPLE_RECIPE_PRODUCTS,
   INVENTORY_PRODUCTS,
   CREATE_CUSTOMIZABLE_PRODUCT,
   CREATE_CUSTOMIZABLE_PRODUCT_OPTIONS,
} from '../../../../graphql'

// components
import { Description, Items } from './components'

// tunnels
import {
   DescriptionTunnel,
   ItemTypeTunnel,
   ItemsTunnel,
   AccompanimentTypeTunnel,
   ProductsTypeTunnel,
   ProductsTunnel,
} from './tunnels'

export default function CustomizableProduct() {
   const [state, dispatch] = React.useReducer(reducers, initialState)
   const [title, setTitle] = React.useState('')

   const [accompanimentTypes, setAccompanimentTypes] = React.useState([
      { id: 1, title: 'Beverages' },
      { id: 2, title: 'Salads' },
      { id: 3, title: 'Sweets' },
   ])
   const [products, setProducts] = React.useState({
      inventory: [],
      simple: [],
   })
   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   useQuery(SIMPLE_RECIPE_PRODUCTS, {
      onCompleted: data => {
         const updatedProducts = data.simpleRecipeProducts.map(pdct => {
            return {
               ...pdct,
               title: pdct.name,
            }
         })
         setProducts({
            ...products,
            simple: updatedProducts,
         })
      },
      fetchPolicy: 'cache-and-network',
   })
   useQuery(INVENTORY_PRODUCTS, {
      onCompleted: data => {
         const updatedProducts = data.inventoryProducts.map(pdct => {
            return {
               ...pdct,
               title: pdct.name,
            }
         })
         setProducts({
            ...products,
            inventory: updatedProducts,
         })
      },
      fetchPolicy: 'cache-and-network',
   })
   // useQuery(ACCOMPANIMENT_TYPES, {
   //    onCompleted: data => {
   //       const { accompanimentTypes } = data
   //       const updatedAccompanimentTypes = accompanimentTypes.map(item => {
   //          item.title = item.name
   //          return item
   //       })
   //       setAccompanimentTypes(updatedAccompanimentTypes)
   //    },
   // })

   const [createCustomizableProduct] = useMutation(
      CREATE_CUSTOMIZABLE_PRODUCT,
      {
         onCompleted: data => {
            const productId = data.createCustomizableProduct.returning[0].id
            saveOptions(productId)
         },
      }
   )

   const [createCustomizableProductOptions] = useMutation(
      CREATE_CUSTOMIZABLE_PRODUCT_OPTIONS,
      {
         onCompleted: data => {
            console.log('Saved!')
            console.log(data)
            toast.success('Product saved!')
         },
      }
   )

   const save = () => {
      const objects = {
         name: state.title,
         tags: state.tags,
         description: state.description,
         default: state.default,
      }
      createCustomizableProduct({
         variables: {
            objects: [objects],
         },
      })
   }

   const saveOptions = productId => {
      const objects = state.items.map(item => {
         return {
            customizableProductId: productId,
            accompaniments: item.accompaniments,
            inventoryProductId: item.type === 'inventory' ? item.id : null,
            simpleRecipeProductId: item.type === 'simple' ? item.id : null,
         }
      })
      createCustomizableProductOptions({
         variables: {
            objects,
         },
      })
   }

   return (
      <CustomizableProductContext.Provider value={{ state, dispatch }}>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <DescriptionTunnel close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <ItemTypeTunnel close={closeTunnel} open={openTunnel} />
            </Tunnel>
            <Tunnel layer={3}>
               <ItemsTunnel
                  close={closeTunnel}
                  items={products[state.meta.itemType]}
               />
            </Tunnel>
            <Tunnel layer={4}>
               <AccompanimentTypeTunnel
                  close={closeTunnel}
                  accompanimentTypes={accompanimentTypes}
               />
            </Tunnel>
            <Tunnel layer={5}>
               <ProductsTypeTunnel close={closeTunnel} open={openTunnel} />
            </Tunnel>
            <Tunnel layer={6}>
               <ProductsTunnel
                  close={closeTunnel}
                  products={products[state.meta.productsType]}
               />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               <div>
                  <Input
                     label="Product Name"
                     type="text"
                     name="name"
                     value={title}
                     onChange={e => setTitle(e.target.value)}
                     onBlur={e =>
                        dispatch({
                           type: 'TITLE',
                           payload: { value: e.target.value },
                        })
                     }
                  />
               </div>
               <div>
                  <TextButton
                     type="ghost"
                     style={{ margin: '0px 10px' }}
                     onClick={save}
                  >
                     Save
                  </TextButton>

                  <TextButton type="solid" style={{ margin: '0px 10px' }}>
                     Publish
                  </TextButton>
               </div>
            </StyledHeader>
            <StyledBody>
               <StyledMeta>
                  <div>
                     <Description openTunnel={openTunnel} />
                  </div>
                  <div></div>
               </StyledMeta>
               <StyledRule />
               <Items openTunnel={openTunnel} />
            </StyledBody>
         </StyledWrapper>
      </CustomizableProductContext.Provider>
   )
}
