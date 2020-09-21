import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ButtonTile, HelperText, Input, TunnelHeader } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { CREATE_SIMPLE_RECIPE_YIELDS } from '../../../../../graphql'
import { Container, TunnelBody } from '../styled'

const ServingsTunnel = ({ state, closeTunnel }) => {
   // State
   const [busy, setBusy] = React.useState(false)
   const [servings, setServings] = React.useState([''])

   // Mutation
   const [createYields] = useMutation(CREATE_SIMPLE_RECIPE_YIELDS, {
      onCompleted: () => {
         toast.success('Added!')
         closeTunnel(1)
      },
      onError: () => {
         toast.error('Error!')
         setBusy(false)
      },
   })

   const save = () => {
      if (busy) return
      setBusy(true)
      const objects = servings
         .filter(serving => serving.trim().length)
         .map(serving => ({
            simpleRecipeId: state.id,
            yield: { serving: +serving.trim() },
         }))
      if (!objects.length) {
         toast.error('No serving to add!')
      } else {
         createYields({
            variables: {
               objects,
            },
         })
      }
   }

   const handleChange = (i, val) => {
      const newServings = servings
      newServings[i] = val
      setServings([...newServings])
   }

   const addField = () => {
      if (servings.every(serving => serving.trim().length)) {
         setServings([...servings, ''])
      }
   }

   return (
      <>
         <TunnelHeader
            title="Add Servings"
            right={{ action: save, title: busy ? 'Saving...' : 'Save' }}
            close={() => closeTunnel(1)}
         />
         <TunnelBody>
            <Container bottom="16">
               <HelperText
                  type="hint"
                  message="Any field with no value won't be added."
               />
            </Container>
            {servings.map((serving, i) => (
               <Container bottom="16" key={i}>
                  <Input
                     type="number"
                     label="Serving"
                     name={`serving-${i}`}
                     value={serving}
                     onChange={e => handleChange(i, e.target.value)}
                  />
               </Container>
            ))}
            <ButtonTile type="secondary" text="Add More" onClick={addField} />
         </TunnelBody>
      </>
   )
}

export default ServingsTunnel
