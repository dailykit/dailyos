import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Input,
   Loader,
   Tunnel,
   Tunnels,
   useTunnel,
   Text,
   Toggle,
} from '@dailykit/ui'
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
   S_ACCOMPANIMENT_TYPES,
} from '../../../../graphql'
import { StyledWrapper, MasterSettings } from '../../styled'
import { StyledBody, StyledHeader, StyledMeta, StyledRule } from '../styled'
import { Description, Item, Assets } from './components'
import {
   AccompanimentTypeTunnel,
   DescriptionTunnel,
   ItemTunnel,
   ItemTypeTunnel,
   PricingTunnel,
   ProductsTunnel,
   ProductsTypeTunnel,
   AssetsTunnel,
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
   const [accompanimentTypes, setAccompanimentTypes] = React.useState([])
   const [products, setProducts] = React.useState({
      inventory: [],
      simple: [],
   })
   const [assetsTunnels, openAssetTunnel, closeAssetTunnel] = useTunnel(1)
   const [
      descriptionTunnels,
      openDescriptionTunnel,
      closeDescriptionTunnel,
   ] = useTunnel(1)
   const [itemsTunnel, openItemTunnel, closeItemTunnel] = useTunnel(2)
   const [
      accompanimentsTunnel,
      openAccompanimentTunnel,
      closeAccompanimentTunnel,
   ] = useTunnel(1)
   const [productsTunnel, openProductTunnel, closeProductTunnel] = useTunnel(2)
   const [pricingTunnel, openPricingTunnel, closePricingTunnel] = useTunnel(1)

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

   useSubscription(S_ACCOMPANIMENT_TYPES, {
      onSubscriptionData: data => {
         const { master_accompanimentType } = data.subscriptionData.data
         const updatedAccompanimentTypes = master_accompanimentType.map(
            item => {
               item.title = item.name
               return item
            }
         )
         setAccompanimentTypes(updatedAccompanimentTypes)
      },
   })

   // Mutation
   const [updateProduct] = useMutation(UPDATE_INVENTORY_PRODUCT, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error!')
      },
   })

   // Handlers
   const updateName = async () => {
      if (title) {
         const { data } = await updateProduct({
            variables: {
               id: state.id,
               set: {
                  name: title,
               },
            },
         })
         if (data) {
            dispatch({
               type: 'SET_TITLE',
               payload: { oldTitle: tabs.current.title, title },
            })
         }
      }
   }
   const togglePublish = val => {
      if (val && !state.isValid.status) {
         return toast.error('Product should be valid!')
      }
      updateProduct({
         variables: {
            id: state.id,
            set: {
               isPublished: val,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <InventoryProductContext.Provider
         value={{ productState, productDispatch }}
      >
         <Tunnels tunnels={descriptionTunnels}>
            <Tunnel layer={1}>
               <DescriptionTunnel
                  state={state}
                  close={closeDescriptionTunnel}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={assetsTunnels}>
            <Tunnel layer={1}>
               <AssetsTunnel state={state} closeTunnel={closeAssetTunnel} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={itemsTunnel}>
            <Tunnel layer={1}>
               <ItemTypeTunnel close={closeItemTunnel} open={openItemTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <ItemTunnel
                  state={state}
                  close={closeItemTunnel}
                  items={items[productState.meta.itemType]}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={accompanimentsTunnel}>
            <Tunnel layer={1}>
               <AccompanimentTypeTunnel
                  state={state}
                  close={closeAccompanimentTunnel}
                  accompanimentTypes={accompanimentTypes}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={productsTunnel}>
            <Tunnel layer={1}>
               <ProductsTypeTunnel
                  open={openProductTunnel}
                  close={closeProductTunnel}
               />
            </Tunnel>
            <Tunnel layer={2}>
               <ProductsTunnel
                  state={state}
                  close={closeProductTunnel}
                  products={products[productState.meta.productsType]}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={pricingTunnel}>
            <Tunnel layer={1}>
               <PricingTunnel state={state} close={closePricingTunnel} />
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
                  <div>
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
                  </div>
                  <div>
                     <Toggle
                        checked={state.isPublished}
                        setChecked={togglePublish}
                        label="Published"
                     />
                  </div>
               </MasterSettings>
            </StyledHeader>
            <StyledBody>
               <StyledMeta>
                  <div>
                     <Description
                        state={state}
                        openTunnel={openDescriptionTunnel}
                     />
                  </div>
                  <div>
                     <Assets state={state} openTunnel={openAssetTunnel} />
                  </div>
               </StyledMeta>
               <StyledRule />
               <Item
                  state={state}
                  openTunnel={openItemTunnel}
                  openAccompanimentTunnel={openAccompanimentTunnel}
                  openProductTunnel={openProductTunnel}
                  open
               />
            </StyledBody>
         </StyledWrapper>
      </InventoryProductContext.Provider>
   )
}
