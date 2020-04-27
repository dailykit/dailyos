import React from 'react'
import { ButtonTile, Checkbox, Toggle, TextButton } from '@dailykit/ui'

import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'

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
   StyledDefault,
} from './styled'

import { Accompaniments } from '../'

export default function Recipe({ openTunnel }) {
   const { state } = React.useContext(SimpleProductContext)

   const [_state, _setState] = React.useState({
      view: 'pricing',
   })

   return (
      <StyledWrapper>
         {state.recipe ? (
            <StyledLayout>
               <StyledListing>
                  <StyledListingTile active>
                     <h3>{state.recipe.name}</h3>
                  </StyledListingTile>
               </StyledListing>
               <StyledPanel>
                  <h2>{state.recipe.name}</h2>
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
                     <StyledAction hidden={_state.view !== 'pricing'}>
                        <TextButton
                           type="outline"
                           onClick={() => openTunnel(6)}
                        >
                           Configure Pricing
                        </TextButton>
                     </StyledAction>
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
                              {Object.entries(state.options).map(
                                 ([type, value]) =>
                                    value
                                       .filter(el => el.isActive)
                                       .map((el, i) => (
                                          <tr key={i}>
                                             <td>
                                                {i === 0 ? (
                                                   <span>
                                                      {type === 'mealKit'
                                                         ? 'Meal Kit'
                                                         : 'Ready to Eat'}
                                                   </span>
                                                ) : (
                                                   ''
                                                )}
                                             </td>
                                             <td>
                                                {el.yield.serving}{' '}
                                                <StyledDefault
                                                   hidden={
                                                      !(
                                                         el.id ===
                                                            state.default.value
                                                               .id &&
                                                         type ===
                                                            state.default.type
                                                      )
                                                   }
                                                >
                                                   Default
                                                </StyledDefault>
                                             </td>
                                             <td>${el.price.value} </td>
                                             <td>{el.price.discount} %</td>
                                          </tr>
                                       ))
                              )}
                           </tbody>
                        </StyledTable>
                     ) : (
                        <Accompaniments openTunnel={openTunnel} />
                     )}
                  </StyledTabView>
               </StyledPanel>
            </StyledLayout>
         ) : (
            <ButtonTile
               type="primary"
               size="lg"
               text="Add Recipe"
               onClick={() => openTunnel(2)}
            />
         )}
      </StyledWrapper>
   )
}
