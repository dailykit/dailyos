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
   Collapsible,
   ComboButton,
   Spacer,
} from '@dailykit/ui'

import { Recommendations } from '..'
import {
   DeleteIcon,
   EditIcon,
   TickIcon,
} from '../../../../../../../../shared/assets/icons'
import {
   DragNDrop,
   OperationConfig,
   Tooltip,
} from '../../../../../../../../shared/components'
import { Grid, StyledProductOption, Modifier, ItemInfo } from './styled'
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
      console.log(option)
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
                              <DragNDrop
                                 list={state.inventoryProductOptions}
                                 droppableId="inventoryProductOptionsDroppableId"
                                 tablename="inventoryProductOption"
                                 schemaname="products"
                              >
                                 {state.inventoryProductOptions?.map(option => (
                                    <Collapsible
                                       key={option.id}
                                       isDraggable
                                       title={option.label}
                                       head={
                                          <OptionHead
                                             deleteAction={() => remove(option)}
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
                                             removeModifier={() =>
                                                removeModifier(option.id)
                                             }
                                             option={option}
                                          />
                                       }
                                    />
                                 ))}
                              </DragNDrop>
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
            <Flex>
               <Text as="subtitle">Quantity</Text>
               <Text as="p">{option.quantity}</Text>
            </Flex>
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
            <Spacer xAxis size="16px" />
            <IconButton type="ghost" onClick={deleteAction}>
               <DeleteIcon color="#FF5A52" />
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
