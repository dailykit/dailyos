import React from 'react'
import { Select, Text, ButtonTile } from '@dailykit/ui'

import { Container } from '../styled'
import { useMutation } from '@apollo/react-hooks'
import { DELETE_SIMPLE_RECIPE_YIELD } from '../../../../../graphql'
import { toast } from 'react-toastify'

const Servings = ({ state, openTunnel }) => {
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
      <Container top="32" paddingX="32">
         <Text as="subtitle">Servings</Text>
         <Container>
            {options.length ? (
               <Select
                  options={options}
                  addOption={() => openTunnel(3)}
                  placeholder="Add Servings"
                  removeOption={remove}
               />
            ) : (
               <ButtonTile
                  type="secondary"
                  text="Add Servings"
                  onClick={() => openTunnel(3)}
               />
            )}
         </Container>
      </Container>
   )
}

export default Servings
