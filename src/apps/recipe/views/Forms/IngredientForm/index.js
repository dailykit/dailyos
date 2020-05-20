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
import { CloseIcon, TickIcon } from '../../../assets/icons'
import { toast } from 'react-toastify'
import {
   IngredientContext,
   reducers,
   state as initialState,
} from '../../../context/ingredient'
import { Context } from '../../../context/tabs'
import {
   FETCH_LABEL_TEMPLATES,
   FETCH_PACKAGINGS,
   FETCH_PROCESSING_NAMES,
   FETCH_STATIONS,
   FETCH_UNITS,
   S_BULK_ITEMS,
   S_INGREDIENT,
   S_SACHET_ITEMS,
   UPDATE_INGREDIENT,
} from '../../../graphql'
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

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   const [title, setTitle] = React.useState('')
   const [category, setCategory] = React.useState('')
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
         setState(data.subscriptionData.data.ingredient)
         setTitle(data.subscriptionData.data.ingredient.name)
         setCategory(data.subscriptionData.data.ingredient.category || '')
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
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: error => {
         console.log(error)
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
         return toast.error('Ingredient should be valid!')
      }
      updateIngredient({
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
               <Tunnel layer={13}>
                  <NutritionTunnel state={state} closeTunnel={closeTunnel} />
               </Tunnel>
               <Tunnel layer={14}>
                  <PhotoTunnel state={state} closeTunnel={closeTunnel} />
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
            <StyledMain>
               <Stats state={state} openTunnel={openTunnel} />
               <Processings state={state} openTunnel={openTunnel} />
            </StyledMain>
         </React.Fragment>
      </IngredientContext.Provider>
   )
}

export default IngredientForm
