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

export default function Items({ openTunnel }) {
   const { state, dispatch } = React.useContext(CustomizableProductContext)

   const [_state, _setState] = React.useState({
      view: 'pricing',
      currentItem: state.items[state.meta.itemType][0] || {},
   })

   React.useEffect(() => {
      _setState({
         ..._state,
         currentItem: state.items[state.meta.itemType][0] || {},
      })
   }, [state.items])

   return (
      <StyledWrapper>
         {state.items[state.meta.itemType].length ? (
            <StyledLayout>
               <StyledListing>
                  {state.items[state.meta.itemType].map(item => (
                     <StyledListingTile
                        active={_state.currentItem.id === item.id}
                        onClick={() =>
                           _setState({ ..._state, currentItem: item })
                        }
                     >
                        <h3>{item.title}</h3>
                     </StyledListingTile>
                  ))}
               </StyledListing>
               <StyledPanel>
                  <h2>{_state.currentItem.title}</h2>
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
                     <StyledAction>
                        <TextButton
                           type="outline"
                           onClick={() => openTunnel(6)}
                        >
                           Configure Pricing
                        </TextButton>
                     </StyledAction>
                     {_state.view === 'pricing' ? (
                        'Pricing'
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
               text="Add Items"
               onClick={() => openTunnel(2)}
            />
         )}
      </StyledWrapper>
   )
}
