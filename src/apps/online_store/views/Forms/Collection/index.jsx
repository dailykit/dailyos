import React from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Input, TextButton, Tunnels, Tunnel, useTunnel } from '@dailykit/ui'

import {
   CollectionContext,
   state as initialState,
   reducer,
} from '../../../context/collection'
import { ChevronRight } from '../../../assets/icons'
import {
   FormHeader,
   FormHeaderInputs,
   FormHeaderActions,
   Breadcrumbs,
   FormBody,
} from './styled'
import { Categories, Configuration } from './components'
import { ProductsTunnel } from './tunnels'
import {
   CREATE_COLLECTION,
   PRODUCTS,
   UPDATE_COLLECTION,
} from '../../../graphql'

const CollectionForm = () => {
   const [state, dispatch] = React.useReducer(reducer, initialState)
   const [products, setProducts] = React.useState([])
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   // Queries and Mutations
   useQuery(PRODUCTS, {
      onCompleted: data => {
         setProducts(data.products)
      },
   })
   const [createCollection] = useMutation(CREATE_COLLECTION, {
      onCompleted: data => {
         dispatch({
            type: 'ID',
            payload: { id: data.createMenuCollection.menuCollection.id },
         })
         console.log('Saved: ', data.createMenuCollection.menuCollection)
      },
   })
   const [updateCollection] = useMutation(UPDATE_COLLECTION, {
      onCompleted: data => {
         console.log('UPDATED: ', data)
      },
   })

   // Handlers
   const save = () => {
      let data = state
      delete data.current
      delete data.stage
      // Cleaning data
      data.categories = data.categories.map(category => {
         const products = category.products.map(product => product.id)
         return {
            title: category.title,
            products,
         }
      })
      console.log(data)
      updateCollection({
         variables: {
            input: data,
         },
      })
   }

   return (
      <CollectionContext.Provider value={{ state, dispatch }}>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <ProductsTunnel close={closeTunnel} products={products} />
            </Tunnel>
         </Tunnels>
         <FormHeader>
            <FormHeaderInputs>
               <Input
                  label="Collection Name"
                  type="text"
                  name="title"
                  value={state.title}
                  onChange={e =>
                     dispatch({
                        type: 'TITLE',
                        payload: { value: e.target.value },
                     })
                  }
                  onBlur={() => {
                     if (!state.id)
                        createCollection({ variables: { title: state.title } })
                  }}
               />
               <Breadcrumbs>
                  <span className={state.stage >= 1 ? 'active' : ''}>
                     Add Products
                  </span>
                  <span>
                     <ChevronRight />
                  </span>
                  <span className={state.stage >= 2 ? 'active' : ''}>
                     Configure Shop
                  </span>
               </Breadcrumbs>
            </FormHeaderInputs>
            <FormHeaderActions>
               <TextButton type="ghost"> Open in editor </TextButton>
               <TextButton type="outline" onClick={save}>
                  Save and Exit
               </TextButton>
               <TextButton
                  type="solid"
                  onClick={() => dispatch({ type: 'NEXT_STAGE' })}
               >
                  Proceed
               </TextButton>
            </FormHeaderActions>
         </FormHeader>
         <FormBody>
            {state.stage === 1 ? (
               <Categories openTunnel={openTunnel} />
            ) : (
               <Configuration />
            )}
         </FormBody>
      </CollectionContext.Provider>
   )
}

export default CollectionForm
