import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   Checkbox,
   IconButton,
   Text,
   Form,
   Flex,
   Spacer,
} from '@dailykit/ui'
import { toast } from 'react-toastify'

import { StyledTable } from './styled'
import { Container, Grid } from '../styled'
import { UPDATE_MODE } from '../../../../../graphql'
import { IngredientContext } from '../../../../../context/ingredient'
import { currencyFmt, logger } from '../../../../../../../shared/utils'
import { CloseIcon, EditIcon, TickIcon } from '../../../../../assets/icons'
import {
   DragNDrop,
   Nutrition,
   Tooltip,
} from '../../../../../../../shared/components'
import { useDnd } from '../../../../../../../shared/components/DragNDrop/useDnd'

const Sachet = ({ state, openNutritionTunnel, openEditSachetTunnel }) => {
   const { initiatePriority } = useDnd()

   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

   const [sachet, setSachet] = React.useState(
      state.ingredientProcessings[ingredientState.processingIndex]
         .ingredientSachets[ingredientState.sachetIndex]
   )

   React.useEffect(() => {
      if (
         state.ingredientProcessings[ingredientState.processingIndex]
            .ingredientSachets[ingredientState.sachetIndex]
      ) {
         setSachet(
            state.ingredientProcessings[ingredientState.processingIndex]
               .ingredientSachets[ingredientState.sachetIndex]
         )
      } else {
         setSachet(
            state.ingredientProcessings[ingredientState.processingIndex]
               .ingredientSachets[0]
         )
      }
   }, [state, ingredientState.processingIndex, ingredientState.sachetIndex])

   React.useEffect(() => {
      if (sachet.modeOfFulfillments.length) {
         initiatePriority({
            tablename: 'modeOfFulfillment',
            schemaname: 'ingredient',
            data: sachet.modeOfFulfillments,
         })
      }
   }, [sachet])

   // Mutation
   const [updateMode] = useMutation(UPDATE_MODE, {
      onCompleted: () => {
         toast.success('Mode updated!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   // Handlers
   const setLive = (mode, val) => {
      if (val) {
         if (!(mode.operationConfig && (mode.bulkItem || mode.sachetItem))) {
            return toast.error('Mode not configured!')
         }
      }
      return updateMode({
         variables: {
            id: mode.id,
            set: {
               isLive: val,
            },
         },
      })
   }
   const editMOF = mode => {
      ingredientDispatch({
         type: 'EDIT_MODE',
         payload: {
            ...mode,
            packaging: mode.packaging
               ? {
                    ...mode.packaging,
                    title: mode.packaging.name,
                 }
               : null,
            labelTemplate: mode.labelTemplate
               ? {
                    ...mode.labelTemplate,
                    title: mode.labelTemplate.name,
                 }
               : null,
            bulkItem: mode.bulkItem
               ? {
                    ...mode.bulkItem,
                    title: `${mode.bulkItem.supplierItem.name} ${mode.bulkItem.processingName}`,
                 }
               : null,
            sachetItem: mode.sachetItem
               ? {
                    ...mode.sachetItem,
                    title: `${mode.sachetItem.bulkItem.supplierItem.name}  ${mode.sachetItem.bulkItem.processingName} ${mode.sachetItem.unitSize} ${mode.sachetItem.unit}`,
                 }
               : null,
         },
      })
      ingredientDispatch({
         type: 'CURRENT_MODE',
         payload: mode.type,
      })
      openEditSachetTunnel(2)
   }

   return (
      <>
         <Container bottom="32">
            <Grid>
               <Flex container alignItems="center">
                  <span>
                     {sachet.tracking ? (
                        <TickIcon color="#00A7E1" stroke={2} size={20} />
                     ) : (
                        <CloseIcon color="#FF5A52" size={20} />
                     )}
                  </span>
                  <Spacer xAxis size="8px" />
                  <Text as="title">Tracking Inventory</Text>
               </Flex>
               <Flex
                  container
                  alignItems="center"
                  justifyContent="space-between"
               >
                  <Flex container alignItems="center">
                     <Text as="subtitle">Active: </Text>{' '}
                     <Text as="title">
                        {sachet.liveModeOfFulfillment?.type === 'realTime' &&
                           'Real Time'}
                        {sachet.liveModeOfFulfillment?.type === 'plannedLot' &&
                           'Planned Lot'}
                     </Text>
                  </Flex>
                  <IconButton
                     type="ghost"
                     onClick={() => openEditSachetTunnel(1)}
                  >
                     <EditIcon color="#00A7E1" />
                  </IconButton>
               </Flex>
            </Grid>
         </Container>
         <StyledTable cellSpacing="0">
            <thead>
               <tr>
                  <th>
                     <Flex container alignItems="center">
                        Mode of Fulfillment
                        <Tooltip identifier="sachet_mof" />
                     </Flex>
                  </th>
                  <th>
                     <Flex container alignItems="center">
                        Item
                        <Tooltip identifier="sachet_mode_item" />
                     </Flex>
                  </th>
                  <th>
                     <Flex container alignItems="center">
                        Cost
                        <Tooltip identifier="sachet_mode_cost" />
                     </Flex>
                  </th>
                  <th>
                     <Flex container alignItems="center">
                        Accuracy
                        <Tooltip identifier="sachet_mode_accuracy" />
                     </Flex>
                  </th>
                  <th>
                     <Flex container alignItems="center">
                        Packaging
                        <Tooltip identifier="sachet_mode_packaging" />
                     </Flex>
                  </th>
                  <th>
                     <Flex container alignItems="center">
                        Operational Configuration
                        <Tooltip identifier="sachet_mode_opconfig" />
                     </Flex>
                  </th>
                  <th> </th>
               </tr>
            </thead>
            <tbody>
               <DragNDrop
                  list={sachet.modeOfFulfillments}
                  droppableId="mofDroppableId"
                  tablename="modeOfFulfillment"
                  schemaname="ingredient"
               >
                  {sachet.modeOfFulfillments?.map(mode => (
                     <tr key={mode.id}>
                        <td>
                           <Form.Checkbox
                              name={`${mode.type}-modeLive`}
                              value={mode.isLive}
                              onChange={() => setLive(mode, !mode.isLive)}
                           >
                              {mode.type === 'realTime'
                                 ? 'Real Time'
                                 : 'Planned Lot'}
                           </Form.Checkbox>
                        </td>
                        <td>
                           {mode.bulkItem &&
                              `${mode.bulkItem.supplierItem.name} ${mode.bulkItem.processingName}`}
                           {mode.sachetItem &&
                              `${mode.sachetItem.bulkItem.supplierItem.name} ${mode.sachetItem.bulkItem.processingName} ${mode.sachetItem.unitSize} ${mode.sachetItem.unit}`}
                        </td>
                        <td>
                           {currencyFmt(Number(mode.cost.toFixed(2)) || 0)}
                        </td>
                        <td>
                           {mode.accuracy
                              ? `Atleast ${mode.accuracy} %`
                              : "Don't Weigh"}
                        </td>
                        <td>{mode.packaging?.name || '-'}</td>
                        <td>
                           {mode.operationConfig ? (
                              <>
                                 {`${mode.operationConfig.station.name} - ${mode.operationConfig.labelTemplate.name}`}
                              </>
                           ) : (
                              '-'
                           )}
                        </td>
                        <td>
                           <IconButton
                              type="ghost"
                              onClick={() => editMOF(mode)}
                           >
                              <EditIcon color="#00A7E1" />
                           </IconButton>
                        </td>
                     </tr>
                  ))}
               </DragNDrop>
            </tbody>
         </StyledTable>
         <Container top="32">
            <Flex container maxWidth="200px">
               <Text as="subtitle"> Cost </Text>
               <Tooltip identifier="sachet_cost" />
            </Flex>
            <Text as="p">{currencyFmt(Number(sachet.cost) || 0)}</Text>
         </Container>
         <Container top="32">
            <Flex container maxWidth="200px">
               <Text as="subtitle"> Nutrition </Text>
               <Tooltip identifier="sachet_nutritional_info" />
            </Flex>
            {sachet.nutritionalInfo ? (
               <Nutrition data={sachet.nutritionalInfo} vertical />
            ) : (
               <ButtonTile
                  type="secondary"
                  text="Add Nutritional Values"
                  onClick={() => openNutritionTunnel(1)}
               />
            )}
         </Container>
      </>
   )
}

export default Sachet
