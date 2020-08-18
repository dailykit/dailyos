import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ButtonTile, Checkbox, IconButton, Text } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { CloseIcon, EditIcon, TickIcon } from '../../../../../assets/icons'
import { IngredientContext } from '../../../../../context/ingredient'
import { UPDATE_MODE } from '../../../../../graphql'
import { Container, Flex, Grid } from '../styled'
import { StyledTable } from './styled'
import { Nutrition } from '../../../../../../../shared/components'

const Sachet = ({ state, openNutritionTunnel, openEditSachetTunnel }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

   const [sachet, setSachet] = React.useState(
      state.ingredientProcessings[ingredientState.processingIndex]
         .ingredientSachets[ingredientState.sachetIndex]
   )

   React.useEffect(() => {
      setSachet(
         state.ingredientProcessings[ingredientState.processingIndex]
            .ingredientSachets[ingredientState.sachetIndex]
      )
   }, [state, ingredientState.sachetIndex])

   // Mutation
   const [updateMode] = useMutation(UPDATE_MODE, {
      onCompleted: () => {
         toast.success('Mode updated!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   // Handlers
   const setLive = (mode, val) => {
      if (val) {
         if (!(mode.station && (mode.bulkItem || mode.sachetItem))) {
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
               <Flex justify="start" align="center">
                  <span>
                     {sachet.tracking ? (
                        <TickIcon color="#00A7E1" stroke={2} size={20} />
                     ) : (
                        <CloseIcon color="#FF5A52" size={20} />
                     )}
                  </span>
                  <Text as="title">Tracking Inventory</Text>
               </Flex>
               <Flex align="center">
                  <Flex justify="start" align="baseline">
                     <Text as="subtitle">Active: </Text>{' '}
                     <Text as="title">
                        {sachet.liveModeOfFulfillment?.type === 'realTime' &&
                           'Real Time'}
                        {sachet.liveModeOfFulfillment?.type === 'plannedLot' &&
                           'Planned Lot'}
                     </Text>
                  </Flex>
                  <IconButton onClick={() => openEditSachetTunnel(1)}>
                     <EditIcon color="#00A7E1" />
                  </IconButton>
               </Flex>
            </Grid>
         </Container>
         <StyledTable cellSpacing="0">
            <thead>
               <tr>
                  <th>Mode of Fulfillment</th>
                  <th>Priority</th>
                  <th>Station</th>
                  <th>Item</th>
                  <th>Accuracy</th>
                  <th>Packaging</th>
                  <th>Label</th>
                  <th> </th>
               </tr>
            </thead>
            <tbody>
               {sachet.modeOfFulfillments?.map(mode => (
                  <tr key={mode.id}>
                     <td>
                        <Checkbox
                           checked={mode.isLive}
                           onChange={val => setLive(mode, val)}
                        />
                        {mode.type === 'realTime' ? 'Real Time' : 'Planned Lot'}
                     </td>
                     <td>{mode.priority}</td>
                     <td>{mode.station?.name || ''}</td>
                     <td>
                        {mode.bulkItem &&
                           `${mode.bulkItem.supplierItem.name} ${mode.bulkItem.processingName}`}
                        {mode.sachetItem &&
                           `${mode.sachetItem.bulkItem.supplierItem.name} ${mode.sachetItem.bulkItem.processingName} ${mode.sachetItem.unitSize} ${mode.sachetItem.unit}`}
                     </td>
                     <td>
                        {mode.accuracy
                           ? `Atleast ${mode.accuracy} %`
                           : "Don't Weigh"}
                     </td>
                     <td>{mode.packaging?.name || '-'}</td>
                     <td>{mode.labelTemplate?.title || '-'}</td>
                     <td>
                        <IconButton type="ghost" onClick={() => editMOF(mode)}>
                           <EditIcon color="#00A7E1" />
                        </IconButton>
                     </td>
                  </tr>
               ))}
            </tbody>
         </StyledTable>
         <Container top="32">
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
