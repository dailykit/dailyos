import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   ButtonTile,
   Collapsible,
   Spacer,
   ComboButton,
   Flex,
   HorizontalTab,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
   HorizontalTabs,
   IconButton,
   PlusIcon,
   SectionTab,
   SectionTabList,
   SectionTabPanel,
   SectionTabPanels,
   SectionTabs,
   Text,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Recommendations } from '..'
import {
   DragNDrop,
   OperationConfig,
   Tooltip,
} from '../../../../../../../../shared/components'
import { currencyFmt, logger } from '../../../../../../../../shared/utils'
import { DeleteIcon, EditIcon, EyeIcon } from '../../../../../../assets/icons'
import { ModifiersContext } from '../../../../../../context/product/modifiers'
import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'
import {
   DELETE_SIMPLE_RECIPE_PRODUCT_OPTIONS,
   STORE_SETTINGS,
   UPDATE_SIMPLE_RECIPE_PRODUCT,
   UPDATE_SIMPLE_RECIPE_PRODUCT_OPTION,
} from '../../../../../../graphql'
import {
   ModifierFormTunnel,
   ModifierModeTunnel,
   ModifierOptionsTunnel,
   ModifierPhotoTunnel,
   ModifierTemplatesTunnel,
   ModifierTypeTunnel,
   PriceConfigurationTunnel,
   RecipeTunnel,
} from '../../tunnels'
import { ItemInfo, Modifier, StyledProductOption } from './styled'
import { TickIcon } from '../../../../../../../../shared/assets/icons'

const address =
   'apps.menu.views.forms.product.simplerecipeproduct.components.recipe.'

export default function Recipe({ state }) {
   const { t } = useTranslation()
   const { productState, productDispatch } = React.useContext(
      SimpleProductContext
   )
   const { modifiersDispatch } = React.useContext(ModifiersContext)

   const opConfigInvokedBy = React.useRef('')
   const modifierOpConfig = React.useRef(undefined)
   const [foodCostPercent, setFoodCostPercent] = React.useState({
      lowerLimit: 0,
      upperLimit: 10,
   })

   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [priceTunnels, openPriceTunnel, closePriceTunnel] = useTunnel(1)
   const [
      modifiersTunnel,
      openModifiersTunnel,
      closeModifiersTunnel,
   ] = useTunnel(6)
   const [
      operationConfigTunnels,
      openOperationConfigTunnel,
      closeOperationConfigTunnel,
   ] = useTunnel(4)

   // Subscription
   useSubscription(STORE_SETTINGS, {
      variables: {
         type: 'sales',
      },
      onSubscriptionData: data => {
         if (data.subscriptionData.data.storeSettings.length) {
            const { value } = data.subscriptionData.data.storeSettings.find(
               setting => setting.identifier === 'Food Cost Percent'
            )
            setFoodCostPercent(value)
         }
      },
   })

   // Mutation
   const [updateProduct] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT, {
      onCompleted: () => {
         toast.success('Default set!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })
   const [updateProductOption] = useMutation(
      UPDATE_SIMPLE_RECIPE_PRODUCT_OPTION,
      {
         onCompleted: () => {
            toast.success('Updated!')
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )
   const [deleteOptions] = useMutation(DELETE_SIMPLE_RECIPE_PRODUCT_OPTIONS, {
      variables: {
         ids: state.simpleRecipeProductOptions?.map(option => option.id),
      },
      onCompleted: () => {
         toast.success('Product options deleted!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })
   const [removeRecipe] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT, {
      variables: {
         id: state.id,
         set: {
            simpleRecipeId: null,
            default: null,
         },
      },
      onCompleted: () => {
         toast.success('Recipe removed!')
         deleteOptions()
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   // Handlers
   const remove = () => {
      if (window.confirm('Do you want to remove this recipe?')) {
         removeRecipe()
      }
   }
   const changeDefault = option => {
      if (option.isActive) {
         if (option.id !== state.default) {
            updateProduct({
               variables: {
                  id: state.id,
                  set: {
                     default: option.id,
                  },
               },
            })
         }
      } else {
         toast.error('Option is hidden!')
      }
   }
   const editOption = option => {
      productDispatch({
         type: 'EDIT',
         payload: option,
      })
      openPriceTunnel(1)
   }
   const removeModifier = id => {
      updateProductOption({
         variables: {
            id,
            set: {
               modifierId: null,
            },
         },
      })
   }
   const editModifier = modifier => {
      console.log(modifier)
      modifiersDispatch({
         type: 'POPULATE',
         payload: { modifier },
      })
      openModifiersTunnel(2)
   }
   const saveOperationConfig = config => {
      if (opConfigInvokedBy.current === 'option') {
         updateProductOption({
            variables: {
               id: productState.optionId,
               set: {
                  operationConfigId: config.id,
               },
            },
         })
      }
      if (opConfigInvokedBy.current === 'modifier') {
         modifierOpConfig.current = config
      }
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <RecipeTunnel state={state} close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={priceTunnels}>
            <Tunnel layer={1}>
               <PriceConfigurationTunnel
                  state={state}
                  close={closePriceTunnel}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={modifiersTunnel}>
            <Tunnel layer={1}>
               <ModifierModeTunnel
                  open={openModifiersTunnel}
                  close={closeModifiersTunnel}
               />
            </Tunnel>
            <Tunnel layer={2}>
               <ModifierFormTunnel
                  open={openModifiersTunnel}
                  close={closeModifiersTunnel}
                  openOperationConfigTunnel={value => {
                     opConfigInvokedBy.current = 'modifier'
                     openOperationConfigTunnel(value)
                  }}
                  modifierOpConfig={modifierOpConfig.current}
               />
            </Tunnel>
            <Tunnel layer={3}>
               <ModifierTypeTunnel
                  open={openModifiersTunnel}
                  close={closeModifiersTunnel}
               />
            </Tunnel>
            <Tunnel layer={4}>
               <ModifierOptionsTunnel close={closeModifiersTunnel} />
            </Tunnel>
            <Tunnel layer={5}>
               <ModifierPhotoTunnel close={closeModifiersTunnel} />
            </Tunnel>
            <Tunnel layer={6}>
               <ModifierTemplatesTunnel close={closeModifiersTunnel} />
            </Tunnel>
         </Tunnels>
         <OperationConfig
            tunnels={operationConfigTunnels}
            openTunnel={openOperationConfigTunnel}
            closeTunnel={closeOperationConfigTunnel}
            onSelect={saveOperationConfig}
         />
         {state.simpleRecipe ? (
            <SectionTabs>
               <SectionTabList>
                  <SectionTab>
                     <ItemInfo>
                        {Boolean(state.simpleRecipe.image) && (
                           <img src={state.simpleRecipe.image} />
                        )}
                        <h3>{state.simpleRecipe.name}</h3>
                        <button onClick={remove}>
                           <DeleteIcon color="#fff" />
                        </button>
                     </ItemInfo>
                  </SectionTab>
               </SectionTabList>
               <SectionTabPanels>
                  <SectionTabPanel>
                     <Text as="h1">{state.simpleRecipe.name}</Text>
                     <HorizontalTabs>
                        <HorizontalTabList>
                           <HorizontalTab>
                              <Flex container alignItems="center">
                                 Pricing
                                 <Tooltip identifier="simple_recipe_product_pricing" />
                              </Flex>
                           </HorizontalTab>
                           <HorizontalTab>
                              <Flex container alignItems="center">
                                 Recommendations
                                 <Tooltip identifier="simple_recipe_product_recommendations" />
                              </Flex>
                           </HorizontalTab>
                        </HorizontalTabList>
                        <HorizontalTabPanels>
                           <HorizontalTabPanel>
                              <Text as="h4">Meal Kit Servings</Text>
                              <Spacer size="8px" />
                              <DragNDrop
                                 list={state.simpleRecipeProductOptions.filter(
                                    option => option.type === 'mealKit'
                                 )}
                                 droppableId="simpleRecipeProductOptionMealKitDroppableId"
                                 tablename="simpleRecipeProductOption"
                                 schemaname="products"
                              >
                                 {state.simpleRecipeProductOptions
                                    .filter(option => option.type === 'mealKit')
                                    .map((option, i) => (
                                       <Collapsible
                                          key={option.id}
                                          isDraggable
                                          title={`Serves ${option.simpleRecipeYield.yield.serving}`}
                                          head={
                                             <OptionHead
                                                editAction={() =>
                                                   editOption(option)
                                                }
                                                isDefault={
                                                   option.id === state.default
                                                }
                                                option={option}
                                                makeDefault={() =>
                                                   changeDefault(option)
                                                }
                                             />
                                          }
                                          body={
                                             <OptionBody
                                                addModifier={() => {
                                                   modifiersDispatch({
                                                      type: 'META',
                                                      payload: {
                                                         name: 'optionId',
                                                         value: option.id,
                                                      },
                                                   })
                                                   openModifiersTunnel(1)
                                                }}
                                                addOpConfig={() => {
                                                   productDispatch({
                                                      type: 'OPTION_ID',
                                                      payload: {
                                                         optionId: option.id,
                                                      },
                                                   })
                                                   opConfigInvokedBy.current =
                                                      'option'
                                                   openOperationConfigTunnel(1)
                                                }}
                                                editModifier={() =>
                                                   editModifier(option.modifier)
                                                }
                                                editOpConfig={() => {
                                                   productDispatch({
                                                      type: 'OPTION_ID',
                                                      payload: {
                                                         optionId: option.id,
                                                      },
                                                   })
                                                   opConfigInvokedBy.current =
                                                      'option'
                                                   openOperationConfigTunnel(1)
                                                }}
                                                foodCostPercent={
                                                   foodCostPercent
                                                }
                                                removeModifier={() =>
                                                   removeModifier(option.id)
                                                }
                                                option={option}
                                             />
                                          }
                                       />
                                    ))}
                              </DragNDrop>
                              <Spacer size="16px" />
                              <Text as="h4">Ready To Eat Servings</Text>
                              <Spacer size="8px" />
                              <DragNDrop
                                 list={state.simpleRecipeProductOptions.filter(
                                    option => option.type === 'readyToEat'
                                 )}
                                 droppableId="simpleRecipeProductOptionReadyToEatDroppableId"
                                 tablename="simpleRecipeProductOption"
                                 schemaname="products"
                              >
                                 {state.simpleRecipeProductOptions
                                    .filter(
                                       option => option.type === 'readyToEat'
                                    )
                                    .map((option, i) => (
                                       <Collapsible
                                          key={option.id}
                                          isDraggable
                                          title={`Serves ${option.simpleRecipeYield.yield.serving}`}
                                          head={
                                             <OptionHead
                                                deleteAction={() =>
                                                   remove(option)
                                                }
                                                editAction={() =>
                                                   editOption(option)
                                                }
                                                isDefault={
                                                   option.id === state.default
                                                }
                                                option={option}
                                                makeDefault={() =>
                                                   changeDefault(option)
                                                }
                                             />
                                          }
                                          body={
                                             <OptionBody
                                                addModifier={() => {
                                                   modifiersDispatch({
                                                      type: 'META',
                                                      payload: {
                                                         name: 'optionId',
                                                         value: option.id,
                                                      },
                                                   })
                                                   openModifiersTunnel(1)
                                                }}
                                                addOpConfig={() => {
                                                   productDispatch({
                                                      type: 'OPTION_ID',
                                                      payload: {
                                                         optionId: option.id,
                                                      },
                                                   })
                                                   opConfigInvokedBy.current =
                                                      'option'
                                                   openOperationConfigTunnel(1)
                                                }}
                                                editModifier={() =>
                                                   editModifier(option.modifier)
                                                }
                                                editOpConfig={() => {
                                                   productDispatch({
                                                      type: 'OPTION_ID',
                                                      payload: {
                                                         optionId: option.id,
                                                      },
                                                   })
                                                   opConfigInvokedBy.current =
                                                      'option'
                                                   openOperationConfigTunnel(1)
                                                }}
                                                foodCostPercent={
                                                   foodCostPercent
                                                }
                                                removeModifier={() =>
                                                   removeModifier(option.id)
                                                }
                                                option={option}
                                             />
                                          }
                                       />
                                    ))}
                              </DragNDrop>
                           </HorizontalTabPanel>
                           <HorizontalTabPanel>
                              <Recommendations state={state} />
                           </HorizontalTabPanel>
                        </HorizontalTabPanels>
                     </HorizontalTabs>
                  </SectionTabPanel>
               </SectionTabPanels>
            </SectionTabs>
         ) : (
            <ButtonTile
               type="primary"
               size="lg"
               text={t(address.concat('add recipe'))}
               onClick={() => openTunnel(1)}
            />
         )}
      </>
   )
}

const OptionHead = ({
   deleteAction,
   editAction,
   isDefault,
   option,
   makeDefault,
}) => {
   return (
      <Flex
         container
         alignItems="center"
         justifyContent="space-between"
         width="100%"
      >
         <Flex container alignItems="center">
            <EyeIcon color={option.isActive ? '#00A7E1' : '#ffffff'} />
            <Spacer xAxis size="24px" />
            <Flex>
               <Text as="subtitle">Price</Text>
               <Text as="p">
                  {currencyFmt(Number(option.price[0].value) || 0)}
               </Text>
            </Flex>
            <Spacer xAxis size="24px" />
            <Flex>
               <Text as="subtitle">Discount</Text>
               <Text as="p">{option.price[0].discount}%</Text>
            </Flex>
            <Spacer xAxis size="24px" />
            <Flex>
               <Text as="subtitle">Discounted Price</Text>
               <Text as="p">
                  {currencyFmt(
                     Number(
                        parseFloat(option.price[0].value) -
                           parseFloat(option.price[0].value) *
                              (parseFloat(option.price[0].discount) / 100)
                     ).toFixed(2)
                  ) || 0}
               </Text>
            </Flex>
            <Spacer xAxis size="24px" />
            <Flex>
               <Text as="subtitle">Label</Text>
               <Text as="p">{option.simpleRecipeYield.yield.label || '-'}</Text>
            </Flex>
         </Flex>
         <Flex container alignItems="center">
            {isDefault ? (
               <TextButton disabled type="solid" size="sm">
                  Default
               </TextButton>
            ) : (
               <ComboButton type="outline" size="sm" onClick={makeDefault}>
                  <TickIcon color="#36B6E2" size={14} stroke={1.5} />
                  Make Default
               </ComboButton>
            )}
            <Spacer xAxis size="24px" />
            <IconButton type="ghost" onClick={editAction}>
               <EditIcon color="#00A7E1" />
            </IconButton>
         </Flex>
      </Flex>
   )
}

const OptionBody = ({
   addModifier,
   addOpConfig,
   editModifier,
   editOpConfig,
   foodCostPercent,
   option,
   removeModifier,
}) => {
   return (
      <Flex
         container
         alignItems="center"
         height="60px"
         margin="8px 0 0 0"
         width="100%"
      >
         <Flex container alignItems="center">
            <Flex>
               <Text as="subtitle">Recommended Price</Text>
               <Text as="p">
                  {option.cost
                     ? `${currencyFmt(
                          Number(
                             option.cost +
                                (option.cost * foodCostPercent.lowerLimit) / 100
                          ) || 0
                       )} - ${currencyFmt(
                          Number(
                             option.cost +
                                (option.cost * foodCostPercent.upperLimit) / 100
                          ) || 0
                       )}`
                     : '-'}
               </Text>
            </Flex>
            <Spacer xAxis size="60px" />
            {option.modifier ? (
               <Flex container alignItems="flex-end">
                  <Flex>
                     <Text as="subtitle">Modifier Template</Text>
                     <Text as="p">{option.modifier.name}</Text>
                  </Flex>
                  <Spacer xAxis size="16px" />
                  <IconButton type="ghost" onClick={editModifier}>
                     <EditIcon color="#00A7E1" />
                  </IconButton>
                  <Spacer xAxis size="8px" />
                  <IconButton type="ghost" onClick={removeModifier}>
                     <DeleteIcon color="#FF5A52" />
                  </IconButton>
               </Flex>
            ) : (
               <ComboButton type="ghost" size="sm" onClick={addModifier}>
                  <PlusIcon color="#36B6E2" size={14} />
                  Add Modifiers
               </ComboButton>
            )}
            <Spacer xAxis size="60px" />
            {option.operationConfig ? (
               <Flex container alignItems="flex-end">
                  <Flex>
                     <Text as="subtitle">Station</Text>
                     <Text as="p">{option.operationConfig.station.name}</Text>
                  </Flex>
                  <Spacer xAxis size="16px" />
                  <Flex>
                     <Text as="subtitle">Label Template</Text>
                     <Text as="p">
                        {option.operationConfig.labelTemplate.name}
                     </Text>
                  </Flex>
                  <Spacer xAxis size="16px" />
                  <IconButton type="ghost" onClick={editOpConfig}>
                     <EditIcon color="#00A7E1" />
                  </IconButton>
               </Flex>
            ) : (
               <ComboButton type="ghost" size="sm" onClick={addOpConfig}>
                  <PlusIcon color="#36B6E2" size={14} />
                  Add Operational Configuration
               </ComboButton>
            )}
         </Flex>
      </Flex>
   )
}
