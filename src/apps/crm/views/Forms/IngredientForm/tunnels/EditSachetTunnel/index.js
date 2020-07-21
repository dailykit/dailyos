import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { Input, Toggle, TunnelHeader, Loader } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { IngredientContext } from '../../../../../context/ingredient'
import { UPDATE_SACHET, FETCH_UNITS } from '../../../../../graphql'
import {
   Container,
   StyledInputWrapper,
   TunnelBody,
   StyledSelect,
} from '../styled'

const EditSachetTunnel = ({ state, closeTunnel }) => {
   const { ingredientState } = React.useContext(IngredientContext)

   const sachet =
      state.ingredientProcessings[ingredientState.processingIndex]
         .ingredientSachets[ingredientState.sachetIndex]

   const [busy, setBusy] = React.useState(false)
   const [units, setUnits] = React.useState([])

   const [tracking, setTracking] = React.useState(sachet.tracking)
   const [quantity, setQuantity] = React.useState(sachet.quantity)
   const [unit, setUnit] = React.useState(sachet.unit)

   // Subscription
   const { loading } = useSubscription(FETCH_UNITS, {
      onSubscriptionData: data => {
         setUnits([...data.subscriptionData.data.units])
      },
      onError: error => {
         console.log(error)
      },
   })

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
         closeTunnel(1)
      },
      onError: () => {
         toast.error('Error')
         setBusy(false)
      },
   })

   // Handler
   const save = () => {
      try {
         if (busy) return
         setBusy(true)
         if (!quantity || Number.isNaN(quantity) || parseInt(quantity) === 0) {
            throw Error('Invalid Quantity!')
         }
         updateSachet()
      } catch (e) {
         toast.error(e.message)
         setBusy(false)
      }
   }

   return (
      <>
         <TunnelHeader
            title="Configure Sachet"
            right={{ action: save, title: busy ? 'Saving...' : 'Save' }}
            close={() => closeTunnel(1)}
         />
         <TunnelBody>
            {loading ? (
               <Loader />
            ) : (
               <>
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
                           {units.map(item => (
                              <option key={item.id} value={item.title}>
                                 {item.title}
                              </option>
                           ))}
                        </StyledSelect>
                     </StyledInputWrapper>
                  </Container>
               </>
            )}
         </TunnelBody>
      </>
   )
}

export default EditSachetTunnel
