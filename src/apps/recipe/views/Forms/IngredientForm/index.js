import React from 'react'
import { toast } from 'react-toastify'
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
import { CloseIcon, TickIcon } from '../../../assets/icons'

import {
   IngredientContext,
   reducers,
   state as initialState,
} from '../../../context/ingredient'
import { Context } from '../../../context/tabs'
import { S_INGREDIENT, UPDATE_INGREDIENT } from '../../../graphql'
import {
   InputWrapper,
   StyledHeader,
   MasterSettings,
   InputGroup,
   StyledMain,
} from '../styled'
import { Processings, Stats } from './components'
import {
   EditItemTunnel,
   EditLabelTemplateTunnel,
   EditModeTunnel,
   EditPackagingTunnel,
   EditSachetTunnel,
   EditStationTunnel,
   ItemTunnel,
   LabelTemplateTunnel,
   NutritionTunnel,
   PackagingTunnel,
   ProcessingsTunnel,
   SachetTunnel,
   PhotoTunnel,
} from './tunnels'
import StationTunnel from './tunnels/StationTunnel'

const IngredientForm = () => {
   const { state: tabs, dispatch } = React.useContext(Context)
   const [ingredientState, ingredientDispatch] = React.useReducer(
      reducers,
      initialState
   )

   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [
      processingTunnels,
      openProcessingTunnel,
      closeProcessingTunnel,
   ] = useTunnel(1)
   const [sachetTunnels, openSachetTunnel, closeSachetTunnel] = useTunnel(5)
   const [
      editSachetTunnels,
      openEditSachetTunnel,
      closeEditSachetTunnel,
   ] = useTunnel(7)

   const [title, setTitle] = React.useState('')
   const [category, setCategory] = React.useState('')
   const [state, setState] = React.useState({})

   // Subscriptions
   const { loading } = useSubscription(S_INGREDIENT, {
      variables: {
         id: tabs.current.id,
      },
      onSubscriptionData: data => {
         setState(data.subscriptionData.data.ingredient)
         setTitle(data.subscriptionData.data.ingredient.name)
         setCategory(data.subscriptionData.data.ingredient.category || '')
      },
      onError: error => {
         console.log(error)
      },
   })

   // Mutations
   const [updateIngredient] = useMutation(UPDATE_INGREDIENT, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: () => {
         toast.error('Error')
      },
   })

   // Handlers
   const updateName = async () => {
      if (title) {
         const { data } = await updateIngredient({
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
               payload: {
                  oldTitle: tabs.current.title,
                  title,
               },
            })
         }
      }
   }
   const updateCategory = () => {
      if (category) {
         updateIngredient({
            variables: {
               id: state.id,
               set: {
                  category,
               },
            },
         })
      }
   }
   const togglePublish = val => {
      if (val && !state.isValid.status) {
         toast.error('Ingredient should be valid!')
      } else {
         updateIngredient({
            variables: {
               id: state.id,
               set: {
                  isPublished: val,
               },
            },
         })
      }
   }

   if (loading) return <Loader />

   return (
      <IngredientContext.Provider
         value={{ ingredientState, ingredientDispatch }}
      >
         <>
            {/* Tunnels */}
            <Tunnels tunnels={tunnels}>
               <Tunnel layer={1}>
                  <PhotoTunnel state={state} closeTunnel={closeTunnel} />
               </Tunnel>
            </Tunnels>
            <Tunnels tunnels={processingTunnels}>
               <Tunnel layer={1}>
                  <ProcessingsTunnel
                     state={state}
                     closeTunnel={closeProcessingTunnel}
                  />
               </Tunnel>
            </Tunnels>
            <Tunnels tunnels={sachetTunnels}>
               <Tunnel layer={1} size="lg">
                  <SachetTunnel
                     state={state}
                     openTunnel={openSachetTunnel}
                     closeTunnel={closeSachetTunnel}
                  />
               </Tunnel>
               <Tunnel layer={2}>
                  <StationTunnel
                     openTunnel={openSachetTunnel}
                     closeTunnel={closeSachetTunnel}
                  />
               </Tunnel>
               <Tunnel layer={3}>
                  <ItemTunnel closeTunnel={closeSachetTunnel} />
               </Tunnel>
               <Tunnel layer={4}>
                  <PackagingTunnel closeTunnel={closeSachetTunnel} />
               </Tunnel>
               <Tunnel layer={5}>
                  <LabelTemplateTunnel closeTunnel={closeSachetTunnel} />
               </Tunnel>
            </Tunnels>
            <Tunnels tunnels={editSachetTunnels}>
               <Tunnel layer={1}>
                  <EditSachetTunnel
                     state={state}
                     closeTunnel={closeEditSachetTunnel}
                  />
               </Tunnel>
               <Tunnel layer={2} size="lg">
                  <EditModeTunnel
                     state={state}
                     closeTunnel={closeEditSachetTunnel}
                     openTunnel={openEditSachetTunnel}
                  />
               </Tunnel>
               <Tunnel layer={3}>
                  <EditStationTunnel closeTunnel={closeEditSachetTunnel} />
               </Tunnel>
               <Tunnel layer={4}>
                  <EditItemTunnel closeTunnel={closeEditSachetTunnel} />
               </Tunnel>
               <Tunnel layer={5}>
                  <EditPackagingTunnel closeTunnel={closeEditSachetTunnel} />
               </Tunnel>
               <Tunnel layer={6}>
                  <EditLabelTemplateTunnel
                     closeTunnel={closeEditSachetTunnel}
                  />
               </Tunnel>
               <Tunnel layer={7}>
                  <NutritionTunnel
                     state={state}
                     closeTunnel={closeEditSachetTunnel}
                  />
               </Tunnel>
            </Tunnels>
            <StyledHeader>
               <InputGroup>
                  <InputWrapper>
                     <Input
                        type="text"
                        label="Ingredient Name"
                        name="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        onBlur={updateName}
                     />
                  </InputWrapper>
                  <InputWrapper>
                     <Input
                        type="text"
                        label="Ingredient Category"
                        name="category"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        onBlur={updateCategory}
                     />
                  </InputWrapper>
               </InputGroup>
               <MasterSettings>
                  <div>
                     {state.isValid?.status ? (
                        <>
                           <TickIcon color="#00ff00" stroke={2} />
                           <Text as="p">All good!</Text>
                        </>
                     ) : (
                        <>
                           <CloseIcon color="#ff0000" />
                           <Text as="p">{state.isValid?.error}</Text>
                        </>
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
            <StyledMain>
               <Stats state={state} openTunnel={openTunnel} />
               <Processings
                  state={state}
                  openProcessingTunnel={openProcessingTunnel}
                  openEditSachetTunnel={openEditSachetTunnel}
                  openSachetTunnel={openSachetTunnel}
               />
            </StyledMain>
         </>
      </IngredientContext.Provider>
   )
}

export default IngredientForm
