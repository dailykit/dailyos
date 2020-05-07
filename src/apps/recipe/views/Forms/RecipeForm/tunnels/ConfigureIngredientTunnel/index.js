import React from 'react'
import { TextButton, Text, Input, Toggle } from '@dailykit/ui'

import { CloseIcon } from '../../../../../assets/icons'

import { TunnelHeader, TunnelBody, Container, Grid } from '../styled'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_RECIPE } from '../../../../../graphql'
import { toast } from 'react-toastify'
import { RecipeContext } from '../../../../../context/recipee'

const ConfigureIngredientTunnel = ({ state, closeTunnel }) => {
   const { recipeState } = React.useContext(RecipeContext)

   // State
   const [busy, setBusy] = React.useState(false)
   const [_state, _setState] = React.useState(recipeState.edit)

   // Mutation
   const [updateRecipe] = useMutation(UPDATE_RECIPE, {
      onCompleted: () => {
         toast.success('Updated!')
         closeTunnel(6)
      },
      onError: error => {
         console.log(error)
         toast.error('Error!')
         setBusy(false)
      },
   })

   //Handlers
   const save = () => {
      if (busy) return
      setBusy(true)
      const ingredients = state.ingredients
      const index = ingredients.findIndex(ing => ing.id === _state.id)
      ingredients[index] = _state
      updateRecipe({
         variables: {
            id: state.id,
            set: {
               ingredients,
            },
         },
      })
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(1)}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">Edit Ingredient Details</Text>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {busy ? 'Saving...' : 'Save'}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <Container bottom="32">
               <Text as="h2">{_state.name}</Text>
               <Text as="title">
                  {_state.ingredientProcessing.processingName}
               </Text>
            </Container>
            <Container bottom="32">
               <Grid>
                  <Toggle
                     checked={_state.isVisible}
                     label="Visibility"
                     setChecked={val =>
                        _setState({ ..._state, isVisible: val })
                     }
                  />
               </Grid>
            </Container>
            <Container bottom="32">
               <Input
                  type="text"
                  label="Slip Name"
                  name="name"
                  value={_state.slipName}
                  onChange={e =>
                     _setState({ ..._state, slipName: e.target.value })
                  }
               />
            </Container>
         </TunnelBody>
      </React.Fragment>
   )
}

export default ConfigureIngredientTunnel
