import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Input, Loader, Tunnel, Tunnels, useTunnel, Text } from '@dailykit/ui'
import { TickIcon, CloseIcon } from '../../../../assets/icons'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
   InventoryProductContext,
   reducers,
   state as initialState,
} from '../../../../context/product/inventoryProduct'
import { Context } from '../../../../context/tabs'
import {
   S_INVENTORY_PRODUCT,
   S_SACHET_ITEMS,
   S_SUPPLIER_ITEMS,
   UPDATE_INVENTORY_PRODUCT,
   S_SIMPLE_RECIPE_PRODUCTS,
   S_INVENTORY_PRODUCTS,
} from '../../../../graphql'
import { StyledWrapper, MasterSettings } from '../../styled'
import { StyledBody, StyledHeader, StyledMeta, StyledRule } from '../styled'
import { Description, Item } from './components'
import {
   AccompanimentTypeTunnel,
   DescriptionTunnel,
   ItemTunnel,
   ItemTypeTunnel,
   PricingTunnel,
   ProductsTunnel,
   ProductsTypeTunnel,
} from './tunnels'

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

   const [items, setItems] = React.useState({
      inventory: [],
      sachet: [],
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

   // Subscription
   const { loading } = useSubscription(S_INVENTORY_PRODUCT, {
      variables: {
         id: tabs.current.id,
      },
      onSubscriptionData: data => {
         setState(data.subscriptionData.data.inventoryProduct)
         setTitle(data.subscriptionData.data.inventoryProduct.name)
      },
      onError: error => {
         console.log(error)
      },
   })

   // Subscriptions for fetching items
   useSubscription(S_SUPPLIER_ITEMS, {
      onSubscriptionData: data => {
         const updatedItems = data.subscriptionData.data.supplierItems.map(
            item => {
               return {
                  id: item.id,
                  title: item.name + ' - ' + item.unitSize + ' ' + item.unit,
               }
            }
         )
         setItems({
            ...items,
            inventory: updatedItems,
         })
      },
      onError: error => {
         console.log(error)
      },
   })
   useSubscription(S_SACHET_ITEMS, {
      onSubscriptionData: data => {
         const updatedItems = data.subscriptionData.data.sachetItems.map(
            item => {
               return {
                  id: item.id,
                  title:
                     item.bulkItem.supplierItem.name +
                     ' ' +
                     item.bulkItem.processingName +
                     ' - ' +
                     item.unitSize +
                     ' ' +
                     item.unit,
               }
            }
         )
         setItems({
            ...items,
            sachet: updatedItems,
         })
      },
      onError: error => {
         console.log(error)
      },
   })

   // Subscription for fetching products
   useSubscription(S_SIMPLE_RECIPE_PRODUCTS, {
      onSubscriptionData: data => {
         const updatedProducts = data.subscriptionData.data.simpleRecipeProducts
            .filter(pdct => pdct.isValid.status && pdct.isPublished)
            .map(pdct => {
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
      onError: error => {
         console.log(error)
      },
   })
   useSubscription(S_INVENTORY_PRODUCTS, {
      onSubscriptionData: data => {
         const updatedProducts = data.subscriptionData.data.inventoryProducts
            .filter(pdct => pdct.isValid.status && pdct.isPublished)
            .map(pdct => {
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
      onError: error => {
         console.log(error)
      },
   })

   // Mutation
   const [updateProduct] = useMutation(UPDATE_INVENTORY_PRODUCT, {
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

   //Handlers
   const updateName = () => {
      if (title) {
         updateProduct({
            variables: {
               id: state.id,
               set: {
                  name: title,
               },
            },
         })
      }
   }

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
                  items={items[productState.meta.itemType]}
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
                     onBlur={updateName}
                  />
               </div>
               <MasterSettings>
                  {state.isValid?.status ? (
                     <React.Fragment>
                        <TickIcon color="#00ff00" stroke={2} />
                        <Text as="p">All good!</Text>
                     </React.Fragment>
                  ) : (
                     <React.Fragment>
                        <CloseIcon color="#ff0000" />
                        <Text as="p">{state.isValid?.error}</Text>
                     </React.Fragment>
                  )}
               </MasterSettings>
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
