import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
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
   RecipeTunnel,
   DescriptionTunnel,
   ProductsTypeTunnel,
   ProductsTunnel,
   AccompanimentTypeTunnel,
   PriceConfigurationTunnel,
} from './tunnels'
import { Recipe, Description } from './components'
import { StyledWrapper } from '../../styled'
import { StyledHeader, StyledBody, StyledMeta, StyledRule } from '../styled'
import {
   RECIPES,
   ACCOMPANIMENT_TYPES,
   PRODUCTS,
   CREATE_SIMPLE_RECIPE_PRODUCT,
   CREATE_SIMPLE_RECIPE_PRODUCT_OPTIONS,
} from '../../../../graphql'

export default function SimpleRecipeProduct() {
   const [state, dispatch] = React.useReducer(reducers, initialState)
   const [title, setTitle] = React.useState('')
   const [items, setItems] = React.useState([
      { id: 1, title: 'ITEM 1' },
      { id: 2, title: 'ITEM 2' },
      { id: 3, title: 'ITEM 3' },
   ])
   const [accompanimentTypes, setAccompanimentTypes] = React.useState([
      { id: 1, title: 'Beverages' },
      { id: 2, title: 'Salads' },
      { id: 3, title: 'Sweets' },
   ])
   const [products, setProducts] = React.useState({
      inventory: [
         { id: 1, title: 'INV 1' },
         { id: 2, title: 'INV 2' },
      ],
      simple: [],
   })
   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   useQuery(PRODUCTS, {
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

   return (
      <InventoryProductContext.Provider value={{ state, dispatch }}>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <DescriptionTunnel close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <ItemTunnel close={closeTunnel} items={items} />
            </Tunnel>
            <Tunnel layer={3}>
               <AccompanimentTypeTunnel
                  close={closeTunnel}
                  accompanimentTypes={accompanimentTypes}
               />
            </Tunnel>
            <Tunnel layer={4}>
               <ProductsTypeTunnel open={openTunnel} close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={5}>
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
