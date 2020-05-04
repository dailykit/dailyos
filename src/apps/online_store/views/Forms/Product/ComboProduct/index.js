import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { Input, TextButton, Tunnel, Tunnels, useTunnel } from '@dailykit/ui'

// context
import {
   state as initialState,
   ComboProductContext,
   reducers,
} from '../../../../context/product/comboProduct'
import { Context } from '../../../../context/tabs'

// styles
import { StyledWrapper } from '../../styled'
import { StyledHeader, StyledBody, StyledMeta, StyledRule } from '../styled'

// graphql
import {
   SIMPLE_RECIPE_PRODUCTS,
   INVENTORY_PRODUCTS,
   CUSTOMIZABLE_PRODUCTS,
   COMBO_PRODUCT,
   UPDATE_COMBO_PRODUCT,
} from '../../../../graphql'

// components
import { Description, Items } from './components'

// tunnels
import {
   DescriptionTunnel,
   ItemsTunnel,
   ProductTypeTunnel,
   ProductsTunnel,
} from './tunnels'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.comboproduct.'

export default function ComboProduct() {
   const { t } = useTranslation()
   const { state: tabs } = React.useContext(Context)
   const [state, dispatch] = React.useReducer(reducers, initialState)
   const [title, setTitle] = React.useState(state.name)

   const [products, setProducts] = React.useState({
      inventory: [],
      simple: [],
      customizable: [],
   })
   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   // Queries
   useQuery(COMBO_PRODUCT, {
      variables: {
         id: tabs.current.id,
      },
      onCompleted: data => {
         console.log('ComboProduct -> data', data)
         const {
            id,
            name,
            tags,
            description,
            comboProductComponents,
         } = data.comboProduct
         dispatch({
            type: 'SEED',
            payload: {
               name,
               tags,
               description,
               id,
               components: comboProductComponents,
            },
         })
      },
      onError: error => {
         console.log(error)
      },
   })
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
   useQuery(CUSTOMIZABLE_PRODUCTS, {
      onCompleted: data => {
         const updatedProducts = data.customizableProducts.map(pdct => {
            return {
               ...pdct,
               title: pdct.name,
            }
         })
         setProducts({
            ...products,
            customizable: updatedProducts,
         })
      },
      fetchPolicy: 'cache-and-network',
   })

   //Mutations
   const [updateComboProduct] = useMutation(UPDATE_COMBO_PRODUCT, {
      onCompleted: data => {
         const { name } = data.updateComboProduct.returning[0]
         dispatch({
            type: 'NAME',
            payload: {
               value: name,
            },
         })
      },
   })

   // Handlers
   const updateName = e => {
      updateComboProduct({
         variables: {
            where: { id: { _eq: state.id } },
            set: {
               name: e.target.value,
            },
         },
      })
   }

   // Effects
   React.useEffect(() => {
      setTitle(state.name)
   }, [state.name])

   return (
      <ComboProductContext.Provider value={{ state, dispatch }}>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <DescriptionTunnel close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <ItemsTunnel close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={3}>
               <ProductTypeTunnel close={closeTunnel} open={openTunnel} />
            </Tunnel>
            <Tunnel layer={4}>
               <ProductsTunnel
                  close={closeTunnel}
                  products={products[state.meta.productType]}
               />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               <div>
                  <Input
                     label={t(address.concat("product name"))}
                     type="text"
                     name="name"
                     value={title}
                     onChange={e => setTitle(e.target.value)}
                     onBlur={e => updateName(e)}
                  />
               </div>
               <div>
                  <TextButton type="ghost" style={{ margin: '0px 10px' }}>
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
                     <Description openTunnel={openTunnel} />
                  </div>
                  <div></div>
               </StyledMeta>
               <StyledRule />
               <Items openTunnel={openTunnel} />
            </StyledBody>
         </StyledWrapper>
      </ComboProductContext.Provider>
   )
}
