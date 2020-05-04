import React from 'react'

import { ButtonTile } from '@dailykit/ui'

import { CustomizableProductContext } from '../../../../../../context/product/customizableProduct'

import { StyledTab, StyledTabs, StyledTabView } from './styled'

import { Products } from '../'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.customizableproduct.components.accompaniments.'

const Accompaniments = ({ openTunnel }) => {
   const { t } = useTranslation()
   const { state, dispatch } = React.useContext(CustomizableProductContext)

   return (
      <React.Fragment>
         {state.meta.currentItem.accompaniments.length ? (
            <React.Fragment>
               <StyledTabs>
                  {state.meta.currentItem.accompaniments.map(el => (
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
                  onClick={() => openTunnel(4)}
               />
            )}
      </React.Fragment>
   )
}

export default Accompaniments
