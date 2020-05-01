import React from 'react'

import { ButtonTile } from '@dailykit/ui'

import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'

import { StyledTab, StyledTabs, StyledTabView } from './styled'

import { Products } from '../'

const Accompaniments = ({ openTunnel }) => {
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
               text="Add Accompaniment Types"
               onClick={() => openTunnel(3)}
            />
         )}
      </React.Fragment>
   )
}

export default Accompaniments
