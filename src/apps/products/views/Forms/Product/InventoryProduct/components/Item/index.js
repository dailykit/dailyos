import React from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   IconButton,
   useTunnel,
   Tunnels,
   Tunnel,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTab,
   HorizontalTabPanel,
   HorizontalTabPanels,
   SectionTabs,
   SectionTabList,
   SectionTab,
   SectionTabPanels,
   SectionTabPanel,
   Text,
   Flex,
   TextButton,
   PlusIcon,
   Spacer,
} from '@dailykit/ui'

import { Recommendations } from '..'
import {
   DeleteIcon,
   EditIcon,
} from '../../../../../../../../shared/assets/icons'
import {
   OperationConfig,
   Tooltip,
} from '../../../../../../../../shared/components'
import { Grid, StyledTable, Modifier, ItemInfo } from './styled'
import { currencyFmt, logger } from '../../../../../../../../shared/utils'
import { ModifiersContext } from '../../../../../../context/product/modifiers'
import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'
import {
   DELETE_INVENTORY_PRODUCT_OPTION,
   UPDATE_INVENTORY_PRODUCT,
   UPDATE_INVENTORY_PRODUCT_OPTION,
} from '../../../../../../graphql'
// styles
import {
   ItemTypeTunnel,
   ItemTunnel,
   PricingTunnel,
   ModifierTypeTunnel,
   ModifierModeTunnel,
   ModifierFormTunnel,
   ModifierOptionsTunnel,
   ModifierTemplatesTunnel,
   ModifierPhotoTunnel,
} from '../../tunnels'

const address =
   'apps.menu.views.forms.product.inventoryproduct.components.item.'

export default function Item({ state }) {
   const { t } = useTranslation()

   const { productState, productDispatch } = React.useContext(
      InventoryProductContext
   )
   const { modifiersDispatch } = React.useContext(ModifiersContext)

   const opConfigInvokedBy = React.useRef('')
   const modifierOpConfig = React.useRef(undefined)
   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)
   const [pricingTunnels, openPricingTunnel, closePricingTunnel] = useTunnel(1)
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

   // Mutations
   const [deleteOption] = useMutation(DELETE_INVENTORY_PRODUCT_OPTION, {
      onCompleted: () => {
         toast.success(t(address.concat('option(s) deleted!')))
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })
   const [updateProductOption] = useMutation(UPDATE_INVENTORY_PRODUCT_OPTION, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })
   const [updateProduct] = useMutation(UPDATE_INVENTORY_PRODUCT, {
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   // Handlers
   const addOption = () => {
      productDispatch({ type: 'UPDATING', payload: false })
      openPricingTunnel(1)
   }
   const editOption = option => {
      productDispatch({ type: 'UPDATING', payload: true })
      productDispatch({ type: 'OPTION', payload: option })
      openPricingTunnel(1)
   }
   const remove = option => {
      if (option.id === state.default) {
         toast.error('Default option cannot be deleted!')
      } else {
         const confirmed = window.confirm(
            `Do you want to delete option - ${option.label}?`
         )
         if (confirmed) {
            deleteOption({
               variables: {
                  id: { _eq: option.id },
               },
            })
         }
      }
   }
   const deleteItem = async () => {
      try {
         const response = await updateProduct({
            variables: {
               id: state.id,
               set: {
                  sachetItemId: null,
                  supplierItemId: null,
               },
            },
         })
         if (response.data) {
            toast.success(t(address.concat('item deleted!')))
            const ids = state.inventoryProductOptions.map(op => op.id)
            deleteOption({
               variables: {
                  id: { _in: ids },
               },
            })
         }
      } catch (error) {
         toast.error('Something went wrong!')
         logger(error)
      }
   }

   const changeDefault = async option => {
      if (option.id !== state.default) {
         const response = await updateProduct({
            variables: {
               id: state.id,
               set: {
                  default: option.id,
               },
            },
         })
         if (response.data) {
            toast.success('Default updated!')
         }
      }
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
               <ItemTypeTunnel close={closeTunnel} open={openTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <ItemTunnel state={state} close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={pricingTunnels}>
            <Tunnel layer={1}>
               <PricingTunnel state={state} close={closePricingTunnel} />
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
         {state.sachetItem ||
         state.supplierItem ||
         state.inventoryProductOptions?.length ? (
            <SectionTabs>
               <SectionTabList>
                  <SectionTab>
                     {state.sachetItem || state.supplierItem ? (
                        <ItemInfo>
                           {Boolean(
                              state.supplierItem?.bulkItemAsShipped?.image ||
                                 state.sachetItem?.bulkItem?.image
                           ) && (
                              <img
                                 src={
                                    state.supplierItem?.bulkItemAsShipped
                                       .image ||
                                    state.sachetItem?.bulkItem?.image
                                 }
                              />
                           )}
                           <h3>
                              {state.supplierItem?.name ||
                                 `${state.sachetItem?.bulkItem?.supplierItem?.name} ${state.sachetItem?.bulkItem?.processingName}`}
                           </h3>
                           <button onClick={deleteItem}>
                              <DeleteIcon color="#fff" />
                           </button>
                        </ItemInfo>
                     ) : (
                        <ButtonTile
                           type="secondary"
                           size="lg"
                           text={t(address.concat('add item'))}
                           onClick={() => openTunnel(1)}
                        />
                     )}
                  </SectionTab>
               </SectionTabList>
               <SectionTabPanels>
                  <SectionTabPanel>
                     {(state.sachetItem || state.supplierItem) && (
                        <>
                           <Text as="h1">
                              {state.supplierItem?.name ||
                                 `${state.sachetItem?.bulkItem?.supplierItem?.name} ${state.sachetItem?.bulkItem?.processingName}`}
                           </Text>
                           <Text as="p">
                              {t(address.concat('unit size'))}:{' '}
                              {state.supplierItem?.unitSize +
                                 state.supplierItem?.unit ||
                                 state.sachetItem?.unitSize +
                                    state.sachetItem?.unit}
                           </Text>
                        </>
                     )}
                     <HorizontalTabs>
                        <HorizontalTabList>
                           <HorizontalTab>
                              <Flex container alignItems="center">
                                 Pricing
                                 <Tooltip identifier="inventory_product_pricing" />
                              </Flex>
                           </HorizontalTab>
                           <HorizontalTab>
                              <Flex container alignItems="center">
                                 Recommendations
                                 <Tooltip identifier="inventory_product_recommendations" />
                              </Flex>
                           </HorizontalTab>
                        </HorizontalTabList>
                        <HorizontalTabPanels>
                           <HorizontalTabPanel>
                              <StyledTable>
                                 <thead>
                                    <tr>
                                       <th>
                                          <Flex container alignItems="center">
                                             Default
                                             <Tooltip identifier="inventory_product_option_default" />
                                          </Flex>
                                       </th>
                                       <th>
                                          <Flex container alignItems="center">
                                             Label
                                             <Tooltip identifier="inventory_product_option_label" />
                                          </Flex>
                                       </th>
                                       <th>
                                          <Flex container alignItems="center">
                                             Quantity
                                             <Tooltip identifier="inventory_product_option_quantity" />
                                          </Flex>
                                       </th>
                                       <th>
                                          <Flex container alignItems="center">
                                             Price
                                             <Tooltip identifier="inventory_product_option_price" />
                                          </Flex>
                                       </th>
                                       <th>
                                          <Flex container alignItems="center">
                                             Discount
                                             <Tooltip identifier="inventory_product_option_discount" />
                                          </Flex>
                                       </th>
                                       <th>
                                          <Flex container alignItems="center">
                                             Discounted Price
                                             <Tooltip identifier="inventory_product_option_discounted_price" />
                                          </Flex>
                                       </th>
                                       <th>
                                          <Flex container alignItems="center">
                                             Modifiers
                                             <Tooltip identifier="inventory_product_option_modifiers" />
                                          </Flex>
                                       </th>
                                       <th>
                                          <Flex container alignItems="center">
                                             Operational Configuration
                                             <Tooltip identifier="inventory_product_option_opconfig" />
                                          </Flex>
                                       </th>
                                       <th> </th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {state.inventoryProductOptions?.map(
                                       option => (
                                          <tr key={option.id}>
                                             <td>
                                                <input
                                                   type="radio"
                                                   checked={
                                                      option.id ===
                                                      state.default
                                                   }
                                                   onClick={() =>
                                                      changeDefault(option)
                                                   }
                                                />
                                             </td>
                                             <td>{option.label}</td>
                                             <td>{option.quantity}</td>
                                             <td>
                                                {currencyFmt(
                                                   Number(
                                                      option.price[0].value
                                                   ) || 0
                                                )}
                                             </td>
                                             <td>
                                                {option.price[0].discount}%
                                             </td>
                                             <td>
                                                {currencyFmt(
                                                   Number(
                                                      parseFloat(
                                                         option.price[0].value
                                                      ) -
                                                         parseFloat(
                                                            option.price[0]
                                                               .value
                                                         ) *
                                                            (parseFloat(
                                                               option.price[0]
                                                                  .discount
                                                            ) /
                                                               100)
                                                   ).toFixed(2)
                                                ) || 0}
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
                                                      {`${option.operationConfig.station.name} - ${option.operationConfig.labelTemplate.name}`}
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
                                                            opConfigInvokedBy.current =
                                                               'option'
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
                                                         opConfigInvokedBy.current =
                                                            'option'
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
                                                <Grid>
                                                   <IconButton
                                                      type="ghost"
                                                      onClick={() =>
                                                         editOption(option)
                                                      }
                                                   >
                                                      <EditIcon color="#00A7E1" />
                                                   </IconButton>
                                                   <IconButton
                                                      type="ghost"
                                                      onClick={() =>
                                                         remove(option)
                                                      }
                                                   >
                                                      <DeleteIcon color="#FF5A52" />
                                                   </IconButton>
                                                </Grid>
                                             </td>
                                          </tr>
                                       )
                                    )}
                                 </tbody>
                              </StyledTable>
                              <ButtonTile
                                 type="secondary"
                                 text="Add Option"
                                 onClick={addOption}
                                 style={{ margin: '20px 0' }}
                              />
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
            <>
               <ButtonTile
                  type="primary"
                  size="lg"
                  text={t(address.concat('add item'))}
                  onClick={() => openTunnel(1)}
               />
               <Spacer size="20px" />
               <ButtonTile
                  type="primary"
                  text="Add Option"
                  onClick={addOption}
                  style={{ margin: '20px 0' }}
               />
            </>
         )}
      </>
   )
}
