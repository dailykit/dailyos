import React from 'react'
import {
   ButtonTile,
   Flex,
   IconButton,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import { Tooltip } from '../../../../../../../shared/components'
import { EditIcon } from '../../../../../assets/icons'
import { ProceduresTunnel, StepPhotoTunnel } from '../../tunnels'
import { Container, ContainerAction } from '../styled'
import { Image } from './styled'

const Procedures = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="lg">
               <ProceduresTunnel
                  state={state}
                  openTunnel={openTunnel}
                  closeTunnel={closeTunnel}
               />
            </Tunnel>
            <Tunnel layer={2}>
               <StepPhotoTunnel closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <Flex container alignItems="center">
            <Text as="subtitle">Cooking Steps</Text>
            <Tooltip identifier="recipe_cooking_steps" />
         </Flex>
         {state.procedures?.length ? (
            <Container>
               <ContainerAction>
                  <IconButton type="ghost" onClick={() => openTunnel(1)}>
                     <EditIcon color="#00A7E1" />
                  </IconButton>
               </ContainerAction>
               {state.procedures.map(procedure => (
                  <Procedure key={procedure.title} procedure={procedure} />
               ))}
            </Container>
         ) : (
            <ButtonTile
               type="secondary"
               text="Add Cooking Steps"
               onClick={() => openTunnel(1)}
            />
         )}
      </>
   )
}

export default Procedures

const Procedure = ({ procedure }) => {
   return (
      <Container bottom="20">
         <Text as="h2">{procedure.title}</Text>
         {procedure.steps.map(step => (
            <Container bottom="8" paddingX="8" key={step.title}>
               <Text as="title">{step.title}</Text>
               {Boolean(step.assets.images.length) && (
                  <Image
                     src={step.assets.images[0].url}
                     alt={step.assets.images[0].title}
                  />
               )}
               <p>{step.description}</p>
            </Container>
         ))}
      </Container>
   )
}
