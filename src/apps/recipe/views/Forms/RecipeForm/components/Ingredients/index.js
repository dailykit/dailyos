import React from 'react'
import { Container } from '../styled'
import { ButtonGroup, ButtonTile } from '@dailykit/ui'

const Ingredients = ({ state, openTunnel }) => {
   return (
      <React.Fragment>
         <Container>
            <ButtonTile
               type="secondary"
               text="Add Ingredients"
               onClick={() => openTunnel(4)}
            />
         </Container>
      </React.Fragment>
   )
}

export default Ingredients
