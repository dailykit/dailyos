import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   Select,
   Text,
   Tunnels,
   Tunnel,
   useTunnel,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { DELETE_SIMPLE_RECIPE_YIELD } from '../../../../../graphql'
import { Container } from '../styled'
import { ServingsTunnel } from '../../tunnels'

const Servings = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const options =
      state.simpleRecipeYields?.map(option => {
         return {
            id: option.id,
            title: option.yield.serving,
         }
      }) || []

   // Mutation
   const [deleteYield] = useMutation(DELETE_SIMPLE_RECIPE_YIELD, {
      onCompleted: () => {
         toast.success('Deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error!')
      },
   })

   // Handlers
   const remove = serving => {
      const check = window.confirm(
         `Are you sure you want to delete serving - ${serving.title}?`
      )
      if (check)
         deleteYield({
            variables: {
               id: serving.id,
            },
         })
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <ServingsTunnel state={state} closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <Container top="32" paddingX="32">
            <Text as="subtitle">Servings</Text>
            <Container>
               {options.length ? (
                  <Select
                     options={options}
                     addOption={() => openTunnel(1)}
                     placeholder="Add Servings"
                     removeOption={remove}
                  />
               ) : (
                  <ButtonTile
                     type="secondary"
                     text="Add Servings"
                     onClick={() => openTunnel(1)}
                  />
               )}
            </Container>
         </Container>
      </>
   )
}

export default Servings
