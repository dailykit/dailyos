import React from 'react'
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
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Recommendations } from '..'
import {
   DeleteIcon,
   EditIcon,
} from '../../../../../../../../shared/assets/icons'
import { AddIcon } from '../../../../../../assets/icons'
import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'
import {
   DELETE_INVENTORY_PRODUCT_OPTION,
   UPDATE_INVENTORY_PRODUCT,
   UPDATE_INVENTORY_PRODUCT_OPTION,
} from '../../../../../../graphql'
// styles
import { Grid, StyledTable, Modifier, ItemInfo } from './styled'
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
import { ModifiersContext } from '../../../../../../context/product/modifiers'
import {
   OperationConfig,
   Tooltip,
} from '../../../../../../../../shared/components'
import { logger } from '../../../../../../../../shared/utils'

const address =
   'apps.menu.views.forms.product.inventoryproduct.components.item.'

export default function Item({ state }) {
   const { t } = useTranslation()

   const { productState, productDispatch } = React.useContext(
      InventoryProductContext
   )
   const { modifiersDispatch } = React.useContext(ModifiersContext)

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
         {state.sachetItem || state.supplierItem ? (
            <SectionTabs>
               <SectionTabList>
                  <SectionTab>
                     <ItemInfo>
                        {Boolean(
                           state.supplierItem?.bulkItemAsShipped?.image ||
                              state.sachetItem?.bulkItem?.image
                        ) && (
                           <img
                              src={
                                 state.supplierItem?.bulkItemAsShipped.image ||
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
                  </SectionTab>
               </SectionTabList>
               <SectionTabPanels>
                  <SectionTabPanel>
                     <Text as="h1">
                        {state.supplierItem?.name ||
                           `${state.sachetItem?.bulkItem?.supplierItem?.name} ${state.sachetItem?.bulkItem?.processingName}`}
                     </Text>
                     <Text as="p">
                        {t(address.concat('unit size'))}:{' '}
                        {state.supplierItem?.unitSize +
                           state.supplierItem?.unit ||
                           state.sachetItem?.unitSize + state.sachetItem?.unit}
                     </Text>
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
                                             <td>${option.price[0].value}</td>
                                             <td>
                                                {option.price[0].discount}%
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
            <ButtonTile
               type="primary"
               size="lg"
               text={t(address.concat('add item'))}
               onClick={() => openTunnel(1)}
            />
         )}
      </>
   )
}
