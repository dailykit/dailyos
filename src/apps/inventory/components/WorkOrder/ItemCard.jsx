import React from 'react'
import styled from 'styled-components'
import { Text, IconButton } from '@dailykit/ui'
import EditIcon from '../../assets/icons/Edit'

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.components.workorder.'

export default function ItemCard({
   title,
   shippedProcessing,
   onHand,
   shelfLife,
   edit,
   available,
   par,
}) {
   const { t } = useTranslation();
   return (

      <StyledCard>
         <div>
            <Text as="title">{title}</Text>

            <div style={{ display: 'flex' }}>
               {shippedProcessing && (
                  <>
<<<<<<< HEAD
                     <Text as='subtitle'>
                        {t(address.concat('processing as shipped'))}: {shippedProcessing.join(', ')}
=======
                     <Text as="subtitle">
                        Processing as Shipped: {shippedProcessing.join(', ')}
>>>>>>> 9ddf6699a763d989cd56e66611d8ac668ec40f59
                     </Text>
                     <span style={{ width: '20px' }} />
                  </>
               )}
               {onHand && (
                  <>
<<<<<<< HEAD
                     <Text as='subtitle'>{t(address.concat('on hand'))}: {onHand} </Text>
=======
                     <Text as="subtitle">On Hand: {onHand} </Text>
>>>>>>> 9ddf6699a763d989cd56e66611d8ac668ec40f59
                     <span style={{ width: '20px' }} />
                  </>
               )}
               {shelfLife && (
<<<<<<< HEAD
                  <Text as='subtitle'>{t(address.concat('shelf life'))}: {shelfLife} </Text>
=======
                  <Text as="subtitle">Shelf Life: {shelfLife} </Text>
               )}

               {available && <Text as="subtitle">Available: {available} </Text>}

               {par && (
                  <>
                     <span style={{ width: '20px' }} />
                     <Text as="subtitle">Par: {par}</Text>
                  </>
>>>>>>> 9ddf6699a763d989cd56e66611d8ac668ec40f59
               )}
            </div>
         </div>

         <div>
            <IconButton type="ghost" onClick={() => edit()}>
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
