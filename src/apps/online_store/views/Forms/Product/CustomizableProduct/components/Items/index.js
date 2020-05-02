import React from 'react'
import { ButtonTile, Checkbox, Toggle, TextButton } from '@dailykit/ui'

import { CustomizableProductContext } from '../../../../../../context/product/customizableProduct'

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
   StyledAction,
} from './styled'

import { Accompaniments } from '../'
import { StyledDefault } from '../../../SimpleRecipeProduct/components/Recipe/styled'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.customizableproduct.components.items.'

export default function Items({ openTunnel }) {
   const { t } = useTranslation()
   const { state, dispatch } = React.useContext(CustomizableProductContext)

   const [_state, _setState] = React.useState({
      view: 'pricing',
      items: [],
      currentItem: {},
   })

   React.useEffect(() => {
      _setState({
         ..._state,
         items: [...state.items],
         currentItem: state.items[0] || {},
      })
   }, [state.items])

   React.useEffect(() => {
      dispatch({
         type: 'META',
         payload: {
            name: 'currentItem',
            value: _state.currentItem,
         },
      })
   }, [_state.currentItem])

   return (
      <StyledWrapper>
         {_state.items.length ? (
            <StyledLayout>
               <StyledListing>
                  {_state.items.map(item => (
                     <StyledListingTile
                        active={_state.currentItem.id === item.id}
                        onClick={() =>
                           _setState({ ..._state, currentItem: item })
                        }
                     >
                        <h3>{item.title}</h3>
                        <StyledDefault hidden={state.default.id !== item.id}>
                           {t(address.concat('default'))}
                        </StyledDefault>
                     </StyledListingTile>
                  ))}
                  <ButtonTile
                     type="primary"
                     size="sm"
                     text={t(address.concat("add products"))}
                     onClick={() => openTunnel(2)}
                  />
               </StyledListing>
               <StyledPanel>
                  <h2>{_state.currentItem.title}</h2>
                  <StyledAction
                     hidden={state.default.id === _state.currentItem.id}
                  >
                     <TextButton
                        type="outline"
                        onClick={() => {
                           dispatch({
                              type: 'DEFAULT',
                              payload: {
                                 value: {
                                    type: _state.currentItem.type,
                                    id: _state.currentItem.id,
                                 },
                              },
                           })
                        }}
                     >
                        {t(address.concat('make default'))}
                     </TextButton>
                  </StyledAction>
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
                        <StyledTable>
                           <thead>
                              <tr>
                                 <th>
                                    {_state.currentItem
                                       ?.simpleRecipeProductOptions
                                       ? ''
                                       : t(address.concat('labels'))}
                                 </th>
                                 <th>
                                    {_state.currentItem
                                       ?.simpleRecipeProductOptions
                                       ? t(address.concat('servings'))
                                       : t(address.concat('options'))}
                                 </th>
                                 <th>{t(address.concat('price'))}</th>
                                 <th>{t(address.concat('discount'))}</th>
                              </tr>
                           </thead>
                           <tbody>
                              {_state.currentItem
                                 ?.simpleRecipeProductOptions ? (
                                    <React.Fragment>
                                       {_state.currentItem?.simpleRecipeProductOptions
                                          .filter(
                                             option => option.type === 'mealKit'
                                          )
                                          .filter(option => option.isActive)
                                          .map((option, i) => (
                                             <tr key={i}>
                                                <td>
                                                   {i === 0 ? (
                                                      <span>{t(address.concat('meal kit'))}</span>
                                                   ) : (
                                                         ''
                                                      )}
                                                </td>
                                                <td>
                                                   {
                                                      option.simpleRecipeYield
                                                         .yield.serving
                                                   }
                                                </td>
                                                <td>${option.price[0].value} </td>
                                                <td>
                                                   {option.price[0].discount} %
                                             </td>
                                             </tr>
                                          ))}
                                       {_state.currentItem?.simpleRecipeProductOptions
                                          .filter(
                                             option => option.type === 'readyToEat'
                                          )
                                          .filter(option => option.isActive)
                                          .map((option, i) => (
                                             <tr key={i}>
                                                <td>
                                                   {i === 0 ? (
                                                      <span>{t(address.concat('ready to eat'))}</span>
                                                   ) : (
                                                         ''
                                                      )}
                                                </td>
                                                <td>
                                                   {
                                                      option.simpleRecipeYield
                                                         .yield.serving
                                                   }
                                                </td>
                                                <td>${option.price[0].value} </td>
                                                <td>
                                                   {option.price[0].discount} %
                                             </td>
                                             </tr>
                                          ))}
                                    </React.Fragment>
                                 ) : (
                                    <React.Fragment>
                                       {_state.currentItem?.inventoryProductOptions.map(
                                          option => (
                                             <tr key={option.id}>
                                                <td>{option.label}</td>
                                                <td>{option.quantity}</td>
                                                <td>${option.price[0].value} </td>
                                                <td>
                                                   {option.price[0].discount} %
                                             </td>
                                             </tr>
                                          )
                                       )}
                                    </React.Fragment>
                                 )}
                           </tbody>
                        </StyledTable>
                     ) : (
                           <Accompaniments
                              openTunnel={openTunnel}
                              accompaniments={_state.currentItem.accompaniments}
                           />
                        )}
                  </StyledTabView>
               </StyledPanel>
            </StyledLayout>
         ) : (
               <ButtonTile
                  type="primary"
                  size="lg"
                  text={t(address.concat("add products"))}
                  onClick={() => openTunnel(2)}
               />
            )}
      </StyledWrapper>
   )
}
