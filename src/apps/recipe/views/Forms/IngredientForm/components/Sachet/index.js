import React from 'react'
import { Text, IconButton } from '@dailykit/ui'

import { TickIcon, CloseIcon, EditIcon } from '../../../../../assets/icons'

import { Container, Flex, Grid } from '../styled'
import { StyledTable } from './styled'

import { IngredientContext } from '../../../../../context/ingredient'

const Sachet = ({ state }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

   const [sachet, setSachet] = React.useState(
      state.ingredientProcessings[ingredientState.processingIndex]
         .ingredientSachets[ingredientState.sachetIndex]
   )

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
                  <IconButton>
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
               </tr>
            </thead>
            <tbody>
               {sachet.modeOfFulfillments?.map(mode => (
                  <tr key={mode.id}>
                     <td>
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
                  </tr>
               ))}
            </tbody>
         </StyledTable>
      </React.Fragment>
   )
}

export default Sachet
