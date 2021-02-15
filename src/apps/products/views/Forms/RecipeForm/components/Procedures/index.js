import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   Flex,
   IconButton,
   Spacer,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
   Form,
   ComboButton,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { Tooltip } from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import { EditIcon } from '../../../../../assets/icons'
import { UPDATE_RECIPE } from '../../../../../graphql'
import { ProceduresTunnel, StepPhotoTunnel } from '../../tunnels'
import { Container, ContainerAction } from '../styled'
import { Image } from './styled'

const Procedures = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)

   // Mutation
   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
      onCompleted: () => {
         toast.success('Updated!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

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
         <Flex container alignItems="center" justifyContent="flex-end">
            {/* <Flex container alignItems="center">
               <Text as="subtitle">Cooking Steps</Text>
               <Tooltip identifier="recipe_cooking_steps" />
            </Flex> */}
            <Flex container alignItems="center">
               <ComboButton
                  type="ghost"
                  size="sm"
                  onClick={() => openTunnel(1)}
               >
                  Edit Cooking Steps
                  <EditIcon color="#10B1EA" />
               </ComboButton>
               <Spacer xAxis size="16px" />
               <Form.Checkbox
                  name="showProcedures"
                  value={state.showProcedures}
                  onChange={() =>
                     updateRecipe({
                        variables: {
                           id: state.id,
                           set: {
                              showProcedures: !state.showProcedures,
                           },
                        },
                     })
                  }
               >
                  <Flex container alignItems="center">
                     Show Cooking Steps on Store
                     <Tooltip identifier="recipe_show_procedures" />
                  </Flex>
               </Form.Checkbox>
            </Flex>
         </Flex>
         <Spacer size="8px" />
         {state.procedures?.length ? (
            <Container>
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
