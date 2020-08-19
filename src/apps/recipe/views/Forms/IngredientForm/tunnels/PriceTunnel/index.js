import React from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { TunnelHeader, Input } from '@dailykit/ui'
import { TunnelBody, Grid, StyledInputWrapper } from '../styled'
import { IngredientContext } from '../../../../../context/ingredient'
import { UPDATE_PROCESSING } from '../../../../../graphql'

const PriceTunnel = ({ state, close }) => {
   const { ingredientState } = React.useContext(IngredientContext)

   const [busy, setBusy] = React.useState(false)

   const [cost, setCost] = React.useState(
      state.ingredientProcessings[ingredientState.processingIndex].cost || {
         value: 0,
         per: 100,
      }
   )

   // Mutation
   const [updateProcessing] = useMutation(UPDATE_PROCESSING, {
      onCompleted: () => {
         toast.success('Cost updated!')
         close(1)
      },
      onError: () => {
         toast.error('Error')
         setBusy(false)
      },
   })

   // Handlers
   const save = () => {
      try {
         if (busy) return
         setBusy(true)
         updateProcessing({
            variables: {
               id:
                  state.ingredientProcessings[ingredientState.processingIndex]
                     .id,
               set: {
                  cost,
               },
            },
         })
      } catch (err) {
         toast.error('Error')
         console.log(err)
      } finally {
         setBusy(false)
      }
   }

   return (
      <>
         <TunnelHeader
            title={`Add Cost for ${
               state.ingredientProcessings[ingredientState.processingIndex]
                  .processingName
            } ${state.name}`}
            right={{ action: save, title: busy ? 'Saving...' : 'Save' }}
            close={() => close(1)}
         />
         <TunnelBody>
            <Grid>
               <StyledInputWrapper>
                  $
                  <Input
                     type="number"
                     label="Cost"
                     name="cost"
                     value={cost.value}
                     onChange={e => setCost({ ...cost, value: e.target.value })}
                  />
               </StyledInputWrapper>
               <StyledInputWrapper>
                  <Input
                     type="number"
                     label="Per"
                     name="per"
                     value={cost.per}
                     onChange={e => setCost({ ...cost, per: e.target.value })}
                  />
                  gms
               </StyledInputWrapper>
            </Grid>
         </TunnelBody>
      </>
   )
}

export default PriceTunnel
