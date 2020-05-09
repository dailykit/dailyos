import React from 'react'
import { Text, IconButton, Checkbox } from '@dailykit/ui'

import { TickIcon, CloseIcon, EditIcon } from '../../../../../assets/icons'

import { Container, Flex, Grid } from '../styled'
import { StyledTable } from './styled'

import { IngredientContext } from '../../../../../context/ingredient'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_MODE } from '../../../../../graphql'

const Sachet = ({ state, openTunnel }) => {
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
   }, [state])

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
      updateMode({
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
                    title:
                       mode.bulkItem.supplierItem.name +
                       ' ' +
                       mode.bulkItem.processingName,
                 }
               : null,
            sachetItem: mode.sachetItem
               ? {
                    ...mode.sachetItem,
                    title:
                       mode.sachetItem.bulkItem.supplierItem.name +
                       ' ' +
                       mode.sachetItem.bulkItem.processingName +
                       ' ' +
                       mode.sachetItem.unitSize +
                       ' ' +
                       mode.sachetItem.unit,
                 }
               : null,
         },
      })
      ingredientDispatch({
         type: 'CURRENT_MODE',
         payload: mode.type,
      })
      openTunnel(8)
   }

   return (
      <React.Fragment>
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
                     <Text as="subtitle">Active:</Text>{' '}
                     <Text as="title">{sachet.liveMOF || 'NA'}</Text>
                  </Flex>
                  <IconButton onClick={() => openTunnel(7)}>
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
                  <th></th>
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
                     <td>{mode.station.name}</td>
                     <td>
                        {mode.bulkItem
                           ? mode.bulkItem.supplierItem.name +
                             ' ' +
                             mode.bulkItem.processingName
                           : ''}
                        {mode.sachetItem
                           ? mode.sachetItem.bulkItem.supplierItem.name +
                             ' ' +
                             mode.sachetItem.bulkItem.processingName +
                             ' ' +
                             mode.sachetItem.unitSize +
                             ' ' +
                             mode.sachetItem.unit
                           : ''}
                     </td>
                     <td>
                        {mode.accuracy
                           ? 'Atleast' + mode.accuracy + '%'
                           : "Don't Weigh"}
                     </td>
                     <td>{mode.packaging?.name || '-'}</td>
                     <td>{mode.labelTemplate?.title || '-'}</td>
                     <td>
                        <span onClick={() => editMOF(mode)}>
                           <EditIcon color="#00A7E1" />
                        </span>
                     </td>
                  </tr>
               ))}
            </tbody>
         </StyledTable>
      </React.Fragment>
   )
}

export default Sachet
