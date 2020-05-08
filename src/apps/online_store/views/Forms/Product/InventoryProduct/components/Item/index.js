import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ButtonTile, ComboButton, IconButton } from '@dailykit/ui'

import { AddIcon } from '../../../../../../assets/icons'

import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'

import { DELETE_INVENTORY_PRODUCT_OPTION } from '../../../../../../graphql'

// styles
import {
   StyledWrapper,
   StyledLayout,
   StyledListing,
   StyledPanel,
   StyledListingTile,
   StyledTabs,
   StyledTab,
   StyledTabView,
   StyledTable,
   Grid,
} from './styled'

import { Accompaniments } from '../'

import { useTranslation, Trans } from 'react-i18next'
import {
   EditIcon,
   DeleteIcon,
} from '../../../../../../../../shared/assets/icons'
import { toast } from 'react-toastify'

const address =
   'apps.online_store.views.forms.product.inventoryproduct.components.item.'

export default function Item({ state, openTunnel }) {
   const { t } = useTranslation()

   const { productDispatch } = React.useContext(InventoryProductContext)

   const [_state, _setState] = React.useState({
      view: 'pricing',
   })

   // Mutation
   const [deleteOption] = useMutation(DELETE_INVENTORY_PRODUCT_OPTION, {
      onCompleted: () => {
         toast.success('Option deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Could not delete!')
      },
   })

   // Handlers
   const addOption = () => {
      productDispatch({ type: 'UPDATING', payload: false })
      openTunnel(7)
   }
   const editOption = option => {
      productDispatch({ type: 'UPDATING', payload: true })
      productDispatch({ type: 'OPTION', payload: option })
      openTunnel(7)
   }
   const remove = option => {
      deleteOption({
         variables: {
            id: option.id,
         },
      })
   }

   return (
      <StyledWrapper>
         {state.sachetItem || state.supplierItem ? (
            <StyledLayout>
               <StyledListing>
                  <StyledListingTile active>
                     <h3>
                        {state.supplierItem.name || state.sachetItem.unitSize}
                     </h3>
                  </StyledListingTile>
               </StyledListing>
               <StyledPanel>
                  <h2>
                     {state.supplierItem.name || state.sachetItem.unitSize}
                  </h2>
                  <h5>
                     {t(address.concat('unit size'))}:{' '}
                     {state.supplierItem.unitSize + state.supplierItem.unit ||
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
                        <React.Fragment>
                           <StyledTable>
                              <thead>
                                 <tr>
                                    <th>{t(address.concat('options'))}</th>
                                    <th>{t(address.concat('quantity'))}</th>
                                    <th>{t(address.concat('price'))}</th>
                                    <th>{t(address.concat('discount'))}</th>
                                    <th></th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {state.inventoryProductOptions?.map(option => (
                                    <tr key={option.id}>
                                       <td>{option.label}</td>
                                       <td>{option.quantity}</td>
                                       <td>${option.price[0].value}</td>
                                       <td>{option.price[0].discount}%</td>
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
                                                onClick={() => remove(option)}
                                             >
                                                <DeleteIcon color="#FF5A52" />
                                             </IconButton>
                                          </Grid>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </StyledTable>
                           <ComboButton type="ghost" onClick={addOption}>
                              <AddIcon />
                              {t(address.concat('add option'))}
                           </ComboButton>
                        </React.Fragment>
                     ) : (
                        <Accompaniments state={state} openTunnel={openTunnel} />
                     )}
                  </StyledTabView>
               </StyledPanel>
            </StyledLayout>
         ) : (
            <ButtonTile
               type="primary"
               size="lg"
               text={t(address.concat('add item'))}
               onClick={() => openTunnel(2)}
            />
         )}
      </StyledWrapper>
   )
}
