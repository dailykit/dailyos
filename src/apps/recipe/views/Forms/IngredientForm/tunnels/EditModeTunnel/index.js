import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   Input,
   RadioGroup,
   Select,
   TunnelHeader,
   IconButton,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { EditIcon } from '../../../../../assets/icons'
import { IngredientContext } from '../../../../../context/ingredient'
import { UPDATE_MODE } from '../../../../../graphql'
import { StyledInputWrapper, TunnelBody } from '../styled'
import { StyledTable } from './styled'

const EditModeTunnel = ({ closeTunnel, openTunnel }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

   const [busy, setBusy] = React.useState(false)

   const options = [
      { id: 1, title: 'Atleast 80%', value: '80' },
      { id: 2, title: 'Atleast 95%', value: '95' },
      { id: 3, title: "Don't Weigh", value: '0' },
   ]

   const close = () => {
      closeTunnel(2)
      ingredientDispatch({
         type: 'EDIT_MODE',
         payload: undefined,
      })
      ingredientDispatch({
         type: 'CURRENT_MODE',
         payload: undefined,
      })
   }

   // Mutation
   const [updateMode] = useMutation(UPDATE_MODE, {
      onCompleted: () => {
         toast.success('Mode updated!')
         close()
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
         if (
            !ingredientState.editMode.priority ||
            Number.isNaN(ingredientState.editMode.priority) ||
            parseInt(ingredientState.editMode.priority) === 0
         ) {
            throw Error('Invalid Priority!')
         }
         updateMode({
            variables: {
               id: ingredientState.editMode.id,
               set: {
                  priority: parseInt(ingredientState.editMode.priority),
                  stationId: ingredientState.editMode.station?.id || null,
                  accuracy: ingredientState.editMode.accuracy,
                  bulkItemId: ingredientState.editMode.bulkItem?.id || null,
                  sachetItemId: ingredientState.editMode.sachetItem?.id || null,
                  packagingId: ingredientState.editMode.packaging?.id || null,
                  labelTemplateId:
                     ingredientState.editMode.labelTemplate?.id || null,
               },
            },
         })
      } catch (e) {
         toast.error(e.message)
         setBusy(false)
      }
   }

   return (
      <>
         <TunnelHeader
            title="Edit Mode"
            right={{ action: save, title: busy ? 'Saving...' : 'Save' }}
            close={close}
         />
         <TunnelBody>
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
                        {ingredientState.editMode.type === 'realTime'
                           ? 'Real Time'
                           : 'Planned Lot'}
                     </td>
                     <td>
                        <StyledInputWrapper width="50">
                           <Input
                              type="text"
                              value={ingredientState.editMode.priority}
                              onChange={e =>
                                 ingredientDispatch({
                                    type: 'EDIT_MODE',
                                    payload: {
                                       ...ingredientState.editMode,
                                       priority: e.target.value,
                                    },
                                 })
                              }
                           />
                        </StyledInputWrapper>
                     </td>
                     <td>
                        {ingredientState.editMode.station?.name ||
                           ingredientState.editMode.station?.title ||
                           '-'}
                        <IconButton type="ghost" onClick={() => openTunnel(3)}>
                           <EditIcon color="#00A7E1" />
                        </IconButton>
                     </td>
                     <td>
                        {ingredientState.editMode.bulkItem
                           ? ingredientState.editMode.bulkItem.title
                           : ''}
                        {ingredientState.editMode.sachetItem
                           ? ingredientState.editMode.sachetItem.title
                           : ''}
                        <IconButton type="ghost" onClick={() => openTunnel(4)}>
                           <EditIcon color="#00A7E1" />
                        </IconButton>
                     </td>
                     <td>
                        <RadioGroup
                           options={options}
                           active={
                              options.find(
                                 op =>
                                    op.value ===
                                    ingredientState.editMode.accuracy
                              )?.id || 3
                           }
                           onChange={option =>
                              ingredientDispatch({
                                 type: 'EDIT_MODE',
                                 payload: {
                                    ...ingredientState.editMode,
                                    accuracy: option.value,
                                 },
                              })
                           }
                        />
                     </td>
                     <td>
                        <Select
                           option={ingredientState.editMode.packaging || []}
                           addOption={() => openTunnel(5)}
                           removeOption={() =>
                              ingredientDispatch({
                                 type: 'EDIT_MODE',
                                 payload: {
                                    ...ingredientState.editMode,
                                    packaging: undefined,
                                 },
                              })
                           }
                        />
                     </td>
                     <td>
                        <Select
                           option={ingredientState.editMode.labelTemplate || []}
                           addOption={() => openTunnel(6)}
                           removeOption={() =>
                              ingredientDispatch({
                                 type: 'EDIT_MODE',
                                 payload: {
                                    ...ingredientState.editMode,
                                    labelTemplate: undefined,
                                 },
                              })
                           }
                        />
                     </td>
                  </tr>
               </tbody>
            </StyledTable>
         </TunnelBody>
      </>
   )
}

export default EditModeTunnel
