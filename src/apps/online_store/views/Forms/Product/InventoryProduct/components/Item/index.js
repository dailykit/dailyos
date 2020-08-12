import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   ComboButton,
   IconButton,
   useTunnel,
   Tunnels,
   Tunnel,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
// eslint-disable-next-line import/no-cycle
import { Accompaniments } from '..'
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
import {
   Grid,
   StyledLayout,
   StyledListing,
   StyledListingTile,
   StyledPanel,
   StyledTab,
   StyledTable,
   StyledTabs,
   StyledTabView,
   StyledWrapper,
   Modifier,
} from './styled'
import {
   ItemTypeTunnel,
   ItemTunnel,
   PricingTunnel,
   ModifierTypeTunnel,
   ModifierModeTunnel,
   ModifierFormTunnel,
   ModifierOptionsTunnel,
   ModifierTemplatesTunnel,
} from '../../tunnels'
import { ModifiersContext } from '../../../../../../context/product/modifiers'

const address =
   'apps.online_store.views.forms.product.inventoryproduct.components.item.'

export default function Item({ state }) {
   const { t } = useTranslation()

   const { productDispatch } = React.useContext(InventoryProductContext)
   const { modifiersDispatch } = React.useContext(ModifiersContext)

   const [_state, _setState] = React.useState({
      view: 'pricing',
   })

   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)
   const [pricingTunnels, openPricingTunnel, closePricingTunnel] = useTunnel(1)
   const [
      modifiersTunnel,
      openModifiersTunnel,
      closeModifiersTunnel,
   ] = useTunnel(6)

   // Mutations
   const [deleteOption] = useMutation(DELETE_INVENTORY_PRODUCT_OPTION, {
      onCompleted: () => {
         toast.success(t(address.concat('option(s) deleted!')))
      },
      onError: error => {
         console.log(error)
         toast.error(t(address.concat('could not delete!')))
      },
   })
   const [updateProductOption] = useMutation(UPDATE_INVENTORY_PRODUCT_OPTION, {
      onCompleted: () => {
         toast.success('Modifier removed!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })
   const [updateProduct] = useMutation(UPDATE_INVENTORY_PRODUCT, {
      onError: error => {
         console.log(error)
         toast.error(t(address.concat('error')))
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
         deleteOption({
            variables: {
               id: { _eq: option.id },
            },
         })
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
         console.log(error)
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
      modifiersDispatch({
         type: 'POPULATE',
         payload: { modifier },
      })
      openModifiersTunnel(2)
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
               <ModifierOptionsTunnel close={closeModifiersTunnel} />
            </Tunnel>
            <Tunnel layer={6}>
               <ModifierTemplatesTunnel close={closeModifiersTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            {state.sachetItem || state.supplierItem ? (
               <StyledLayout>
                  <StyledListing>
                     <StyledListingTile active>
                        <h3>
                           {state.supplierItem?.name ||
                              `${state.sachetItem.bulkItem.supplierItem.name} ${state.sachetItem.bulkItem.processingName}`}
                        </h3>
                        <span
                           role="button"
                           tabIndex="0"
                           onKeyDown={e => e.charCode === 13 && deleteItem()}
                           onClick={deleteItem}
                        >
                           <DeleteIcon color="#fff" />
                        </span>
                     </StyledListingTile>
                  </StyledListing>
                  <StyledPanel>
                     <h2>
                        {state.supplierItem?.name ||
                           `${state.sachetItem.bulkItem.supplierItem.name} ${state.sachetItem.bulkItem.processingName}`}
                     </h2>
                     <h5>
                        {t(address.concat('unit size'))}:{' '}
                        {state.supplierItem?.unitSize +
                           state.supplierItem?.unit ||
                           state.sachetItem.unitSize + state.sachetItem.unit}
                     </h5>
                     <StyledTabs>
                        <StyledTab
                           onClick={() =>
                              _setState({ ..._state, view: 'pricing' })
                           }
                           active={_state.view === 'pricing'}
                        >
                           {t(address.concat('pricing'))}
                        </StyledTab>
                        <StyledTab
                           onClick={() =>
                              _setState({ ..._state, view: 'accompaniments' })
                           }
                           active={_state.view === 'accompaniments'}
                        >
                           {t(address.concat('accompaniments'))}
                        </StyledTab>
                     </StyledTabs>
                     <StyledTabView>
                        {_state.view === 'pricing' ? (
                           <>
                              <StyledTable>
                                 <thead>
                                    <tr>
                                       <th>{t(address.concat('default'))}</th>
                                       <th>{t(address.concat('options'))}</th>
                                       <th>{t(address.concat('quantity'))}</th>
                                       <th>{t(address.concat('price'))}</th>
                                       <th>{t(address.concat('discount'))}</th>
                                       <th>
                                          {t(
                                             address.concat('discounted price')
                                          )}
                                       </th>
                                       <th>{t(address.concat('modifiers'))}</th>
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
                                                      <AddIcon color="#36B6E2" />
                                                   </IconButton>
                                                )}
                                             </td>
                                             <td>
                                                <Grid>
                                                   <IconButton
                                                      onClick={() =>
                                                         editOption(option)
                                                      }
                                                   >
                                                      <EditIcon color="#00A7E1" />
                                                   </IconButton>
                                                   <IconButton
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
                              <ComboButton type="ghost" onClick={addOption}>
                                 <AddIcon />
                                 {t(address.concat('add option'))}
                              </ComboButton>
                           </>
                        ) : (
                           <Accompaniments state={state} />
                        )}
                     </StyledTabView>
                  </StyledPanel>
               </StyledLayout>
            ) : (
               <ButtonTile
                  type="primary"
                  size="lg"
                  text={t(address.concat('add item'))}
                  onClick={() => openTunnel(1)}
               />
            )}
         </StyledWrapper>
      </>
   )
}
