import React from 'react'
import { ButtonTile, Text } from '@dailykit/ui'
import { ComboProductContext } from '../../../../../../context/product/comboProduct'
import { StyledWrapper, StyledLabel } from './styled'

const Items = ({ openTunnel }) => {
   const { state } = React.useContext(ComboProductContext)

   return (
      <StyledWrapper>
         {state.components?.length ? (
            <React.Fragment>
               <Text as="h2">Items ({state.components.length})</Text>
               {state.components.map(component => (
                  <Item
                     key={component.id}
                     component={component}
                     openTunnel={openTunnel}
                  />
               ))}
            </React.Fragment>
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

const Item = ({ component, openTunnel }) => {
   return (
      <StyledWrapper>
         <StyledLabel>{component.label}</StyledLabel>
         {component.customizableProduct ||
         component.inventoryProduct ||
         component.simpleRecipeProduct ? (
            'Kuch toh hai!'
         ) : (
            <ButtonTile
               type="primary"
               size="sm"
               text="Add Product"
               onClick={() => openTunnel(3)}
            />
         )}
      </StyledWrapper>
   )
}

export default Items
