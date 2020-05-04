import React from 'react'

import { ButtonTile } from '@dailykit/ui'

import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'

import { StyledTab, StyledTabs, StyledTabView } from './styled'

import { Products } from '../'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.simplerecipeproduct.components.accompaniments.'

const Accompaniments = ({ openTunnel }) => {
   const { t } = useTranslation()
   const { state, dispatch } = React.useContext(SimpleProductContext)

   return (
      <React.Fragment>
         {state.accompaniments.length ? (
            <React.Fragment>
               <StyledTabs>
                  {state.accompaniments.map(el => (
                     <StyledTab
                        key={el.type}
                        onClick={() =>
                           dispatch({
                              type: 'META',
                              payload: {
                                 name: 'accompanimentType',
                                 value: el.type,
                              },
                           })
                        }
                        active={state.meta.accompanimentType === el.type}
                     >
                        {el.type}
                     </StyledTab>
                  ))}
               </StyledTabs>
               <StyledTabView>
                  <Products openTunnel={openTunnel} />
               </StyledTabView>
            </React.Fragment>
         ) : (
               <ButtonTile
                  type="secondary"
                  text={t(address.concat("add accompaniment types"))}
                  onClick={() => openTunnel(3)}
               />
            )}
      </React.Fragment>
   )
}

export default Accompaniments
