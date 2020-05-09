import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { Input, Tunnels, Tunnel, useTunnel, Loader } from '@dailykit/ui'

import { StyledHeader, InputWrapper } from '../styled'
import { StyledMain } from './styled'
import {
   S_INGREDIENT,
   UPDATE_INGREDIENT,
   FETCH_PROCESSING_NAMES,
   FETCH_UNITS,
   FETCH_STATIONS,
   FETCH_PACKAGINGS,
   FETCH_LABEL_TEMPLATES,
   S_BULK_ITEMS,
   S_SACHET_ITEMS,
} from '../../../graphql'

import {
   state as initialState,
   reducers,
   IngredientContext,
} from '../../../context/ingredient'
import { Context } from '../../../context/tabs'

import { toast } from 'react-toastify'

import { Stats, Processings } from './components'
import {
   ProcessingsTunnel,
   SachetTunnel,
   ItemTunnel,
   PackagingTunnel,
   LabelTemplateTunnel,
   EditSachetTunnel,
   EditModeTunnel,
   EditStationTunnel,
   EditItemTunnel,
   EditPackagingTunnel,
   EditLabelTemplateTunnel,
} from './tunnels'
import StationTunnel from './tunnels/StationTunnel'

const IngredientForm = () => {
   const { state: tabs, dispatch } = React.useContext(Context)
   const [ingredientState, ingredientDispatch] = React.useReducer(
      reducers,
      initialState
   )

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   const [title, setTitle] = React.useState('')
   const [state, setState] = React.useState({})

   const [processings, setProcessings] = React.useState([])
   const [units, setUnits] = React.useState([])
   const [stations, setStations] = React.useState([])
   const [items, setItems] = React.useState({
      realTime: [],
      plannedLot: [],
   })
   const [packagings, setPackagings] = React.useState([])
   const [templates, setTemplates] = React.useState([])

   // Subscriptions
   const { loading } = useSubscription(S_INGREDIENT, {
      variables: {
         id: tabs.current.id,
      },
      onSubscriptionData: data => {
         console.log(data)
         setState(data.subscriptionData.data.ingredient)
         setTitle(data.subscriptionData.data.ingredient.name)
      },
      onError: error => {
         console.log(error)
      },
   })
   useSubscription(FETCH_PROCESSING_NAMES, {
      onSubscriptionData: data => {
         const processings = data.subscriptionData.data.masterProcessings.map(
            proc => ({ id: proc.id, title: proc.name })
         )
         setProcessings([...processings])
      },
      onError: error => {
         console.log(error)
      },
   })
   useSubscription(FETCH_UNITS, {
      onSubscriptionData: data => {
         const units = data.subscriptionData.data.units.map(unit => ({
            id: unit.id,
            title: unit.name,
         }))
         setUnits([...units])
      },
      onError: error => {
         console.log(error)
      },
   })
   useSubscription(FETCH_STATIONS, {
      onSubscriptionData: data => {
         const stations = data.subscriptionData.data.stations.map(station => ({
            id: station.id,
            title: station.name,
         }))
         setStations([...stations])
      },
      onError: error => {
         console.log(error)
      },
   })
   // Subscriptions for fetching items
   useSubscription(S_BULK_ITEMS, {
      onSubscriptionData: data => {
         const updatedItems = data.subscriptionData.data.bulkItems.map(item => {
            return {
               id: item.id,
               title: item.supplierItem.name + ' ' + item.processingName,
            }
         })
         setItems({
            ...items,
            realTime: updatedItems,
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
            plannedLot: updatedItems,
         })
      },
      onError: error => {
         console.log(error)
      },
   })
   useSubscription(FETCH_PACKAGINGS, {
      onSubscriptionData: data => {
         const packagings = data.subscriptionData.data.packaging_packaging.map(
            packaging => ({
               id: packaging.id,
               title: packaging.name,
            })
         )
         setPackagings([...packagings])
      },
      onError: error => {
         console.log(error)
      },
   })
   useSubscription(FETCH_LABEL_TEMPLATES, {
      onSubscriptionData: data => {
         const templates = data.subscriptionData.data.deviceHub_labelTemplate.map(
            template => ({
               id: template.id,
               title: template.name,
            })
         )
         setTemplates([...templates])
      },
      onError: error => {
         console.log(error)
      },
   })

   // Mutations
   const [updateIngredient] = useMutation(UPDATE_INGREDIENT, {
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
            payload: {
               oldTitle: tabs.current.title,
               title,
            },
         })
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   // Handlers

   if (loading) return <Loader />

   return (
      <IngredientContext.Provider
         value={{ ingredientState, ingredientDispatch }}
      >
         <React.Fragment>
            {/* Tunnels */}
            <Tunnels tunnels={tunnels}>
               <Tunnel layer={1}>
                  <ProcessingsTunnel
                     state={state}
                     processings={processings}
                     closeTunnel={closeTunnel}
                  />
               </Tunnel>
               <Tunnel layer={2} size="lg">
                  <SachetTunnel
                     state={state}
                     openTunnel={openTunnel}
                     closeTunnel={closeTunnel}
                     units={units}
                  />
               </Tunnel>
               <Tunnel layer={3}>
                  <StationTunnel
                     openTunnel={openTunnel}
                     closeTunnel={closeTunnel}
                     stations={stations}
                  />
               </Tunnel>
               <Tunnel layer={4}>
                  <ItemTunnel
                     closeTunnel={closeTunnel}
                     items={items[ingredientState.currentMode]}
                  />
               </Tunnel>
               <Tunnel layer={5}>
                  <PackagingTunnel
                     closeTunnel={closeTunnel}
                     packagings={packagings}
                  />
               </Tunnel>
               <Tunnel layer={6}>
                  <LabelTemplateTunnel
                     closeTunnel={closeTunnel}
                     templates={templates}
                  />
               </Tunnel>
               <Tunnel layer={7}>
                  <EditSachetTunnel
                     state={state}
                     closeTunnel={closeTunnel}
                     units={units}
                  />
               </Tunnel>
               <Tunnel layer={8} size="lg">
                  <EditModeTunnel
                     state={state}
                     closeTunnel={closeTunnel}
                     openTunnel={openTunnel}
                  />
               </Tunnel>
               <Tunnel layer={9}>
                  <EditStationTunnel
                     closeTunnel={closeTunnel}
                     stations={stations}
                  />
               </Tunnel>
               <Tunnel laayer={10}>
                  <EditItemTunnel
                     closeTunnel={closeTunnel}
                     items={items[ingredientState.currentMode]}
                  />
               </Tunnel>
               <Tunnel layer={11}>
                  <EditPackagingTunnel
                     closeTunnel={closeTunnel}
                     packagings={packagings}
                  />
               </Tunnel>
               <Tunnel layer={12}>
                  <EditLabelTemplateTunnel
                     closeTunnel={closeTunnel}
                     templates={templates}
                  />
               </Tunnel>
            </Tunnels>
            <StyledHeader>
               <InputWrapper>
                  <Input
                     type="text"
                     label="Ingredient Name"
                     name="title"
                     value={title}
                     onChange={e => setTitle(e.target.value)}
                     onBlur={updateIngredient}
                  />
               </InputWrapper>
            </StyledHeader>
            <StyledMain>
               <Stats state={state} openTunnel={openTunnel} />
               <Processings state={state} openTunnel={openTunnel} />
            </StyledMain>
         </React.Fragment>
      </IngredientContext.Provider>
   )
}

export default IngredientForm
