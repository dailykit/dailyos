import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   Input,
   RadioGroup,
   Select,
   TunnelHeader,
   IconButton,
   Text,
   TextButton,
   useTunnel,
   Flex,
   Form,
   PlusIcon,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { EditIcon } from '../../../../../assets/icons'
import { IngredientContext } from '../../../../../context/ingredient'
import { UPDATE_MODE } from '../../../../../graphql'
import { StyledInputWrapper, TunnelBody } from '../styled'
import { StyledTable } from './styled'
import { OperationConfig } from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import validator from '../../validators'

const EditModeTunnel = ({ closeTunnel, openTunnel }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

   const [
      operationConfigTunnels,
      openOperationConfigTunnel,
      closeOperationConfigTunnel,
   ] = useTunnel(4)

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
   const [updateMode, { loading: inFlight }] = useMutation(UPDATE_MODE, {
      onCompleted: () => {
         toast.success('Mode updated!')
         close()
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   // Handlers
   const save = () => {
      try {
         if (inFlight) return
         updateMode({
            variables: {
               id: ingredientState.editMode.id,
               set: {
                  priority: ingredientState.editMode.priority.value ?? 1,
                  accuracy: ingredientState.editMode.accuracy,
                  bulkItemId: ingredientState.editMode.bulkItem?.id || null,
                  sachetItemId: ingredientState.editMode.sachetItem?.id || null,
                  packagingId: ingredientState.editMode.packaging?.id || null,
                  operationConfigId:
                     ingredientState.editMode.operationConfig?.id || null,
               },
            },
         })
      } catch (error) {
         toast.error('Something went wrong!')
         logger(error)
      }
   }

   return (
      <>
         <OperationConfig
            tunnels={operationConfigTunnels}
            openTunnel={openOperationConfigTunnel}
            closeTunnel={closeOperationConfigTunnel}
            onSelect={config =>
               ingredientDispatch({
                  type: 'EDIT_MODE',
                  payload: {
                     ...ingredientState.editMode,
                     operationConfig: config,
                  },
               })
            }
         />
         <TunnelHeader
            title="Edit Mode"
            right={{ action: save, title: inFlight ? 'Saving...' : 'Save' }}
            close={close}
         />
         <TunnelBody>
            <StyledTable cellSpacing={0}>
               <thead>
                  <tr>
                     <th>Mode of Fulfillment</th>
                     <th>Priority</th>
                     <th>Item</th>
                     <th>Accuracy</th>
                     <th>Packaging</th>
                     <th>Operational Configuration</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td>
                        {ingredientState?.editMode?.type === 'realTime'
                           ? 'Real Time'
                           : 'Planned Lot'}
                     </td>
                     <td>
                        <Flex maxWidth="100px">
                           <Form.Stepper
                              id="editModePriority"
                              name="editModePriority"
                              value={ingredientState.editMode.priority.value}
                              placeholder="Enter priority"
                              onChange={value =>
                                 ingredientDispatch({
                                    type: 'EDIT_MODE',
                                    payload: {
                                       ...ingredientState?.editMode,
                                       priority: {
                                          ...ingredientState?.editMode.priority,
                                          value,
                                       },
                                    },
                                 })
                              }
                              onBlur={() => {
                                 const { isValid, errors } = validator.priority(
                                    ingredientState.editMode.priority.value
                                 )
                                 ingredientDispatch({
                                    type: 'EDIT_MODE',
                                    payload: {
                                       ...ingredientState?.editMode.priority,
                                       meta: {
                                          isTouched: true,
                                          isValid,
                                          errors,
                                       },
                                    },
                                 })
                              }}
                           />
                           {ingredientState.editMode.priority.meta.isTouched &&
                              !ingredientState.editMode.priority.meta.isValid &&
                              ingredientState.editMode.priority.meta.errors.map(
                                 (error, index) => (
                                    <Form.Error key={index}>{error}</Form.Error>
                                 )
                              )}
                        </Flex>
                     </td>
                     <td>
                        {ingredientState?.editMode?.bulkItem ||
                        ingredientState?.editMode?.sachetItem ? (
                           <Flex container>
                              {ingredientState?.editMode?.bulkItem?.title ||
                                 ingredientState?.editMode?.sachetItem?.title}
                              <IconButton
                                 type="ghost"
                                 onClick={() => openTunnel(3)}
                              >
                                 <EditIcon color="#00A7E1" />
                              </IconButton>
                           </Flex>
                        ) : (
                           <IconButton
                              type="ghost"
                              onClick={() => openTunnel(3)}
                           >
                              <PlusIcon color="#00A7E1" />
                           </IconButton>
                        )}
                     </td>
                     <td>
                        <RadioGroup
                           options={options}
                           active={
                              options.find(
                                 op =>
                                    op.value ===
                                    ingredientState?.editMode?.accuracy
                              )?.id || 3
                           }
                           onChange={option =>
                              ingredientDispatch({
                                 type: 'EDIT_MODE',
                                 payload: {
                                    ...ingredientState?.editMode,
                                    accuracy: option.value,
                                 },
                              })
                           }
                        />
                     </td>
                     <td>
                        {ingredientState.editMode.packaging ? (
                           <Flex container>
                              {ingredientState.editMode.packaging?.title}
                              <IconButton
                                 type="ghost"
                                 onClick={() => openTunnel(4)}
                              >
                                 <EditIcon color="#07A8E2" />
                              </IconButton>
                           </Flex>
                        ) : (
                           <IconButton
                              type="ghost"
                              onClick={() => openTunnel(4)}
                           >
                              <PlusIcon color="#07A8E2" />
                           </IconButton>
                        )}
                     </td>
                     <td>
                        {ingredientState?.editMode?.operationConfig ? (
                           <Flex container>
                              {`${ingredientState.editMode.operationConfig.station.name} - ${ingredientState.editMode.operationConfig.labelTemplate.name}`}
                              <IconButton
                                 type="ghost"
                                 onClick={() => openOperationConfigTunnel(1)}
                              >
                                 <EditIcon color="#07A8E2" />
                              </IconButton>
                           </Flex>
                        ) : (
                           <IconButton
                              type="ghost"
                              onClick={() => openOperationConfigTunnel(1)}
                           >
                              <PlusIcon color="#07A8E2" />
                           </IconButton>
                        )}
                     </td>
                  </tr>
               </tbody>
            </StyledTable>
         </TunnelBody>
      </>
   )
}

export default EditModeTunnel
