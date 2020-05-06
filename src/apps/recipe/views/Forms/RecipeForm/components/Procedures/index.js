import React from 'react'
import { ButtonTile, Text, IconButton } from '@dailykit/ui'
import { Container, ContainerAction } from '../styled'
import { EditIcon } from '../../../../../assets/icons'

const Procedures = ({ state, openTunnel }) => {
   return (
      <React.Fragment>
         {state.procedures?.length ? (
            <Container top="32" paddingX="32">
               <ContainerAction>
                  <IconButton onClick={() => openTunnel(2)}>
                     <EditIcon color="#00A7E1" />
                  </IconButton>
               </ContainerAction>
               <Text as="subtitle">Cooking Steps</Text>
               {state.procedures.map((procedure, i) => (
                  <Procedure key={i} procedure={procedure} />
               ))}
            </Container>
         ) : (
            <Container top="32" paddingX="32">
               <ButtonTile
                  type="secondary"
                  text="Add Procedures"
                  onClick={() => openTunnel(2)}
               />
            </Container>
         )}
      </React.Fragment>
   )
}

export default Procedures

const Procedure = ({ procedure }) => {
   return (
      <Container bottom="20">
         <Text as="h2">{procedure.title}</Text>
         {procedure.steps.map((step, i) => (
            <Container bottom="8" paddingX="8" key={i}>
               <Text as="title">{step.title}</Text>
               <p>{step.description}</p>
            </Container>
         ))}
      </Container>
   )
}
