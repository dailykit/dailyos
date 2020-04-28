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

export default function Items({ openTunnel }) {
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
                           Default
                        </StyledDefault>
                     </StyledListingTile>
                  ))}
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
                        Make Default
                     </TextButton>
                  </StyledAction>
                  <StyledTabs>
                     <StyledTab
                        onClick={() =>
                           _setState({ ..._state, view: 'pricing' })
                        }
                        active={_state.view === 'pricing'}
                     >
                        Pricing
                     </StyledTab>
                     <StyledTab
                        onClick={() =>
                           _setState({ ..._state, view: 'accompaniments' })
                        }
                        active={_state.view === 'accompaniments'}
                     >
                        Accompaniments
                     </StyledTab>
                  </StyledTabs>
                  <StyledTabView>
                     {_state.view === 'pricing' ? (
                        <StyledTable>
                           <thead>
                              <tr>
                                 <th></th>
                                 <th>Servings</th>
                                 <th>Price</th>
                                 <th>Discounted Price</th>
                              </tr>
                           </thead>
                           <tbody>
                              {_state.currentItem?.simpleRecipeProductOptions
                                 .filter(option => option.type === 'mealKit')
                                 .filter(option => option.isActive)
                                 .map((option, i) => (
                                    <tr key={i}>
                                       <td>
                                          {i === 0 ? <span>Meal Kit</span> : ''}
                                       </td>
                                       <td>
                                          {
                                             option.simpleRecipeYield.yield
                                                .serving
                                          }
                                       </td>
                                       <td>${option.price[0].value} </td>
                                       <td>{option.price[0].discount} %</td>
                                    </tr>
                                 ))}
                              {_state.currentItem?.simpleRecipeProductOptions
                                 .filter(option => option.type === 'readyToEat')
                                 .filter(option => option.isActive)
                                 .map((option, i) => (
                                    <tr key={i}>
                                       <td>
                                          {i === 0 ? (
                                             <span>Ready To Eat</span>
                                          ) : (
                                             ''
                                          )}
                                       </td>
                                       <td>
                                          {
                                             option.simpleRecipeYield.yield
                                                .serving
                                          }
                                       </td>
                                       <td>${option.price[0].value} </td>
                                       <td>{option.price[0].discount} %</td>
                                    </tr>
                                 ))}
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
               text="Add Products"
               onClick={() => openTunnel(2)}
            />
         )}
      </StyledWrapper>
   )
}
