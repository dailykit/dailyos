import React, { useEffect, useRef } from 'react'
import { useMutation, useSubscription, useLazyQuery } from '@apollo/react-hooks'
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
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
   Spacer,
   ComboButton,
} from '@dailykit/ui'
import {
   Serving,
   CalCount,
   FoodCost,
   Yield,
   ChefPay,
   VisibiltyOn,
   VisibiltyOff,
   AutoGenerate,
   NextArrow,
   PreviousArrow,
} from '../../../../../assets/icons'
import { toast } from 'react-toastify'
import {
   StyledCardEven,
   Heading,
   StyledCardIngredient,
   SatchetCard,
   StyledButton,
} from './styles'
import {
   Tooltip,
   InlineLoader,
   DragNDrop,
} from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import {
   DELETE_SIMPLE_RECIPE_YIELD,
   S_PROCESSINGS,
   UPDATE_SIMPLE_RECIPE_INGREDIENT_PROCESSING,
   CREATE_PROCESSINGS,
   UPSERT_MASTER_PROCESSING,
   S_SACHETS,
   UPSERT_MASTER_UNIT,
   CREATE_SACHET,
   UPSERT_SIMPLE_RECIPE_YIELD_SACHET,
   UPDATE_SIMPLE_RECIPE_YIELD_SACHET,
   DELETE_SIMPLE_RECIPE_INGREDIENT_PROCESSINGS,
   DERIVE_SACHETS_FROM_BASE_YIELD,
} from '../../../../../graphql'
import { ServingsTunnel, IngredientsTunnel } from '../../tunnels'
import { RecipeContext } from '../../../../../context/recipe'
import { Button } from 'react-scroll'
import { constant, stubFalse } from 'lodash'

const Servings = ({ state }) => {
   const { recipeState } = React.useContext(RecipeContext)
   const [ingredientProcessings, setIngredientProcessings] = React.useState([])

   let [search] = React.useState('')
   let [ingredientStateId, setingredientStateId] = React.useState(0)
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
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

   const [sachets, setSachets] = React.useState([])
   let [slipname, setslipname] = React.useState('')

   // Query
   const { loadingSachets } = useSubscription(S_SACHETS, {
      variables: {
         where: {
            isArchived: { _eq: false },
         },
      },
      onSubscriptionData: data => {
         const updatedSachets = data.subscriptionData.data.ingredientSachets.map(
            sachet => ({
               ...sachet,
               title: `${sachet.quantity} ${sachet.unit}`,
            })
         )

         setSachets([...updatedSachets])
      },
   })
   //console.log(sachets, 'Adrish updated sachets')
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

   const [upsertMasterProcessing] = useMutation(UPSERT_MASTER_PROCESSING, {
      onCompleted: data => {
         createProcessing({
            variables: {
               procs: [
                  {
                     ingredientId: ingredientStateId,
                     processingName:
                        data.createMasterProcessing.returning[0].name,
                  },
               ],
            },
         })
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const [createProcessing] = useMutation(CREATE_PROCESSINGS, {
      onCompleted: data => {
         //console.log(data)
         const processing = {
            id: data.createIngredientProcessing.returning[0].id,
            title: data.createIngredientProcessing.returning[0].processingName,
         }
         // add(processing)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const [upsertMasterUnit] = useMutation(UPSERT_MASTER_UNIT, {
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })
   const [createSachet] = useMutation(CREATE_SACHET, {
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const [upsertRecipeYieldSachet] = useMutation(
      UPSERT_SIMPLE_RECIPE_YIELD_SACHET,
      {
         onCompleted: () => {
            toast.success('Sachet added!')
            closeTunnel(3)
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   const [deleteSimpleRecipeIngredientProcessings] = useMutation(
      DELETE_SIMPLE_RECIPE_INGREDIENT_PROCESSINGS,
      {
         onCompleted: () => {
            toast.success('Ingredient deleted!')
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )
   const retryInfo = React.useRef(null)

   const [
      deriveSachetsFromBaseYield,
      { loading: generating, refetch },
   ] = useLazyQuery(DERIVE_SACHETS_FROM_BASE_YIELD, {
      onCompleted: data => {
         const [response] = data.simpleRecipe_deriveIngredientSachets
         console.log({ response })
         if (response && response.success) {
            toast.success(response.message)
         } else {
            toast.warn('Something is not right!')
         }
      },
      onError: error => {
         retryInfo.current = {
            ...retryInfo.current,
            tries: 1 + retryInfo.current.tries,
         }
         if (
            error.message ===
               'GraphQL error: invalid input syntax for type json' &&
            retryInfo.current.tries < 15
         ) {
            console.log('Retrying...')
            refetch({
               variables: {
                  args: {
                     sourceyieldid: retryInfo.current.recipeYield.baseYieldId,
                     targetyieldid: retryInfo.current.recipeYield.id,
                  },
               },
            })
         } else {
            toast.error('Failed to generate sachets!')
            console.log(error)
         }
      },
      fetchPolicy: 'cache-and-network',
   })

   const options =
      state.simpleRecipeYields?.map((option, index) => {
         //console.log(option, 'Adrish option')
         const autoGenerate = recipeYield => {
            console.log({ recipeYield })
            if (recipeYield.id && recipeYield.baseYieldId) {
               retryInfo.current = {
                  recipeYield,
                  tries: 1,
               }
               deriveSachetsFromBaseYield({
                  variables: {
                     args: {
                        sourceyieldid: recipeYield.baseYieldId,
                        targetyieldid: recipeYield.id,
                     },
                  },
               })
            }
         }
         return (
            <StyledCardEven
               baseYieldId={option.baseYieldId}
               index={index}
               id={option.id}
            >
               <Serving />
               <div id="Serving">{option.yield.serving}</div>
               {option.baseYieldId ? (
                  <div id="menu">
                     <IconButton
                        type="ghost"
                        size="sm"
                        onClick={() => autoGenerate(option)}
                        isLoading={
                           generating &&
                           option.id === retryInfo.current.recipeYield.id
                        }
                     >
                        <AutoGenerate />
                     </IconButton>
                  </div>
               ) : (
                  <></>
               )}
               <div id="menu">
                  <ContextualMenu>
                     <Context
                        title="Delete"
                        handleClick={() => remove(option)}
                     ></Context>
                     {option.baseYieldId ? (
                        <Context>
                           <ComboButton
                              type="ghost"
                              size="sm"
                              onClick={() => autoGenerate(option)}
                              isLoading={
                                 generating &&
                                 option.id === retryInfo.current.recipeYield.id
                              }
                           >
                              <AutoGenerate />
                              Auto-generate
                           </ComboButton>
                        </Context>
                     ) : (
                        <></>
                     )}
                  </ContextualMenu>
               </div>

               <p> {option.yield.label} </p>
               <div id="calCount">
                  <CalCount /> 2%
               </div>
               <div id="foodCost">
                  <FoodCost /> 2$
               </div>
               <div id="yield">
                  <Yield /> 2kg
               </div>
            </StyledCardEven>
         )
      }) || []

   const ingredientsOptions =
      state.simpleRecipeIngredients?.map((option, index) => {
         //console.log(option, 'Adrish option')
         let dropDownReadOnly = true
         let sachetDisabled = false
         let optionsWithoutDescription = []
         let sachetOptions = []

         if (option.processing == null) {
            dropDownReadOnly = false
            sachetDisabled = true
         }
         const selectedOption = processing => {
            updateSimpleRecipeIngredientProcessing({
               variables: {
                  id: option.id,
                  _set: {
                     processingId: processing.id,
                     simpleRecipeId: state.id,
                  },
               },
            })
         }
         const searchedOption = searchedProcessing => {
            search = searchedProcessing

            //console.log(search, 'Adrish Search')
         }

         const quickCreateProcessing = () => {
            let processingName =
               search.slice(0, 1).toUpperCase() + search.slice(1)
            setingredientStateId(option.ingredient.id)
            //console.log(ingredientStateId, 'ingredientStateId')
            upsertMasterProcessing({
               variables: {
                  name: processingName,
               },
            })
         }
         const deleteIngredientProcessing = id => {
            const isConfirmed = window.confirm(
               'Are you sure you want to delete this ingredient?'
            )
            if (isConfirmed) {
               // TODO: add a trigger in DB to set sachet_yield records' isArchived : false - not necessary tho
               deleteSimpleRecipeIngredientProcessings({
                  variables: {
                     ids: [id],
                  },
               })
            }
         }
         let ProcessingOptions = []
         return (
            <div
               style={{
                  display: 'grid',
                  gridTemplateColumns: `238px repeat(${state.simpleRecipeYields?.length}, 160px)`,
                  gridTemplateRows: `130px)`,
               }}
            >
               <StyledCardIngredient>
                  <div id="index">{index + 1}</div>

                  <Link
                     style={{ display: 'inline-block', width: '156px' }}
                     to="#"
                  >
                     {option.ingredient.name}
                  </Link>
                  <div id="menu">
                     <ContextualMenu>
                        <Context
                           title="Delete"
                           handleClick={() =>
                              deleteIngredientProcessing(option.id)
                           }
                        ></Context>
                     </ContextualMenu>
                  </div>

                  {ingredientProcessings.map((item, index) => {
                     if (option.ingredient.id == item.ingredientId) {
                        ProcessingOptions.push({
                           id: item.id,
                           title: item.title,
                        })
                     }
                     optionsWithoutDescription = ProcessingOptions
                  })}
                  <Spacer size="7px" />
                  <div id="dropdown">
                     <Dropdown
                        type="single"
                        variant="revamp"
                        defaultOption={option.processing}
                        addOption={quickCreateProcessing}
                        options={ProcessingOptions}
                        searchedOption={searchedOption}
                        selectedOption={selectedOption}
                        readOnly={dropDownReadOnly}
                        typeName="processing"
                     />
                  </div>

                  <div id="calCountIngredient">
                     <CalCount /> 2% per saving
                  </div>
                  <div id="chefPay">
                     <ChefPay /> 2$
                  </div>
               </StyledCardIngredient>

               {state.simpleRecipeYields?.map((object, index) => {
                  sachetOptions = []
                  let search = ''
                  let loader = false
                  let defaultslipName = ''
                  let visibility = ''
                  sachets.map((item, index) => {
                     if (sachetDisabled == false) {
                        //console.log(option.processing.id, item.processingId, "Adrish Processing idss")
                        if (
                           option.processing.id ==
                              item.ingredientProcessingId &&
                           option.ingredient.id == item.ingredient.id
                        ) {
                           //console.log(item.id,"Adrish sachet idss")
                           loader = true
                           sachetOptions.push({
                              id: item.id,
                              title: item.title,
                           })
                        }
                     }
                  })
                  let defaultSachetOption = {}
                  //console.log(object , "Adrish Ingredient options")
                  option.linkedSachets.map((item, index) => {
                     if (item.simpleRecipeYield.id == object.id) {
                        loader = true
                        defaultslipName = item.slipName
                        visibility = item.isVisible
                        defaultSachetOption = {
                           id: item.ingredientSachet.id,
                           title: `${defaultSachetOption.title} ${item.ingredientSachet.quantity}`,
                        }
                     }
                     return ''
                  })

                  const quickCreateSachet = async () => {
                     if (!search.includes(' '))
                        return toast.error(
                           'Quantity and Unit should be space separated!'
                        )
                     const [quantity, unit] = search.trim().split(' ')
                     if (quantity && unit) {
                        await upsertMasterUnit({
                           variables: {
                              name: unit,
                           },
                        })
                        createSachet({
                           variables: {
                              objects: [
                                 {
                                    ingredientId: option.ingredient.id,
                                    ingredientProcessingId:
                                       option.processing.id,
                                    quantity: +quantity,
                                    unit,
                                    tracking: false,
                                 },
                              ],
                           },
                        })
                     } else {
                        toast.error('Enter a valid quantity and unit!')
                     }
                  }
                  const selectedSachetOption = sachet => {
                     upsertRecipeYieldSachet({
                        variables: {
                           yieldId: object.id,
                           ingredientProcessingRecordId: option.id,
                           ingredientSachetId: sachet.id,
                           slipName:
                              defaultslipName.length > 0
                                 ? defaultslipName
                                 : option.ingredient.name,
                        },
                     })
                  }
                  const searchedSachetOption = searchedSachet => {
                     search = searchedSachet

                     //console.log(search, 'Adrish Search')
                  }

                  //console.log(defaultSachetOption, "Adrish defaultSachetOption")
                  return (
                     <>
                        {loader == false || sachetOptions.length > 0 ? (
                           <SatchetCard index={index}>
                              <Dropdown
                                 disabled={sachetDisabled}
                                 options={sachetOptions}
                                 defaultOption={defaultSachetOption}
                                 addOption={quickCreateSachet}
                                 searchedOption={searchedSachetOption}
                                 selectedOption={selectedSachetOption}
                                 type="single"
                                 variant="revamp"
                                 typeName="sachet"
                              />
                              <Spacer size="3px" />
                              <div id="sachetDetails">
                                 <SachetDetails
                                    yieldId={object.id}
                                    ingredientProcessingRecordId={option.id}
                                    slipName={defaultslipName}
                                    isVisible={visibility}
                                    disabled={
                                       Object.keys(defaultSachetOption)
                                          .length == 0
                                          ? true
                                          : false
                                    }
                                    index={index}
                                 />
                              </div>
                           </SatchetCard>
                        ) : (
                           <SatchetCard>
                              <Skeleton />
                           </SatchetCard>
                        )}
                     </>
                  )
               })}
            </div>
         )
      }) || []
   const recipeForm = useRef(null)
   const [buttonClickRightRender, setButtonClickRightRender] = React.useState(
      false
   )
   const [buttonClickLeftRender, setButtonClickLeftRender] = React.useState(
      false
   )
   useEffect(() => {
      if (state.simpleRecipeYields?.length > 5) {
         setButtonClickRightRender(true)
      } else {
         setButtonClickRightRender(false)
         setButtonClickLeftRender(false)
      }
   }, state.simpleRecipeYields)

   
   let [buttonClickRight, setButtonClickRight] = React.useState(0)
   let [buttonClickLeft, setButtonClickLeft] = React.useState(0)

   const onButtonClickLeft = () => {
      setButtonClickLeft(++buttonClickLeft)
      console.log(buttonClickLeft, "buttonClickLeft")
      console.log(buttonClickRight, "buttonClickRight")
      recipeForm.current.scrollLeft -= 160
      if (buttonClickLeft > 0) {
         setButtonClickRightRender(true)
         
      }
      if (buttonClickLeft - buttonClickRight === 0) {
         setButtonClickLeftRender(false)
         setButtonClickRight(0)
         setButtonClickLeft(0)
      }
   }
   const onButtonClickRight = () => {
      setButtonClickRight(++buttonClickRight)
     
      recipeForm.current.scrollLeft += 160
      if (state.simpleRecipeYields.length - buttonClickRight + buttonClickLeft === 5) {
         setButtonClickRightRender(false)
         
      }
      if (buttonClickRight > 0) {
         setButtonClickLeftRender(true)
         
      }
   }

   return (
      <>
         {/* {console.log(ingredientProcessings, 'Adrish Processings')} */}
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
               <div
                  style={{
                     display: 'grid',
                     gridTemplateColumns: '30px 1038px 30px',
                  }}
               >
                  {buttonClickLeftRender ? (
                     <button
                        style={{
                           width: '30px',
                           height: '30px',
                           border: 'none',
                           background: '#FFFFFF',
                           boxShadow: '-2px 2px 6px rgba(0, 0, 0, 0.15)',
                           borderRadius: '50%',
                           marginTop: '25px',
                        }}
                        onClick={onButtonClickLeft}
                     >
                        <PreviousArrow />
                     </button>
                  ) : (
                     <div></div>
                  )}

                  <div
                     ref={recipeForm}
                     style={{
                        overflow: 'auto',
                        whiteSpace: 'nowrap',
                        overflowY: 'hidden',
                        overflowX: 'hidden',
                     }}
                  >
                     <div
                        style={{
                           display: 'grid',
                           gridTemplateColumns: `238px repeat(${state.simpleRecipeYields?.length}, 160px)`,
                        }}
                     >
                        <IconButton
                           variant="secondary"
                           onClick={() => {
                              openTunnel(1)
                           }}
                           style={{
                              width: '238px',
                              height: '85px',
                              marginTop: '0px',
                              paddingTop: '0px',
                              left: '0',
                              position: 'sticky',
                              zIndex: '+10',
                           }}
                           type="solid"
                        >
                           <PlusIcon color="#367BF5" />
                        </IconButton>

                        {options}
                     </div>
                     {loading && ingredientsOptions.length && loadingSachets ? (
                        <InlineLoader />
                     ) : (
                        <>
                           <Spacer size="40px" />
                           <DragNDrop
                              list={state.simpleRecipeIngredients}
                              droppableId="simpleRecipeIngredientsDroppableId"
                              tablename="simpleRecipe_ingredient_processing"
                              schemaname="simpleRecipe"
                           >
                              {ingredientsOptions}
                           </DragNDrop>
                        </>
                     )}

                     <Spacer size="50px" />
                     <ButtonTile
                        type="secondary"
                        text="Add Ingredient"
                        onClick={() => openingredientTunnel(1)}
                        style={{ left: '0', position: 'sticky' }}
                     />
                  </div>
                  {buttonClickRightRender && (
                     <button
                        style={{
                           width: '30px',
                           height: '30px',
                           border: 'none',
                           background: '#FFFFFF',
                           boxShadow: '-2px 2px 6px rgba(0, 0, 0, 0.15)',
                           borderRadius: '50%',
                           marginTop: '25px',
                        }}
                        onClick={onButtonClickRight}
                     >
                        <NextArrow />
                     </button>
                  )}
               </div>
            ) : (
               <ButtonTile
                  type="secondary"
                  text="Add Servings"
                  onClick={() => openTunnel(1)}
               />
            )}
         </>
      </>
   )
}

export default Servings

const SachetDetails = ({
   yieldId,
   slipName,
   ingredientProcessingRecordId,
   isVisible,
   disabled,
   index,
}) => {
   const [history, setHistory] = React.useState({
      slipName,
      isVisible,
   })
   const [name, setName] = React.useState(slipName)
   const [visibility, setVisibility] = React.useState(isVisible)

   React.useEffect(() => {
      setHistory({
         slipName,
         isVisible,
      })
      setName(slipName)
      setVisibility(isVisible)
   }, [slipName, isVisible])

   // Mutation
   const [updateSachet] = useMutation(UPDATE_SIMPLE_RECIPE_YIELD_SACHET, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: error => {
         setName(history.slipName)
         setVisibility(history.isVisible)
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const updateSlipName = () => {
      if (!name) {
         return toast.error('Slip name is required!')
      }
      updateSachet({
         variables: {
            ingredientProcessingRecordId,
            yieldId,
            set: {
               slipName: name,
            },
         },
      })
   }

   const updateVisibility = val => {
      setVisibility(val)
      updateSachet({
         variables: {
            ingredientProcessingRecordId,
            yieldId,
            set: {
               isVisible: val,
            },
         },
      })
   }

   return (
      <>
         <div style={{ width: '150px' }}>
            <Form.Text
               id={`slipName-${yieldId}`}
               name={`slipName-${yieldId}`}
               onBlur={updateSlipName}
               onChange={e => setName(e.target.value)}
               variant="revamp-sm"
               value={name}
               placeholder="enter slip name"
               hasError={!name}
               disabled={disabled}
            />
         </div>

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
               margin: '0px 55px 0px 2px',
               letterSpacing: '0.32px',
               padding: '1px 5px 2.5px 5px',
               color: '#FFFFFF',
            }}
         >
            <FoodCost /> 2$
         </div>
         {disabled ? (
            <></>
         ) : visibility ? (
            <StyledButton
               index={index}
               onClick={() => updateVisibility(!visibility)}
            >
               <VisibiltyOn />
            </StyledButton>
         ) : (
            <StyledButton
               index={index}
               onClick={() => updateVisibility(!visibility)}
            >
               <VisibiltyOff />
            </StyledButton>
         )}
      </>
   )
}
