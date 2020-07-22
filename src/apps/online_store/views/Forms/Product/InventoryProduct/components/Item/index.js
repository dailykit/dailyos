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
} from './styled'
import { ItemTypeTunnel, ItemTunnel, PricingTunnel } from '../../tunnels'

const address =
   'apps.online_store.views.forms.product.inventoryproduct.components.item.'

export default function Item({ state }) {
   const { t } = useTranslation()

   const { productDispatch } = React.useContext(InventoryProductContext)

   const [_state, _setState] = React.useState({
      view: 'pricing',
   })

   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)
   const [pricingTunnels, openPricingTunnel, closePricingTunnel] = useTunnel(1)

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
