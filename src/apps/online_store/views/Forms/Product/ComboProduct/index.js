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
   COMBO_PRODUCT,
} from '../../../../graphql'

// components
import { Description } from './components'

// tunnels
import { DescriptionTunnel } from './tunnels'

export default function ComboProduct() {
   const { state: tabs } = React.useContext(Context)
   console.log('ComboProduct -> tabs', tabs)
   const [state, dispatch] = React.useReducer(reducers, initialState)
   const [title, setTitle] = React.useState(state.name)

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

   // Queries
   useQuery(COMBO_PRODUCT, {
      variables: {
         id: tabs.current.id,
      },
      onCompleted: data => {
         const { id, name, tags, description } = data.comboProduct
         dispatch({
            type: 'SEED',
            payload: {
               name,
               tags,
               description,
               id,
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

   // Mutations
   //    const [updateComboProduct] = useMutation(UPDATE_COMBO_PRODUCT, {
   //       onCompleted: data => {
   //          console.log(data)
   //          dispatch({
   //             type: 'TITLE',
   //             payload: {
   //                value: data.updateComboProduct.returning.name,
   //             },
   //          })
   //       },
   //    })

   // Handlers
   const updateName = () => {}

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
                     onBlur={e => updateName(e)}
                  />
               </div>
               <div>
                  <TextButton type="ghost" style={{ margin: '0px 10px' }}>
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
            </StyledBody>
         </StyledWrapper>
      </ComboProductContext.Provider>
   )
}
