import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Link } from 'react-router-dom'
import {
   ButtonTile,
   Flex,
   Select,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
   PlusIcon,
   IconButton,
   ContextualMenu,
   Context,
   Dropdown,
   Form,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import {
   Serving,
   CalCount,
   FoodCost,
   Yield,
   ChefPay,
} from '../../../../../assets/icons'
import {
   StyledCardEven,
   Heading,
   StyledCardIngredient,
   SatchetCard,
} from './styles'
import { Tooltip, InlineLoader } from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import { DELETE_SIMPLE_RECIPE_YIELD, S_PROCESSINGS, UPDATE_SIMPLE_RECIPE_INGREDIENT_PROCESSING, UPSERT_MASTER_PROCESSING } from '../../../../../graphql'
import { ServingsTunnel, IngredientsTunnel } from '../../tunnels'
import { RecipeContext } from '../../../../../context/recipe'

const Servings = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const { recipeState } = React.useContext(RecipeContext)
   const [ingredientProcessings, setIngredientProcessings] = React.useState([])
   let [optionsWithoutDescription] = React.useState([])
   
   const [
      ingredientsTunnel,
      openingredientTunnel,
      closeingredientTunnel,
   ] = useTunnel(2)

   const { loading } = useSubscription(S_PROCESSINGS, {
      variables: {
         where: {
            isArchived: { _eq: false },
         },
      },
      onSubscriptionData: data => {
         const processings = data.subscriptionData.data.ingredientProcessings
         setIngredientProcessings(processings)
      },
   })

   // Mutation
   const [deleteYield] = useMutation(DELETE_SIMPLE_RECIPE_YIELD, {
      onCompleted: () => {
         toast.success('Deleted!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const [updateSimpleRecipeIngredientProcessing] = useMutation(
      UPDATE_SIMPLE_RECIPE_INGREDIENT_PROCESSING,
      {
         onCompleted: () => {
            toast.success('Processing added!')
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   // Handlers
   const remove = serving => {
      const confirmed = window.confirm(
         `Are you sure you want to delete serving - ${serving.yield.serving}?`
      )
      if (confirmed)
         deleteYield({
            variables: {
               id: serving.id,
            },
         })
   }

   const options =
      state.simpleRecipeYields?.map((option, index) => {
         console.log(option, 'Adrish option')

         return (
            <th>
               <StyledCardEven index={index} id={option.id}>
                  <Serving />
                  <div
                     style={{
                        paddingLeft: '5px',
                        display: 'inline-block',
                        width: '65px',
                     }}
                  >
                     {option.yield.serving}
                  </div>
                  <div style={{ textAlign: 'right', display: 'inline-block' }}>
                     <ContextualMenu
                        style={{ margin: '0px', padding: '0px', width: '10px' }}
                     >
                        <Context
                           title="Delete"
                           handleClick={() => remove(option)}
                        ></Context>
                     </ContextualMenu>
                  </div>
                  <br />
                  <p
                     style={{
                        fontFamily: 'Roboto',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: '12px',
                        lineHeight: '10px',
                     }}
                  >
                     {' '}
                     {option.yield.label}{' '}
                  </p>
                  <div
                     style={{
                        display: 'inline-block',
                        width: '36px',
                        height: '16px',
                        background: '#F6C338',
                        borderRadius: '40px',
                        fontFamily: 'Roboto',
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        lineHeight: '16px',
                        margin: '0px 2px 0px 0px',
                        letterSpacing: '0.32px',
                        padding: '1px 0px 2.5px 5px',
                        color: '#FFFFFF',
                     }}
                  >
                     <CalCount /> 2%
                  </div>
                  <div
                     style={{
                        display: 'inline-block',
                        width: '36px',
                        height: '16px',
                        background: '#8AC03B',
                        borderRadius: '40px',
                        fontFamily: 'Roboto',
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        lineHeight: '16px',
                        margin: '0px 2px 0px 2px',
                        letterSpacing: '0.32px',
                        padding: '1px 5px 2.5px 5px',
                        color: '#FFFFFF',
                     }}
                  >
                     <FoodCost /> 2$
                  </div>
                  <div
                     style={{
                        display: 'inline-block',
                        width: '44px',
                        height: '16px',
                        background: '#555B6E',
                        borderRadius: '40px',
                        fontFamily: 'Roboto',
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        lineHeight: '16px',
                        margin: '0px 0px 0px 2px',
                        letterSpacing: '0.32px',
                        padding: '1px 5px 2.5px 5px',
                        color: '#FFFFFF',
                     }}
                  >
                     <Yield /> 2kg
                  </div>
               </StyledCardEven>
            </th>
         )
      }) || []

   const ingredients_options =
      state.simpleRecipeIngredients?.map((option, index) => {
         console.log(option, 'Adrish ingredients_option')
         const selectedOption = processing => {
            updateSimpleRecipeIngredientProcessing({
               variables: {
                  id: processing.id,
                  _set: {
                     ingredientId: option.ingredient.id,
                     simpleRecipeId: state.id
                  } 
               }
            })
         }
         const searchedOption = option => console.log(option)
         let ProcessingOptions = []
         return (
            <tr>
               <td>
                  <StyledCardIngredient>
                     <div
                        style={{
                           display: 'inline-block',
                           width: '27px',
                           height: '27px',
                           borderRadius: '50%',
                           background: '#F4F4F4',
                           margin: '0px 18px 0px 0px',
                           fontFamily: 'Roboto',
                           fontStyle: 'normal',
                           fontWeight: 'bold',
                           fontSize: '12px',
                           lineHeight: '16px',
                           color: '#919699',
                           letterSpacing: '0.32px',
                           padding: '7px 0px 0px 0px',
                           textAlign: 'center',
                        }}
                     >
                        {index + 1}
                     </div>

                     <Link to="#">{option.ingredient.name}</Link>

                     {ingredientProcessings.map((item, index) => {
                        if (option.ingredient.id == item.ingredientId) {
                           ProcessingOptions.push({
                              id: item.id,
                              title: item.title,
                           })
                        }
                        optionsWithoutDescription = ProcessingOptions
                     })}
                     <div style={{ padding: '0px 0px 12px 45px' }}>
                        <Dropdown
                           type="single"
                           variant="revamp"
                           defaultOption={option.processing}
                           addOption={() => console.log('Item added')}
                           options={optionsWithoutDescription}
                           searchedOption={searchedOption}
                           selectedOption={selectedOption}
                           typeName="processing"
                        />
                     </div>
                     <div
                        style={{ width: '181px', padding: '0px 0px 10px 45px' }}
                     >
                        <Form.Group>
                           <Form.Text
                              id="username"
                              name="username"
                              placeholder="enter slip name"
                              variant="revamp-sm"
                           />
                        </Form.Group>
                     </div>
                     <div
                        style={{
                           display: 'inline-block',
                           width: '99px',
                           height: '18px',
                           background: '#F6C338',
                           borderRadius: '40px',
                           fontFamily: 'Roboto',
                           fontStyle: 'normal',
                           fontWeight: 'bold',
                           fontSize: '11px',
                           lineHeight: '16px',
                           margin: '0px 2px 0px 45px',
                           letterSpacing: '0.32px',
                           padding: '1px 0px 2.5px 5px',
                           color: '#FFFFFF',
                        }}
                     >
                        <CalCount /> 2% per saving
                     </div>
                     <div
                        style={{
                           display: 'inline-block',
                           width: '36px',
                           height: '16px',
                           background: '#FF5A52',
                           borderRadius: '40px',
                           fontFamily: 'Roboto',
                           fontStyle: 'normal',
                           fontWeight: 'bold',
                           fontSize: '11px',
                           lineHeight: '16px',
                           margin: '0px 2px 0px 0px',
                           letterSpacing: '0.32px',
                           padding: '1px 0px 2.5px 5px',
                           color: '#FFFFFF',
                        }}
                     >
                        <ChefPay /> 2$
                     </div>
                  </StyledCardIngredient>
               </td>
               {state.simpleRecipeYields?.map((option, index) => {
                  return (
                     <td>
                        <SatchetCard index={index}>
                           <Dropdown
                              type="single"
                              variant="revamp"
                              typeName="sachet"
                           />
                        </SatchetCard>
                     </td>
                  )
               })}
            </tr>
         )
      }) || []

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="sm">
               <ServingsTunnel state={state} closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={ingredientsTunnel}>
            <Tunnel layer={1} size="sm">
               <IngredientsTunnel
                  state={state}
                  closeTunnel={closeingredientTunnel}
               />
            </Tunnel>
         </Tunnels>
         <Flex container alignItems="center">
            <Heading>Servings & Ingredients</Heading>
            <Tooltip identifier="recipe_servings" />
         </Flex>

         {options.length ? (
            <>
               <table style={{ textAlign: 'left' }}>
                  <tr>
                     <th>
                        <IconButton
                           variant="secondary"
                           onClick={() => {
                              openTunnel(1)
                           }}
                           style={{
                              display: 'inline-block',
                              width: '226px',
                              height: '74px',
                              marginTop: '0px',
                              paddingTop: '0px',
                           }}
                           type="solid"
                        >
                           <PlusIcon color="#367BF5" />
                        </IconButton>
                     </th>
                     {options}
                  </tr>

                  {loading && ingredients_options.length ? <InlineLoader /> : ingredients_options}
               </table>
               <br />
               <ButtonTile
                  type="secondary"
                  text="Add Ingredient"
                  onClick={() => openingredientTunnel(1)}
               />
            </>
         ) : (
            <ButtonTile
               type="secondary"
               text="Add Servings"
               onClick={() => openTunnel(1)}
            />
         )}
      </>
   )
}

export default Servings
