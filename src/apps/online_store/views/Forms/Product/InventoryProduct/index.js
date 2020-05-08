import React from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import {
   Input,
   TextButton,
   ButtonTile,
   Tunnel,
   Tunnels,
   useTunnel,
   Loader,
} from '@dailykit/ui'

import { Context } from '../../../../context/tabs'
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
   PricingTunnel,
} from './tunnels'
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
   S_INVENTORY_PRODUCT,
   UPDATE_INVENTORY_PRODUCT,
} from '../../../../graphql'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.inventoryproduct.'

export default function InventoryProduct() {
   const { t } = useTranslation()

   // Context
   const [productState, productDispatch] = React.useReducer(
      reducers,
      initialState
   )
   const { state: tabs, dispatch } = React.useContext(Context)

   // State
   const [title, setTitle] = React.useState('')
   const [state, setState] = React.useState({})

   // const [items, setItems] = React.useState({
   //    inventory: [
   //       { id: 1, title: 'ITEM 1', unitSize: '1 pc' },
   //       { id: 2, title: 'ITEM 2', unitSize: '1 pc' },
   //       { id: 3, title: 'ITEM 3', unitSize: '1 pc' },
   //       { id: 4, title: 'ITEM 4', unitSize: '1 pc' },
   //       { id: 5, title: 'ITEM 5', unitSize: '1 pc' },
   //       { id: 6, title: 'ITEM 6', unitSize: '1 pc' },
   //       { id: 7, title: 'ITEM 7', unitSize: '1 pc' },
   //    ],
   //    sachet: [
   //       { id: 1, title: 'SACHET 1', unitSize: '100 gms' },
   //       { id: 2, title: 'SACHET 2', unitSize: '100 gms' },
   //       { id: 3, title: 'SACHET 3', unitSize: '100 gms' },
   //       { id: 4, title: 'SACHET 4', unitSize: '100 gms' },
   //       { id: 5, title: 'SACHET 5', unitSize: '100 gms' },
   //       { id: 6, title: 'SACHET 6', unitSize: '100 gms' },
   //       { id: 7, title: 'SACHET 7', unitSize: '100 gms' },
   //       { id: 8, title: 'SACHET 8', unitSize: '100 gms' },
   //       { id: 9, title: 'SACHET 9', unitSize: '100 gms' },
   //    ],
   // })
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

   // const [createInventoryProduct] = useMutation(CREATE_INVENTORY_PRODUCT, {
   //    onCompleted: data => {
   //       saveOptions(data.createInventoryProduct.returning[0].id)
   //    },
   // })

   // const [createInventoryProductOptions] = useMutation(
   //    CREATE_INVENTORY_PRODUCT_OPTIONS,
   //    {
   //       onCompleted: data => {
   //          console.log('Saved!')
   //          toast.success('Product saved!')
   //       },
   //    }
   // )

   // Subscription
   const { loading } = useSubscription(S_INVENTORY_PRODUCT, {
      variables: {
         id: tabs.current.id,
      },
      onSubscriptionData: data => {
         console.log(data)
         setState(data.subscriptionData.data.inventoryProduct)
         setTitle(data.subscriptionData.data.inventoryProduct.name)
      },
      onError: error => {
         console.log(error)
      },
   })

   // Mutation
   const [updateProduct] = useMutation(UPDATE_INVENTORY_PRODUCT, {
      variables: {
         id: state.id,
         set: {
            name: title,
         },
      },
      onCompleted: () => {
         toast.success('Name updated!')
         dispatch({
            type: 'SET_TITLE',
            payload: { oldTitle: tabs.current.title, title },
         })
      },
      onError: error => {
         console.log(error)
         toast.error('Error!')
      },
   })

   const save = () => {
      // const objects = {
      //    accompaniments: state.accompaniments,
      //    name: state.title,
      //    tags: state.tags,
      //    description: state.description,
      //    //  default: state.default,
      //    // Static id to changed later, as it throws fkey error rn
      //    supplierItemId: state.meta.itemType === 'inventory' ? 3 : null,
      //    sachetItemId: state.meta.itemType === 'sachet' ? state.item.id : null,
      // }
      // createInventoryProduct({
      //    variables: {
      //       objects: [objects],
      //    },
      // })
   }

   // const saveOptions = productId => {
   //    const objects = state.options.map(option => {
   //       return {
   //          inventoryProductId: productId,
   //          label: option.title,
   //          price: option.price,
   //          quantity: option.quantity,
   //       }
   //    })
   //    createInventoryProductOptions({
   //       variables: {
   //          objects,
   //       },
   //    })
   // }

   if (loading) return <Loader />

   return (
      <InventoryProductContext.Provider
         value={{ productState, productDispatch }}
      >
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <DescriptionTunnel state={state} close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <ItemTypeTunnel close={closeTunnel} open={openTunnel} />
            </Tunnel>
            <Tunnel layer={3}>
               <ItemTunnel
                  state={state}
                  close={closeTunnel}
                  // items={items[state.meta.itemType]}
               />
            </Tunnel>
            <Tunnel layer={4}>
               <AccompanimentTypeTunnel
                  state={state}
                  close={closeTunnel}
                  accompanimentTypes={accompanimentTypes}
               />
            </Tunnel>
            <Tunnel layer={5}>
               <ProductsTypeTunnel open={openTunnel} close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={6}>
               <ProductsTunnel
                  state={state}
                  close={closeTunnel}
                  products={products[productState.meta.productsType]}
               />
            </Tunnel>
            <Tunnel layer={7}>
               <PricingTunnel state={state} close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               <div>
                  <Input
                     label={t(address.concat('product name'))}
                     type="text"
                     name="name"
                     value={title}
                     onChange={e => setTitle(e.target.value)}
                     onBlur={updateProduct}
                  />
               </div>
               <div>
                  <TextButton
                     type="ghost"
                     style={{ margin: '0px 10px' }}
                     onClick={save}
                  >
                     {t(address.concat('save'))}
                  </TextButton>

                  <TextButton type="solid" style={{ margin: '0px 10px' }}>
                     {t(address.concat('publish'))}
                  </TextButton>
               </div>
            </StyledHeader>
            <StyledBody>
               <StyledMeta>
                  <div>
                     <Description state={state} openTunnel={openTunnel} />
                  </div>
                  <div></div>
               </StyledMeta>
               <StyledRule />
               <Item state={state} openTunnel={openTunnel} />
            </StyledBody>
         </StyledWrapper>
      </InventoryProductContext.Provider>
   )
}
