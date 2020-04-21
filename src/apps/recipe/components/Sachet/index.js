import React from 'react'

import { StyledContainer, StyledTopBar } from './styled'
import { StyledTable } from '../styled'

const Sachet = ({ sachet }) => {
   const [activeMode, setActiveMode] = React.useState('')

   React.useEffect(() => {
      if (sachet) {
         const mode = sachet.modes.find(mode => mode.isActive === true)
         setActiveMode(mode.type)
      }
   }, [sachet])

   return (
      <StyledContainer>
         <StyledTopBar>
            <p>{sachet?.tracking ? 'Taken Inventory' : ' '}</p>
            <span>Active: {activeMode}</span>
         </StyledTopBar>
         <StyledTable cellSpacing={0} noActions>
            <thead>
               <tr>
                  <th>Mode of fulfillment</th>
                  <th>Station</th>
                  <th>Supplier item</th>
                  <th>Accuracy</th>
                  <th>Packaging</th>
                  <th>Label</th>
               </tr>
            </thead>
            <tbody>
               {sachet?.modes.map(mode => (
                  <tr key={mode.type}>
                     <td>
                        <span className='badge'>Active</span>
                        {mode.type}
                     </td>
                     <td>{mode.station.title}</td>
                     <td>{mode.supplierItems[0]?.item.title}</td>
                     <td>
                        {mode.supplierItems[0]?.accuracy
                           ? 'Atleast ' + mode.supplierItems[0]?.accuracy + '%'
                           : 'Not weighing'}
                     </td>
                     <td>{mode.supplierItems[0]?.packaging.title}</td>
                     <td>
                        {mode.supplierItems[0]?.isLabelled
                           ? mode.supplierItems[0]?.labelTemplate.title
                           : 'Not labelled'}
                     </td>
                  </tr>
               ))}
            </tbody>
         </StyledTable>
      </StyledContainer>
   )
}

export default Sachet
