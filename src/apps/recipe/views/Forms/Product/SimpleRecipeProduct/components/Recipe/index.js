import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   ButtonTile,
   IconButton,
   useTunnel,
   Tunnel,
   Tunnels,
   SectionTabs,
   SectionTabList,
   SectionTab,
   SectionTabPanel,
   SectionTabPanels,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTab,
   HorizontalTabPanels,
   HorizontalTabPanel,
   Text,
   PlusIcon,
   Flex,
   TextButton,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Recommendations } from '..'
import {
   DeleteIcon,
   EditIcon,
   EyeIcon,
   AddIcon,
} from '../../../../../../assets/icons'
import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'
import {
   DELETE_SIMPLE_RECIPE_PRODUCT_OPTIONS,
   UPDATE_SIMPLE_RECIPE_PRODUCT,
   UPDATE_SIMPLE_RECIPE_PRODUCT_OPTION,
   STORE_SETTINGS,
} from '../../../../../../graphql'
import {
   RecipeTunnel,
   PriceConfigurationTunnel,
   ModifierTypeTunnel,
   ModifierModeTunnel,
   ModifierFormTunnel,
   ModifierOptionsTunnel,
   ModifierTemplatesTunnel,
   ModifierPhotoTunnel,
} from '../../tunnels'
import { ModifiersContext } from '../../../../../../context/product/modifiers'

import { ItemInfo, StyledTable, StyledWrapper, Modifier } from './styled'
import {
   OperationConfig,
   Tooltip,
} from '../../../../../../../../shared/components'
import { logger } from '../../../../../../../../shared/utils'

const address =
   'apps.online_store.views.forms.product.simplerecipeproduct.components.recipe.'

export default function Recipe({ state }) {
   const { t } = useTranslation()
   const { productState, productDispatch } = React.useContext(
      SimpleProductContext
   )
   const { modifiersDispatch } = React.useContext(ModifiersContext)

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
      updateProductOption({
         variables: {
            id: productState.optionId,
            set: {
               operationConfigId: config.id,
            },
         },
      })
   }

   return (
      <>
         <OperationConfig
            tunnels={operationConfigTunnels}
            openTunnel={openOperationConfigTunnel}
            closeTunnel={closeOperationConfigTunnel}
            onSelect={saveOperationConfig}
         />
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
                              <StyledTable>
                                 <thead>
                                    <tr>
                                       <th> </th>
                                       <th>
                                          <Flex container alignItems="center">
                                             Visibility
                                             <Tooltip identifier="simple_recipe_product_option_visibility" />
                                          </Flex>
                                       </th>
                                       <th>
                                          <Flex container alignItems="center">
                                             Default
                                             <Tooltip identifier="simple_recipe_product_option_default" />
                                          </Flex>
                                       </th>
                                       <th>
                                          <Flex container alignItems="center">
                                             Serving
                                             <Tooltip identifier="simple_recipe_product_option_serving" />
                                          </Flex>
                                       </th>
                                       <th>
                                          <Flex container alignItems="center">
                                             Recommended Price
                                             <Tooltip identifier="simple_recipe_product_option_recommended_price" />
                                          </Flex>
                                       </th>
                                       <th>
                                          <Flex container alignItems="center">
                                             Price
                                             <Tooltip identifier="simple_recipe_product_option_price" />
                                          </Flex>
                                       </th>
                                       <th>
                                          <Flex container alignItems="center">
                                             Discount
                                             <Tooltip identifier="simple_recipe_product_option_discount" />
                                          </Flex>
                                       </th>
                                       <th>
                                          <Flex container alignItems="center">
                                             Discounted Price
                                             <Tooltip identifier="simple_recipe_product_option_discounted_price" />
                                          </Flex>
                                       </th>
                                       <th>
                                          <Flex container alignItems="center">
                                             Modifiers
                                             <Tooltip identifier="simple_recipe_product_option_modifiers" />
                                          </Flex>
                                       </th>
                                       <th>
                                          <Flex container alignItems="center">
                                             Operational Configuration
                                             <Tooltip identifier="simple_recipe_product_option_opconfig" />
                                          </Flex>
                                       </th>
                                       <th> </th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {state.simpleRecipeProductOptions
                                       .filter(
                                          option => option.type === 'mealKit'
                                       )
                                       .map((option, i) => (
                                          <tr key={option.id}>
                                             <td>
                                                {i === 0 ? (
                                                   <span>
                                                      {t(
                                                         address.concat(
                                                            'meal kit'
                                                         )
                                                      )}
                                                   </span>
                                                ) : (
                                                   ''
                                                )}
                                             </td>
                                             <td
                                                style={{
                                                   textAlign: 'center',
                                                }}
                                             >
                                                <span hidden={!option.isActive}>
                                                   <EyeIcon color="#00A7E1" />
                                                </span>
                                             </td>
                                             <td
                                                style={{
                                                   textAlign: 'center',
                                                }}
                                             >
                                                <input
                                                   type="radio"
                                                   checked={
                                                      state.default ===
                                                      option.id
                                                   }
                                                   onClick={() =>
                                                      changeDefault(option)
                                                   }
                                                />
                                             </td>
                                             <td>
                                                {
                                                   option.simpleRecipeYield
                                                      .yield.serving
                                                }
                                             </td>
                                             <td>
                                                {option.cost
                                                   ? `$${
                                                        option.cost +
                                                        (option.cost *
                                                           foodCostPercent.lowerLimit) /
                                                           100
                                                     } - $${
                                                        option.cost +
                                                        (option.cost *
                                                           foodCostPercent.upperLimit) /
                                                           100
                                                     }`
                                                   : '-'}
                                             </td>
                                             <td>${option.price[0].value} </td>
                                             <td>
                                                {option.price[0].discount} %
                                             </td>
                                             <td>
                                                $
                                                {(
                                                   parseFloat(
                                                      option.price[0].value
                                                   ) -
                                                   parseFloat(
                                                      option.price[0].value
                                                   ) *
                                                      (parseFloat(
                                                         option.price[0]
                                                            .discount
                                                      ) /
                                                         100)
                                                ).toFixed(2) || ''}
                                             </td>
                                             <td>
                                                {option.modifier?.name ? (
                                                   <Modifier>
                                                      <span>
                                                         <span
                                                            tabIndex="0"
                                                            role="button"
                                                            onKeyPress={() =>
                                                               editModifier(
                                                                  option.modifier
                                                               )
                                                            }
                                                            onClick={() =>
                                                               editModifier(
                                                                  option.modifier
                                                               )
                                                            }
                                                         >
                                                            <EditIcon
                                                               color="#00A7E1"
                                                               size={14}
                                                            />
                                                         </span>
                                                         <span
                                                            tabIndex="0"
                                                            role="button"
                                                            onKeyPress={() =>
                                                               removeModifier(
                                                                  option.id
                                                               )
                                                            }
                                                            onClick={() =>
                                                               removeModifier(
                                                                  option.id
                                                               )
                                                            }
                                                         >
                                                            <DeleteIcon
                                                               color="#FF5A52"
                                                               size={14}
                                                            />
                                                         </span>
                                                      </span>
                                                      {option.modifier.name}
                                                   </Modifier>
                                                ) : (
                                                   <IconButton
                                                      type="ghost"
                                                      onClick={() => {
                                                         modifiersDispatch({
                                                            type: 'META',
                                                            payload: {
                                                               name: 'optionId',
                                                               value: option.id,
                                                            },
                                                         })
                                                         openModifiersTunnel(1)
                                                      }}
                                                   >
                                                      <PlusIcon color="#36B6E2" />
                                                   </IconButton>
                                                )}
                                             </td>
                                             <td>
                                                {option.operationConfig ? (
                                                   <Flex
                                                      container
                                                      alignItems="center"
                                                      justifyContent="space-between"
                                                   >
                                                      <Text as="p">
                                                         {`${option.operationConfig.station.name} - ${option.operationConfig.labelTemplate.name}`}
                                                      </Text>
                                                      <span
                                                         onClick={() => {
                                                            productDispatch({
                                                               type:
                                                                  'OPTION_ID',
                                                               payload: {
                                                                  optionId:
                                                                     option.id,
                                                               },
                                                            })
                                                            openOperationConfigTunnel(
                                                               1
                                                            )
                                                         }}
                                                      >
                                                         <EditIcon color="#36B6E2" />
                                                      </span>
                                                   </Flex>
                                                ) : (
                                                   <TextButton
                                                      type="ghost"
                                                      onClick={() => {
                                                         productDispatch({
                                                            type: 'OPTION_ID',
                                                            payload: {
                                                               optionId:
                                                                  option.id,
                                                            },
                                                         })
                                                         openOperationConfigTunnel(
                                                            1
                                                         )
                                                      }}
                                                   >
                                                      <PlusIcon color="#36B6E2" />
                                                   </TextButton>
                                                )}
                                             </td>
                                             <td>
                                                <IconButton
                                                   type="ghost"
                                                   onClick={() =>
                                                      editOption(option)
                                                   }
                                                >
                                                   <EditIcon color="#00A7E1" />
                                                </IconButton>
                                             </td>
                                          </tr>
                                       ))}
                                    {state.simpleRecipeProductOptions
                                       .filter(
                                          option => option.type === 'readyToEat'
                                       )
                                       .map((option, i) => (
                                          <tr key={option.id}>
                                             <td>
                                                {i === 0 ? (
                                                   <span>
                                                      {t(
                                                         address.concat(
                                                            'ready to eat'
                                                         )
                                                      )}
                                                   </span>
                                                ) : (
                                                   ''
                                                )}
                                             </td>
                                             <td
                                                style={{
                                                   textAlign: 'center',
                                                }}
                                             >
                                                <span hidden={!option.isActive}>
                                                   <EyeIcon color="#00A7E1" />
                                                </span>
                                             </td>
                                             <td
                                                style={{
                                                   textAlign: 'center',
                                                }}
                                             >
                                                <input
                                                   type="radio"
                                                   checked={
                                                      state.default ===
                                                      option.id
                                                   }
                                                   onClick={() =>
                                                      changeDefault(option)
                                                   }
                                                />
                                             </td>
                                             <td>
                                                {
                                                   option.simpleRecipeYield
                                                      .yield.serving
                                                }
                                             </td>
                                             <td>
                                                {option.cost
                                                   ? `$${
                                                        option.cost +
                                                        (option.cost *
                                                           foodCostPercent.lowerLimit) /
                                                           100
                                                     } - $${
                                                        option.cost +
                                                        (option.cost *
                                                           foodCostPercent.upperLimit) /
                                                           100
                                                     }`
                                                   : '-'}
                                             </td>
                                             <td>${option.price[0].value} </td>
                                             <td>
                                                {option.price[0].discount} %
                                             </td>
                                             <td>
                                                $
                                                {(
                                                   parseFloat(
                                                      option.price[0].value
                                                   ) -
                                                   parseFloat(
                                                      option.price[0].value
                                                   ) *
                                                      (parseFloat(
                                                         option.price[0]
                                                            .discount
                                                      ) /
                                                         100)
                                                ).toFixed(2) || ''}
                                             </td>
                                             <td>
                                                {option.modifier?.name ? (
                                                   <Modifier>
                                                      <span>
                                                         <span
                                                            tabIndex="0"
                                                            role="button"
                                                            onKeyPress={() =>
                                                               editModifier(
                                                                  option.modifier
                                                               )
                                                            }
                                                            onClick={() =>
                                                               editModifier(
                                                                  option.modifier
                                                               )
                                                            }
                                                         >
                                                            <EditIcon
                                                               color="#00A7E1"
                                                               size={14}
                                                            />
                                                         </span>
                                                         <span
                                                            tabIndex="0"
                                                            role="button"
                                                            onKeyPress={() =>
                                                               removeModifier(
                                                                  option.id
                                                               )
                                                            }
                                                            onClick={() =>
                                                               removeModifier(
                                                                  option.id
                                                               )
                                                            }
                                                         >
                                                            <DeleteIcon
                                                               color="#FF5A52"
                                                               size={14}
                                                            />
                                                         </span>
                                                      </span>
                                                      {option.modifier.name}
                                                   </Modifier>
                                                ) : (
                                                   <IconButton
                                                      type="ghost"
                                                      onClick={() => {
                                                         modifiersDispatch({
                                                            type: 'META',
                                                            payload: {
                                                               name: 'optionId',
                                                               value: option.id,
                                                            },
                                                         })
                                                         openModifiersTunnel(1)
                                                      }}
                                                   >
                                                      <PlusIcon color="#36B6E2" />
                                                   </IconButton>
                                                )}
                                             </td>
                                             <td>
                                                {option.operationConfig ? (
                                                   <Flex
                                                      container
                                                      alignItems="center"
                                                      justifyContent="space-between"
                                                   >
                                                      <Text as="p">
                                                         {`${option.operationConfig.station.name} - ${option.operationConfig.labelTemplate.name}`}
                                                      </Text>
                                                      <span
                                                         onClick={() => {
                                                            productDispatch({
                                                               type:
                                                                  'OPTION_ID',
                                                               payload: {
                                                                  optionId:
                                                                     option.id,
                                                               },
                                                            })
                                                            openOperationConfigTunnel(
                                                               1
                                                            )
                                                         }}
                                                      >
                                                         <EditIcon color="#36B6E2" />
                                                      </span>
                                                   </Flex>
                                                ) : (
                                                   <TextButton
                                                      type="ghost"
                                                      onClick={() => {
                                                         productDispatch({
                                                            type: 'OPTION_ID',
                                                            payload: {
                                                               optionId:
                                                                  option.id,
                                                            },
                                                         })
                                                         openOperationConfigTunnel(
                                                            1
                                                         )
                                                      }}
                                                   >
                                                      <PlusIcon color="#36B6E2" />
                                                   </TextButton>
                                                )}
                                             </td>
                                             <td>
                                                <IconButton
                                                   type="ghost"
                                                   onClick={() =>
                                                      editOption(option)
                                                   }
                                                >
                                                   <EditIcon color="#00A7E1" />
                                                </IconButton>
                                             </td>
                                          </tr>
                                       ))}
                                 </tbody>
                              </StyledTable>
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
