import React from 'react'

import { ButtonTile } from '@dailykit/ui'

import { CustomizableProductContext } from '../../../../../../context/product/customizableProduct'

import { StyledTab, StyledTabs, StyledTabView } from './styled'

import { Products } from '../'

const Accompaniments = ({ openTunnel, accompaniments }) => {
   const { state, dispatch } = React.useContext(CustomizableProductContext)

   const [_state, _setState] = React.useState({
      view: state.meta.accompanimentType || '',
   })

   React.useEffect(() => {
      if (_state.view) {
         dispatch({
            type: 'META',
            payload: {
               name: 'accompanimentType',
               value: _state.view,
            },
         })
      }
   }, [_state.view])

   return (
      <React.Fragment>
         {state.meta.currentItem.accompaniments.length ? (
            <React.Fragment>
               <StyledTabs>
                  {state.meta.currentItem.accompaniments.map(el => (
                     <StyledTab
                        key={el.type}
                        onClick={() => _setState({ ..._state, view: el.type })}
                        active={_state.view === el.type}
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
               text="Add Accompaniment Types"
               onClick={() => openTunnel(4)}
            />
         )}
      </React.Fragment>
   )
}

export default Accompaniments
