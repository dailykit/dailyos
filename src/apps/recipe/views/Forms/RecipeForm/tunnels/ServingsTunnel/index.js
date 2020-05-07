import React from 'react'
import { TextButton, Text, Input, ButtonTile, HelperText } from '@dailykit/ui'

import { CloseIcon } from '../../../../../assets/icons'

import { TunnelHeader, TunnelBody, Container, Grid } from '../styled'
import { useMutation } from '@apollo/react-hooks'
import { CREATE_SIMPLE_RECIPE_YIELDS } from '../../../../../graphql'
import { toast } from 'react-toastify'

const ServingsTunnel = ({ state, closeTunnel }) => {
   // State
   const [busy, setBusy] = React.useState(false)
   const [servings, setServings] = React.useState([''])

   // {simpleRecipeId: 10, yield: ""}

   // Mutation
   const [createYields] = useMutation(CREATE_SIMPLE_RECIPE_YIELDS, {
      onCompleted: () => {
         toast.success('Added!')
         closeTunnel(3)
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
      const objects = servings
         .filter(serving => serving.length)
         .map(serving => ({
            simpleRecipeId: state.id,
            yield: { serving },
         }))
      if (!objects.length) return toast.error('No serving to add!')
      createYields({
         variables: {
            objects,
         },
      })
   }

   const handleChange = (i, val) => {
      const newServings = servings
      newServings[i] = val
      setServings([...newServings])
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(3)}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">Add Servings</Text>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {busy ? 'Saving...' : 'Save'}
               </TextButton>
            </div>
         </TunnelHeader>
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
                     type="text"
                     label="Serving"
                     name={`serving-${i}`}
                     value={serving}
                     onChange={e => handleChange(i, e.target.value)}
                  />
               </Container>
            ))}
            <ButtonTile
               type="secondary"
               text="Add More"
               onClick={() => setServings([...servings, ''])}
            />
         </TunnelBody>
      </React.Fragment>
   )
}

export default ServingsTunnel
