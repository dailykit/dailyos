import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Input, Text, TextButton, Toggle } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { CloseIcon } from '../../../../../assets/icons'
import { IngredientContext } from '../../../../../context/ingredient'
import { UPDATE_SACHET } from '../../../../../graphql'
import {
   Container,
   StyledInputWrapper,
   TunnelBody,
   TunnelHeader,
   StyledSelect,
} from '../styled'

const EditSachetTunnel = ({ state, units, closeTunnel }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

   const sachet =
      state.ingredientProcessings[ingredientState.processingIndex]
         .ingredientSachets[ingredientState.sachetIndex]

   const [busy, setBusy] = React.useState(false)

   const [tracking, setTracking] = React.useState(sachet.tracking)
   const [quantity, setQuantity] = React.useState(sachet.quantity)
   const [unit, setUnit] = React.useState(sachet.unit)

   // Mutation
   const [updateSachet] = useMutation(UPDATE_SACHET, {
      variables: {
         id: sachet.id,
         set: {
            tracking,
            quantity,
            unit,
         },
      },
      onCompleted: () => {
         toast.success('Sachet updated!')
         closeTunnel(7)
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
         setBusy(false)
      },
   })

   // Handler
   const save = () => {
      try {
         if (busy) return
         setBusy(true)
         if (!quantity || isNaN(quantity) || parseInt(quantity) === 0) {
            throw Error('Invalid Quantity!')
         }
         updateSachet()
      } catch (e) {
         toast.error(e.message)
         setBusy(false)
      }
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(7)}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">Configure Sachet</Text>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {busy ? 'Saving...' : 'Save'}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <Container bottom="32">
               <StyledInputWrapper width="300">
                  <Toggle
                     label="Track Inventory"
                     checked={tracking}
                     setChecked={val => setTracking(val)}
                  />
               </StyledInputWrapper>
            </Container>
            <Container bottom="32">
               <StyledInputWrapper width="300">
                  <Input
                     type="text"
                     label="Quantity"
                     value={quantity}
                     onChange={e => setQuantity(e.target.value)}
                  />
                  <StyledSelect
                     value={unit}
                     onChange={e => setUnit(e.target.value)}
                  >
                     {units.map(unit => (
                        <option key={unit.id} value={unit.title}>
                           {unit.title}
                        </option>
                     ))}
                  </StyledSelect>
               </StyledInputWrapper>
            </Container>
         </TunnelBody>
      </React.Fragment>
   )
}

export default EditSachetTunnel
