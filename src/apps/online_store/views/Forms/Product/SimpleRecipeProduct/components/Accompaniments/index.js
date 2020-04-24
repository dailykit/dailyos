import React from 'react'

import { ButtonTile } from '@dailykit/ui'

import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'

import { StyledTab, StyledTabs, StyledTabView } from './styled'

const Accompaniments = ({ openTunnel }) => {
   const { state, dispatch } = React.useContext(SimpleProductContext)

   const [_state, _setState] = React.useState({
      view: state.accompaniments[0]?.type || '',
   })

   return (
      <React.Fragment>
         {state.accompaniments.length ? (
            <React.Fragment>
               <StyledTabs>
                  {state.accompaniments.map(el => (
                     <StyledTab
                        key={el.type}
                        onClick={() => _setState({ ..._state, view: el.type })}
                        active={_state.view === el.type}
                     >
                        {el.type}
                     </StyledTab>
                  ))}
               </StyledTabs>
               <StyledTabView>{_state.view}</StyledTabView>
            </React.Fragment>
         ) : (
            <ButtonTile
               type="secondary"
               text="Add Accompaniment Types"
               onClick={() => openTunnel(3)}
            />
         )}
      </React.Fragment>
   )
}

export default Accompaniments
