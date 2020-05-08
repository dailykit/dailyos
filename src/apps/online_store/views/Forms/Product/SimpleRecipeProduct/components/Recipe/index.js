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

import { useTranslation, Trans } from 'react-i18next'

const address =
   'apps.online_store.views.forms.product.simplerecipeproduct.components.recipe.'

export default function Recipe({ state, openTunnel }) {
   const { t } = useTranslation()
   const { productState } = React.useContext(SimpleProductContext)

   const [_state, _setState] = React.useState({
      view: 'pricing',
   })

   return (
      <StyledWrapper>
         {state.simpleRecipe ? (
            <StyledLayout>
               <StyledListing>
                  <StyledListingTile active>
                     <h3>{state.simpleRecipe.name}</h3>
                  </StyledListingTile>
               </StyledListing>
               <StyledPanel>
                  <h2>{state.simpleRecipe.name}</h2>
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
                     <StyledAction hidden={_state.view !== 'pricing'}>
                        <TextButton
                           type="outline"
                           onClick={() => openTunnel(6)}
                        >
                           {t(address.concat('configure pricing'))}
                        </TextButton>
                     </StyledAction>
                     {_state.view === 'pricing' ? (
                        <StyledTable>
                           <thead>
                              <tr>
                                 <th></th>
                                 <th>{t(address.concat('servings'))}</th>
                                 <th>{t(address.concat('price'))}</th>
                                 <th>{t(address.concat('discount'))}</th>
                              </tr>
                           </thead>
                           <tbody>
                              {/* {Object.entries(state.options).map(
                                 ([type, value]) =>
                                    value
                                       .filter(el => el.isActive)
                                       .map((el, i) => (
                                          <tr key={i}>
                                             <td>
                                                {i === 0 ? (
                                                   <span>
                                                      {type === 'mealKit'
                                                         ? t(
                                                              address.concat(
                                                                 'meal kit'
                                                              )
                                                           )
                                                         : t(
                                                              address.concat(
                                                                 'ready to eat'
                                                              )
                                                           )}
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
                              )} */}
                           </tbody>
                        </StyledTable>
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
               text={t(address.concat('add recipe'))}
               onClick={() => openTunnel(2)}
            />
         )}
      </StyledWrapper>
   )
}
