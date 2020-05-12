import React from 'react'
import { ButtonTile } from '@dailykit/ui'
import { Products } from '../'
import { useTranslation } from 'react-i18next'
import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'
import { StyledTab, StyledTabs, StyledTabView } from './styled'

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
               onClick={() => openTunnel(3)}
            />
         )}
      </React.Fragment>
   )
}

export default Accompaniments
