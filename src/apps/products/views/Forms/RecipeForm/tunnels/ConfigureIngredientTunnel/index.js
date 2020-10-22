import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Input, Text, Toggle, TunnelHeader } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { RecipeContext } from '../../../../../context/recipe'
import { UPDATE_RECIPE } from '../../../../../graphql'
import { Container, Grid, TunnelBody } from '../styled'

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
      onError: () => {
         toast.error('Error!')
         setBusy(false)
      },
   })

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
      <>
         <TunnelHeader
            title="Edit Ingredient Details"
            right={{ action: save, title: busy ? 'Saving...' : 'Save' }}
            close={() => closeTunnel(6)}
         />
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
      </>
   )
}

export default ConfigureIngredientTunnel
