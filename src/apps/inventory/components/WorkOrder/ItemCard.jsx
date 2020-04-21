import React from 'react'
import styled from 'styled-components'
import { Text, IconButton } from '@dailykit/ui'
import EditIcon from '../../assets/icons/Edit'

export default function ItemCard({
   title,
   shippedProcessing,
   onHand,
   shelfLife,
   edit
}) {
   return (
      <StyledCard>
         <div>
            <Text as='title'>{title}</Text>

            <div style={{ display: 'flex' }}>
               {shippedProcessing && (
                  <>
                     <Text as='subtitle'>
                        Processing as Shipped: {shippedProcessing.join(', ')}
                     </Text>
                     <span style={{ width: '20px' }} />
                  </>
               )}
               {onHand && (
                  <>
                     <Text as='subtitle'>On Hand: {onHand} </Text>
                     <span style={{ width: '20px' }} />
                  </>
               )}
               {shelfLife && (
                  <Text as='subtitle'>Shelf Life: {shelfLife} </Text>
               )}
            </div>
         </div>

         <div>
            <IconButton type='ghost' onClick={() => edit()}>
               <EditIcon />
            </IconButton>
         </div>
      </StyledCard>
   )
}

const StyledCard = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 10px 20px;
   border-radius: 7px;
   margin-top: 20px;
   margin-left: 20px;
   width: 80%;
   background-color: #f3f3f3;
`
