import React from 'react'
import { ButtonTile } from '@dailykit/ui'
import { ComboProductContext } from '../../../../../../context/product/comboProduct'
import { StyledWrapper } from './styled'

const Items = ({ openTunnel }) => {
   const { state } = React.useContext(ComboProductContext)

   return (
      <StyledWrapper>
         {state.components?.length ? (
            state.components.map(component => (
               <Item key={component.id} component={component} />
            ))
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

const Item = ({ component }) => {
   return <div>{component.label}</div>
}

export default Items
