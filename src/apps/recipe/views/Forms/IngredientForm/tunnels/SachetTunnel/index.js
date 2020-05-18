import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   Checkbox,
   Input,
   RadioGroup,
   Select,
   Text,
   TextButton,
   Toggle,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { CloseIcon } from '../../../../../assets/icons'
import { IngredientContext } from '../../../../../context/ingredient'
import { CREATE_SACHET } from '../../../../../graphql'
import {
   StyledInputWrapper,
   StyledRow,
   TunnelBody,
   TunnelHeader,
} from '../styled'
import { StyledTable } from './styled'

const SachetTunnel = ({ state, closeTunnel, openTunnel, units }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

   // State
   const [busy, setBusy] = React.useState(false)
   const [quantity, setQuantity] = React.useState('')
   const [unit, setUnit] = React.useState(units[0]?.title || '')
   const [tracking, setTracking] = React.useState(true)

   const options = [
      { id: 1, title: 'Atleast 80%', value: '80' },
      { id: 2, title: 'Atleast 95%', value: '95' },
      { id: 3, title: "Don't Weigh", value: '0' },
   ]

   // Mutations
   const [createSachet] = useMutation(CREATE_SACHET, {
      onCompleted: () => {
         toast.success('Sachet added!')
         close()
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
         setBusy(false)
      },
   })

   // Handlers
   const close = () => {
      ingredientDispatch({
         type: 'CLEAN',
      })
      closeTunnel(2)
   }
   const add = () => {
      try {
         if (busy) return
         setBusy(true)
         if (!quantity || isNaN(quantity) || parseInt(quantity) === 0) {
            throw Error('Invalid Quantity!')
         }
         if (
            !ingredientState.realTime.priority ||
            isNaN(ingredientState.realTime.priority) ||
            parseInt(ingredientState.realTime.priority) === 0
         ) {
            throw Error('Invalid Priority!')
         }
         if (
            !ingredientState.plannedLot.priority ||
            isNaN(ingredientState.plannedLot.priority) ||
            parseInt(ingredientState.plannedLot.priority) === 0
         ) {
            throw Error('Invalid Priority!')
         }
         const object = {
            ingredientId: state.id,
            ingredientProcessingId:
               state.ingredientProcessings[ingredientState.processingIndex].id,
            quantity,
            unit,
            tracking,
            modeOfFulfillments: {
               data: [
                  {
                     type: 'realTime',
                     stationId: ingredientState.realTime.station?.id || null,
                     isPublished: ingredientState.realTime.isPublished,
                     isLive: ingredientState.realTime.isLive,
                     priority: parseInt(ingredientState.realTime.priority),
                     bulkItemId: ingredientState.realTime.bulkItem?.id || null,
                     sachetItemId: null,
                     accuracy: ingredientState.realTime.accuracy,
                     packagingId:
                        ingredientState.realTime.packaging?.id || null,
                     labelTemplateId:
                        ingredientState.realTime.labelTemplate?.id || null,
                  },
                  {
                     type: 'plannedLot',
                     stationId: ingredientState.plannedLot.station?.id || null,
                     isPublished: ingredientState.plannedLot.isPublished,
                     isLive: ingredientState.plannedLot.isLive,
                     priority: parseInt(ingredientState.plannedLot.priority),
                     bulkItemId: null,
                     sachetItemId:
                        ingredientState.plannedLot.sachetItem?.id || null,
                     accuracy: ingredientState.plannedLot.accuracy,
                     packagingId:
                        ingredientState.plannedLot.packaging?.id || null,
                     labelTemplateId:
                        ingredientState.plannedLot.labelTemplate?.id || null,
                  },
               ],
            },
         }
         createSachet({
            variables: {
               objects: [object],
            },
         })
      } catch (e) {
         toast.error(e.message)
         setBusy(false)
      }
   }
   const propagate = (type, val) => {
      if (
         val &&
         !(ingredientState[type].sachetItem || ingredientState[type].bulkItem)
      ) {
         ingredientDispatch({
            type: 'CURRENT_MODE',
            payload: type,
         })
         openTunnel(3)
      }
      ingredientDispatch({
         type: 'MODE',
         payload: {
            mode: type,
            name: 'isLive',
            value: val,
         },
      })
   }
   const selectPackaging = type => {
      ingredientDispatch({
         type: 'CURRENT_MODE',
         payload: type,
      })
      openTunnel(5)
   }
   const selectLabelTemplate = type => {
      ingredientDispatch({
         type: 'CURRENT_MODE',
         payload: type,
      })
      openTunnel(6)
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={close}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">Add Sachet</Text>
            </div>
            <div>
               <TextButton type="solid" onClick={add}>
                  {busy ? 'Adding...' : 'Add'}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <StyledRow>
               <StyledInputWrapper width="300">
                  <Input
                     type="text"
                     label="Quantity"
                     value={quantity}
                     onChange={e => setQuantity(e.target.value)}
                  />
                  <select onChange={e => setUnit(e.target.value)}>
                     {units.map(unit => (
                        <option key={unit.id} value={unit.title}>
                           {unit.title}
                        </option>
                     ))}
                  </select>
               </StyledInputWrapper>
            </StyledRow>
            <StyledRow>
               <StyledInputWrapper width="300">
                  <Toggle
                     label="Track Inventory"
                     checked={tracking}
                     setChecked={val => setTracking(val)}
                  />
               </StyledInputWrapper>
            </StyledRow>
            <StyledTable cellSpacing={0}>
               <thead>
                  <tr>
                     <th>Mode of Fulfillment</th>
                     <th>Priority</th>
                     <th>Station</th>
                     <th>Item</th>
                     <th>Accuracy</th>
                     <th>Packaging</th>
                     <th>Label</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td>
                        <Checkbox
                           checked={ingredientState.realTime.isLive}
                           onChange={val => propagate('realTime', val)}
                        />
                        Real Time
                     </td>
                     <td>
                        <StyledInputWrapper width="50">
                           <Input
                              type="text"
                              value={ingredientState.realTime.priority}
                              onChange={e =>
                                 ingredientDispatch({
                                    type: 'MODE',
                                    payload: {
                                       mode: 'realTime',
                                       name: 'priority',
                                       value: e.target.value,
                                    },
                                 })
                              }
                           />
                        </StyledInputWrapper>
                     </td>
                     <td>{ingredientState.realTime.station?.title || '-'}</td>
                     <td>{ingredientState.realTime.bulkItem?.title || '-'}</td>
                     <td>
                        {ingredientState.realTime.bulkItem ? (
                           <RadioGroup
                              options={options}
                              active={3}
                              onChange={option =>
                                 ingredientDispatch({
                                    type: 'MODE',
                                    payload: {
                                       mode: 'realTime',
                                       name: 'accuracy',
                                       value: option.value,
                                    },
                                 })
                              }
                           />
                        ) : (
                           '-'
                        )}
                     </td>
                     <td>
                        {ingredientState.realTime.bulkItem ? (
                           <Select
                              option={ingredientState.realTime.packaging || []}
                              addOption={() => selectPackaging('realTime')}
                              removeOption={() =>
                                 ingredientDispatch({
                                    type: 'MODE',
                                    payload: {
                                       mode: 'realTime',
                                       name: 'packaging',
                                       value: undefined,
                                    },
                                 })
                              }
                           />
                        ) : (
                           '-'
                        )}
                     </td>
                     <td>
                        {ingredientState.realTime.bulkItem ? (
                           <Select
                              option={
                                 ingredientState.realTime.labelTemplate || []
                              }
                              addOption={() => selectLabelTemplate('realTime')}
                              removeOption={() =>
                                 ingredientDispatch({
                                    type: 'MODE',
                                    payload: {
                                       mode: 'realTime',
                                       name: 'labelTemplate',
                                       value: undefined,
                                    },
                                 })
                              }
                           />
                        ) : (
                           '-'
                        )}
                     </td>
                  </tr>
                  <tr>
                     <td>
                        <Checkbox
                           checked={ingredientState.plannedLot.isLive}
                           onChange={val => propagate('plannedLot', val)}
                        />
                        Planned Lot
                     </td>
                     <td>
                        <StyledInputWrapper width="50">
                           <Input
                              type="text"
                              value={ingredientState.plannedLot.priority}
                              onChange={e =>
                                 ingredientDispatch({
                                    type: 'MODE',
                                    payload: {
                                       mode: 'plannedLot',
                                       name: 'priority',
                                       value: e.target.value,
                                    },
                                 })
                              }
                           />
                        </StyledInputWrapper>
                     </td>
                     <td>{ingredientState.plannedLot.station?.title || '-'}</td>
                     <td>
                        {ingredientState.plannedLot.sachetItem?.title || '-'}
                     </td>
                     <td>
                        {ingredientState.plannedLot.sachetItem ? (
                           <RadioGroup
                              options={options}
                              active={3}
                              onChange={option =>
                                 ingredientDispatch({
                                    type: 'MODE',
                                    payload: {
                                       mode: 'plannedLot',
                                       name: 'accuracy',
                                       value: option.value,
                                    },
                                 })
                              }
                           />
                        ) : (
                           '-'
                        )}
                     </td>
                     <td>
                        {ingredientState.plannedLot.sachetItem ? (
                           <Select
                              option={
                                 ingredientState.plannedLot.packaging || []
                              }
                              addOption={() => selectPackaging('plannedLot')}
                              removeOption={() =>
                                 ingredientDispatch({
                                    type: 'MODE',
                                    payload: {
                                       mode: 'plannedLot',
                                       name: 'packaging',
                                       value: undefined,
                                    },
                                 })
                              }
                           />
                        ) : (
                           '-'
                        )}
                     </td>
                     <td>
                        {ingredientState.plannedLot.sachetItem ? (
                           <Select
                              option={
                                 ingredientState.plannedLot.labelTemplate || []
                              }
                              addOption={() =>
                                 selectLabelTemplate('plannedLot')
                              }
                              removeOption={() =>
                                 ingredientDispatch({
                                    type: 'MODE',
                                    payload: {
                                       mode: 'plannedLot',
                                       name: 'labelTemplate',
                                       value: undefined,
                                    },
                                 })
                              }
                           />
                        ) : (
                           '-'
                        )}
                     </td>
                  </tr>
               </tbody>
            </StyledTable>
         </TunnelBody>
      </React.Fragment>
   )
}

export default SachetTunnel
