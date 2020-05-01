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

import {
   state as initialState,
   InventoryProductContext,
   reducers,
} from '../../../../context/product/inventoryProduct'

import {
   ItemTunnel,
   DescriptionTunnel,
   ProductsTypeTunnel,
   ProductsTunnel,
   AccompanimentTypeTunnel,
   ItemTypeTunnel,
} from './Tunnels'
import { Item, Description } from './components'
import { StyledWrapper } from '../../styled'
import { StyledHeader, StyledBody, StyledMeta, StyledRule } from '../styled'
import {
   RECIPES,
   ACCOMPANIMENT_TYPES,
   SIMPLE_RECIPE_PRODUCTS,
   CREATE_INVENTORY_PRODUCT,
   CREATE_INVENTORY_PRODUCT_OPTIONS,
   INVENTORY_PRODUCTS,
} from '../../../../graphql'

export default function InventoryProduct() {
   const [state, dispatch] = React.useReducer(reducers, initialState)
   const [title, setTitle] = React.useState('')
   const [items, setItems] = React.useState({
      inventory: [
         { id: 1, title: 'ITEM 1', unitSize: '1 pc' },
         { id: 2, title: 'ITEM 2', unitSize: '1 pc' },
         { id: 3, title: 'ITEM 3', unitSize: '1 pc' },
         { id: 4, title: 'ITEM 4', unitSize: '1 pc' },
         { id: 5, title: 'ITEM 5', unitSize: '1 pc' },
         { id: 6, title: 'ITEM 6', unitSize: '1 pc' },
         { id: 7, title: 'ITEM 7', unitSize: '1 pc' },
      ],
      sachet: [
         { id: 1, title: 'SACHET 1', unitSize: '100 gms' },
         { id: 2, title: 'SACHET 2', unitSize: '100 gms' },
         { id: 3, title: 'SACHET 3', unitSize: '100 gms' },
         { id: 4, title: 'SACHET 4', unitSize: '100 gms' },
         { id: 5, title: 'SACHET 5', unitSize: '100 gms' },
         { id: 6, title: 'SACHET 6', unitSize: '100 gms' },
         { id: 7, title: 'SACHET 7', unitSize: '100 gms' },
         { id: 8, title: 'SACHET 8', unitSize: '100 gms' },
         { id: 9, title: 'SACHET 9', unitSize: '100 gms' },
      ],
   })
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
         console.log('Inve -> data', data)
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

   const [createInventoryProduct] = useMutation(CREATE_INVENTORY_PRODUCT, {
      onCompleted: data => {
         saveOptions(data.createInventoryProduct.returning[0].id)
      },
   })

   const [createInventoryProductOptions] = useMutation(
      CREATE_INVENTORY_PRODUCT_OPTIONS,
      {
         onCompleted: data => {
            console.log('Saved!')
            toast.success('Product saved!')
         },
      }
   )

   const save = () => {
      const objects = {
         accompaniments: state.accompaniments,
         name: state.title,
         tags: state.tags,
         description: state.description,
         //  default: state.default,
         // Static id to changed later, as it throws fkey error rn
         supplierItemId: state.meta.itemType === 'inventory' ? 3 : null,
         sachetItemId: state.meta.itemType === 'sachet' ? state.item.id : null,
      }
      createInventoryProduct({
         variables: {
            objects: [objects],
         },
      })
   }

   const saveOptions = productId => {
      const objects = state.options.map(option => {
         return {
            inventoryProductId: productId,
            label: option.title,
            price: option.price,
            quantity: option.quantity,
         }
      })
      createInventoryProductOptions({
         variables: {
            objects,
         },
      })
   }

   return (
      <InventoryProductContext.Provider value={{ state, dispatch }}>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <DescriptionTunnel close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <ItemTypeTunnel close={closeTunnel} open={openTunnel} />
            </Tunnel>
            <Tunnel layer={3}>
               <ItemTunnel
                  close={closeTunnel}
                  items={items[state.meta.itemType]}
               />
            </Tunnel>
            <Tunnel layer={4}>
               <AccompanimentTypeTunnel
                  close={closeTunnel}
                  accompanimentTypes={accompanimentTypes}
               />
            </Tunnel>
            <Tunnel layer={5}>
               <ProductsTypeTunnel open={openTunnel} close={closeTunnel} />
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
               <Item openTunnel={openTunnel} />
            </StyledBody>
         </StyledWrapper>
      </InventoryProductContext.Provider>
   )
}
