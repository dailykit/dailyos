import { IconButton, Text } from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import EditIcon from '../../assets/icons/Edit'

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
   const { t } = useTranslation()
   return (
      <StyledCard>
         <div>
            <Text as="title">{title}</Text>

            <div style={{ display: 'flex' }}>
               {shippedProcessing && (
                  <>
                     <Text as="subtitle">
                        {t(address.concat('processing as shipped'))}:{' '}
                        {shippedProcessing.join(', ')}
                     </Text>
                     <span style={{ width: '20px' }} />
                  </>
               )}
               {onHand ? (
                  <>
                     <Text as="subtitle">
                        {t(address.concat('on hand'))}: {onHand}{' '}
                     </Text>
                     <span style={{ width: '20px' }} />
                  </>
               ) : null}
               {shelfLife ? (
                  <Text as="subtitle">
                     {t(address.concat('shelf life'))}: {shelfLife}{' '}
                  </Text>
               ) : null}

               {available ? (
                  <Text as="subtitle">
                     {t(address.concat('available'))}: {available}{' '}
                  </Text>
               ) : null}

               {par ? (
                  <>
                     <span style={{ width: '20px' }} />
                     <Text as="subtitle">
                        {t(address.concat('par'))}: {par}
                     </Text>
                  </>
               ) : null}
            </div>
         </div>

         {edit && (
            <div>
               <IconButton type="ghost" onClick={() => edit()}>
                  <EditIcon />
               </IconButton>
            </div>
         )}
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
