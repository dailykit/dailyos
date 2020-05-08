import React from 'react'

import { ButtonTile } from '@dailykit/ui'

import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'

import { StyledTab, StyledTabs, StyledTabView } from './styled'

import { Products } from '../'

import { useTranslation, Trans } from 'react-i18next'

const address =
   'apps.online_store.views.forms.product.simplerecipeproduct.components.accompaniments.'

const Accompaniments = ({ state, openTunnel }) => {
   const { t } = useTranslation()
   const { productState, productDispatch } = React.useContext(
      SimpleProductContext
   )

   return (
      <React.Fragment>
         {state.accompaniments?.length ? (
            <React.Fragment>
               <StyledTabs>
                  {state.accompaniments.map((el, i) => (
                     <StyledTab
                        key={el.type}
                        onClick={() =>
                           productDispatch({
                              type: 'META',
                              payload: {
                                 name: 'accompanimentTabIndex',
                                 value: i,
                              },
                           })
                        }
                        active={productState.meta.accompanimentTabIndex === i}
                     >
                        {el.type}
                     </StyledTab>
                  ))}
               </StyledTabs>
               <StyledTabView>
                  <Products state={state} openTunnel={openTunnel} />
               </StyledTabView>
            </React.Fragment>
         ) : (
            <ButtonTile
               type="secondary"
               text={t(address.concat('add accompaniment types'))}
               onClick={() => openTunnel(4)}
            />
         )}
      </React.Fragment>
   )
}

export default Accompaniments
