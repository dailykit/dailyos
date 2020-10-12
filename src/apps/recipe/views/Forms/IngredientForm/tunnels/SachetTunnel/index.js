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
import { OperationConfig } from '../../../../../../../shared/components'

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
   const [busy, setBusy] = React.useState(false)
   const [quantity, setQuantity] = React.useState('')
   const [units, setUnits] = React.useState([])
   const [unit, setUnit] = React.useState(units[0]?.title || '')
   const [tracking, setTracking] = React.useState(true)

   const options = [
      { id: 1, title: 'Atleast 80%', value: '80' },
      { id: 2, title: 'Atleast 95%', value: '95' },
      { id: 3, title: "Don't Weigh", value: '0' },
   ]

   // Subscription
   const { loading } = useSubscription(FETCH_UNITS, {
      onSubscriptionData: data => {
         console.log(
            'SachetTunnel -> data.subscriptionData.data.units',
            data.subscriptionData.data.units
         )
         setUnits([...data.subscriptionData.data.units])
      },
      onError: error => {
         console.log(error)
      },
   })

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
      openTunnel(4)
   }
   const selectOperationConfiguration = type => {
      ingredientDispatch({
         type: 'CURRENT_MODE',
         payload: type,
      })
      openOperationConfigTunnel(1)
   }

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

   const add = () => {
      try {
         if (busy) return
         setBusy(true)
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
         setBusy(false)
      }
   }

   React.useEffect(() => {
      if (units.length) {
         setUnit(units[0].title)
      }
   }, [units])

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
            right={{ action: add, title: busy ? 'Adding...' : 'Add' }}
            close={close}
         />
         <TunnelBody>
            <StyledRow>
               <StyledInputWrapper width="300">
                  <Input
                     type="text"
                     label="Quantity"
                     value={quantity}
                     onChange={e => setQuantity(e.target.value)}
                  />
                  <StyledSelect onChange={e => setUnit(e.target.value)}>
                     {units.map(item => (
                        <option key={item.id} value={item.title}>
                           {item.title}
                        </option>
                     ))}
                  </StyledSelect>
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
                     <th>Item</th>
                     <th>Accuracy</th>
                     <th>Packaging</th>
                     <th>Operational Configuration</th>
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
                           <Text type="p">
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
                           <Text type="p">
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
