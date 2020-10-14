import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Checkbox,
   Input,
   RadioGroup,
   Select,
   Toggle,
   TunnelHeader,
   Loader,
   Text,
   TextButton,
   useTunnel,
   Flex,
   Form,
   Spacer,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { IngredientContext } from '../../../../../context/ingredient'
import { CREATE_SACHET, FETCH_UNITS } from '../../../../../graphql'
import {
   StyledInputWrapper,
   StyledRow,
   TunnelBody,
   StyledSelect,
} from '../styled'
import { StyledTable } from './styled'
import {
   OperationConfig,
   Tooltip,
} from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils'
import validator from '../../validators'

const SachetTunnel = ({ state, closeTunnel, openTunnel }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

   const [
      operationConfigTunnels,
      openOperationConfigTunnel,
      closeOperationConfigTunnel,
   ] = useTunnel(4)

   // State
   const [quantity, setQuantity] = React.useState({
      value: '',
      meta: {
         errors: [],
         isValid: false,
         isTouched: false,
      },
   })
   const [unit, setUnit] = React.useState({
      value: '',
      meta: {
         errors: [],
         isValid: false,
         isTouched: false,
      },
   })
   const [tracking, setTracking] = React.useState({
      value: true,
   })

   const options = [
      { id: 1, title: 'Atleast 80%', value: '80' },
      { id: 2, title: 'Atleast 95%', value: '95' },
      { id: 3, title: "Don't Weigh", value: '0' },
   ]

   // Subscription
   const { data: { units = [] } = {}, loading, error } = useSubscription(
      FETCH_UNITS
   )

   if (error) {
      toast.error('Something went wrong!')
      logger(error)
   }

   // Handlers
   const close = () => {
      ingredientDispatch({
         type: 'CLEAN',
      })
      closeTunnel(1)
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
         openTunnel(2)
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
      openTunnel(3)
   }
   const selectOperationConfiguration = type => {
      ingredientDispatch({
         type: 'CURRENT_MODE',
         payload: type,
      })
      openOperationConfigTunnel(1)
   }

   // Mutations
   const [createSachet, { loading: inFlight }] = useMutation(CREATE_SACHET, {
      onCompleted: () => {
         toast.success('Sachet added!')
         close()
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   const add = () => {
      try {
         if (inFlight) return
         if (!quantity || Number.isNaN(quantity) || parseInt(quantity) === 0) {
            throw Error('Invalid Quantity!')
         }
         if (
            !ingredientState.realTime.priority ||
            Number.isNaN(ingredientState.realTime.priority) ||
            parseInt(ingredientState.realTime.priority) === 0
         ) {
            throw Error('Invalid Priority!')
         }
         if (
            !ingredientState.plannedLot.priority ||
            Number.isNaN(ingredientState.plannedLot.priority) ||
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
                     isPublished: ingredientState.realTime.isPublished,
                     isLive: ingredientState.realTime.isLive,
                     priority: parseInt(ingredientState.realTime.priority),
                     bulkItemId: ingredientState.realTime.bulkItem?.id || null,
                     sachetItemId: null,
                     accuracy: ingredientState.realTime.accuracy,
                     packagingId:
                        ingredientState.realTime.packaging?.id || null,
                     operationConfigId:
                        ingredientState.realTime.operationConfig?.id || null,
                  },
                  {
                     type: 'plannedLot',
                     isPublished: ingredientState.plannedLot.isPublished,
                     isLive: ingredientState.plannedLot.isLive,
                     priority: parseInt(ingredientState.plannedLot.priority),
                     bulkItemId: null,
                     sachetItemId:
                        ingredientState.plannedLot.sachetItem?.id || null,
                     accuracy: ingredientState.plannedLot.accuracy,
                     packagingId:
                        ingredientState.plannedLot.packaging?.id || null,
                     operationConfigId:
                        ingredientState.realTime.operationConfig?.id || null,
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
      }
   }

   if (loading) return <Loader />

   return (
      <>
         <OperationConfig
            tunnels={operationConfigTunnels}
            openTunnel={openOperationConfigTunnel}
            closeTunnel={closeOperationConfigTunnel}
            onSelect={config =>
               ingredientDispatch({
                  type: 'MODE',
                  payload: {
                     mode: ingredientState.currentMode,
                     name: 'operationConfig',
                     value: config,
                  },
               })
            }
         />
         <TunnelHeader
            title="Add Sachet"
            right={{ action: add, title: inFlight ? 'Adding...' : 'Add' }}
            close={close}
         />
         <TunnelBody>
            <Flex maxWidth="300px">
               <Form.Group>
                  <Form.Label htmlFor="quantity" title="quantity">
                     Quantity*
                  </Form.Label>
                  <Form.TextSelect>
                     <Form.Number
                        id="quantity"
                        name="quantity"
                        value={quantity.value}
                        placeholder="Enter sachet quantity"
                        onChange={e =>
                           setQuantity({ ...quantity, value: e.target.value })
                        }
                        onBlur={() => {
                           const { isValid, errors } = validator.quantity(
                              quantity.value
                           )
                           setQuantity({
                              ...quantity,
                              meta: {
                                 isTouched: true,
                                 isValid,
                                 errors,
                              },
                           })
                        }}
                     />
                     <Form.Select
                        id="unit"
                        name="unit"
                        options={units}
                        value={unit.value}
                        placeholder="Choose unit"
                        defaultValue={unit.value}
                        onChange={e =>
                           setUnit({ ...unit, value: e.target.value })
                        }
                     />
                  </Form.TextSelect>
                  {quantity.meta.isTouched &&
                     !quantity.meta.isValid &&
                     quantity.meta.errors.map((error, index) => (
                        <Form.Error key={index}>{error}</Form.Error>
                     ))}
               </Form.Group>
            </Flex>
            <Spacer size="24px" />
            <Flex maxWidth="300px">
               <Form.Toggle
                  id="tracking"
                  name="tracking"
                  value={tracking.value}
                  onChange={() =>
                     setTracking({ ...tracking, value: !tracking.value })
                  }
               >
                  Track Inventory
               </Form.Toggle>
            </Flex>
            <Spacer size="24px" />
            <StyledTable cellSpacing={0}>
               <thead>
                  <tr>
                     <th>
                        <Flex container alignItems="center">
                           Mode of Fulfillment
                           <Tooltip identifier="sachet_tunnel_mof" />
                        </Flex>
                     </th>
                     <th>
                        <Flex container alignItems="center">
                           Priority
                           <Tooltip identifier="sachet_tunnel_mode_priority" />
                        </Flex>
                     </th>
                     <th>
                        <Flex container alignItems="center">
                           Item
                           <Tooltip identifier="sachet_tunnel_mode_item" />
                        </Flex>
                     </th>
                     <th>
                        <Flex container alignItems="center">
                           Accuracy
                           <Tooltip identifier="sachet_tunnel_mode_accuracy" />
                        </Flex>
                     </th>
                     <th>
                        <Flex container alignItems="center">
                           Packaging
                           <Tooltip identifier="sachet_tunnel_mode_packaging" />
                        </Flex>
                     </th>
                     <th>
                        <Flex container alignItems="center">
                           Operational Configuration
                           <Tooltip identifier="sachet_tunnel_mode_opconfig" />
                        </Flex>
                     </th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td>
                        <Flex container>
                           <Form.Checkbox
                              id="realTimeIsLive"
                              name="realTimeIsLive"
                              value={ingredientState.realTime.isLive}
                              onChange={() =>
                                 propagate(
                                    'realTime',
                                    !ingredientState.realTime.isLive
                                 )
                              }
                           >
                              Real Time
                           </Form.Checkbox>
                           <Tooltip identifier="sachet_tunnel_real_time" />
                        </Flex>
                     </td>
                     <td>
                        <Flex maxWidth="100px">
                           <Form.Stepper
                              id="realTimePriority"
                              name="realTimePriority"
                              value={ingredientState.realTime.priority.value}
                              placeholder="Enter priority"
                              onChange={value =>
                                 ingredientDispatch({
                                    type: 'MODE',
                                    payload: {
                                       mode: 'realTime',
                                       name: 'priority',
                                       value: {
                                          ...ingredientState.realTime.priority,
                                          value,
                                       },
                                    },
                                 })
                              }
                              onBlur={() => {
                                 const { isValid, errors } = validator.priority(
                                    ingredientState.realTime.priority.value
                                 )
                                 ingredientDispatch({
                                    type: 'MODE',
                                    payload: {
                                       mode: 'realTime',
                                       name: 'priority',
                                       value: {
                                          ...ingredientState.realTime.priority,
                                          meta: {
                                             isTouched: true,
                                             isValid,
                                             errors,
                                          },
                                       },
                                    },
                                 })
                              }}
                           />
                           {ingredientState.realTime.priority.meta.isTouched &&
                              !ingredientState.realTime.priority.meta.isValid &&
                              ingredientState.realTime.priority.meta.errors.map(
                                 (error, index) => (
                                    <Form.Error key={index}>{error}</Form.Error>
                                 )
                              )}
                        </Flex>
                     </td>
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
                        {ingredientState.realTime.operationConfig ? (
                           <Text as="p">
                              {`${ingredientState.realTime.operationConfig.station.name} - ${ingredientState.realTime.operationConfig.labelTemplate.name}`}
                           </Text>
                        ) : (
                           <TextButton
                              type="ghost"
                              onClick={() =>
                                 selectOperationConfiguration('realTime')
                              }
                           >
                              Select
                           </TextButton>
                        )}
                     </td>
                  </tr>
                  <tr>
                     <td>
                        <Flex container>
                           <Form.Checkbox
                              id="plannedLotIsLive"
                              name="plannedLotIsLive"
                              value={ingredientState.plannedLot.isLive}
                              onChange={() =>
                                 propagate(
                                    'plannedLot',
                                    !ingredientState.plannedLot.isLive
                                 )
                              }
                           >
                              Planned Lot
                           </Form.Checkbox>
                           <Tooltip identifier="sachet_tunnel_planned_lot" />
                        </Flex>
                     </td>
                     <td>
                        <Flex maxWidth="100px">
                           <Form.Stepper
                              id="plannedLotPriority"
                              name="plannedLotPriority"
                              value={ingredientState.plannedLot.priority.value}
                              placeholder="Enter priority"
                              onChange={value =>
                                 ingredientDispatch({
                                    type: 'MODE',
                                    payload: {
                                       mode: 'plannedLot',
                                       name: 'priority',
                                       value: {
                                          ...ingredientState.plannedLot
                                             .priority,
                                          value,
                                       },
                                    },
                                 })
                              }
                              onBlur={() => {
                                 const { isValid, errors } = validator.priority(
                                    ingredientState.plannedLot.priority.value
                                 )
                                 ingredientDispatch({
                                    type: 'MODE',
                                    payload: {
                                       mode: 'plannedLot',
                                       name: 'priority',
                                       value: {
                                          ...ingredientState.plannedLot
                                             .priority,
                                          meta: {
                                             isTouched: true,
                                             isValid,
                                             errors,
                                          },
                                       },
                                    },
                                 })
                              }}
                           />
                           {ingredientState.plannedLot.priority.meta
                              .isTouched &&
                              !ingredientState.plannedLot.priority.meta
                                 .isValid &&
                              ingredientState.plannedLot.priority.meta.errors.map(
                                 (error, index) => (
                                    <Form.Error key={index}>{error}</Form.Error>
                                 )
                              )}
                        </Flex>
                     </td>
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
                        {ingredientState.plannedLot.operationConfig ? (
                           <Text as="p">
                              {`${ingredientState.plannedLot.operationConfig.station.name} - ${ingredientState.plannedLot.operationConfig.labelTemplate.name}`}
                           </Text>
                        ) : (
                           <TextButton
                              type="ghost"
                              onClick={() =>
                                 selectOperationConfiguration('plannedLot')
                              }
                           >
                              Select
                           </TextButton>
                        )}
                     </td>
                  </tr>
               </tbody>
            </StyledTable>
         </TunnelBody>
      </>
   )
}

export default SachetTunnel
