import { Flex, IconButton, Spacer, Text } from '@dailykit/ui'
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
   isBulk,
}) {
   const { t } = useTranslation()
   return (
      <StyledCard>
         <Flex>
            <Text as="h2">{title}</Text>

            <Flex container>
               {shippedProcessing && (
                  <>
                     <Text as="subtitle">
                        {t(address.concat('processing as shipped'))}:{' '}
                        {shippedProcessing.join(', ')}
                     </Text>
                     <span style={{ width: '20px' }} />
                  </>
               )}

               {isBulk ? (
                  <>
                     <Text as="subtitle">
                        {t(address.concat('on hand'))}: {onHand ?? 'N/A'}
                     </Text>
                     <span style={{ width: '20px' }} />
                     <Text as="subtitle">
                        {t(address.concat('shelf life'))}: {shelfLife ?? 'N/A'}
                     </Text>

                     {available ? (
                        <Text as="subtitle">
                           {t(address.concat('available'))}: {available}{' '}
                        </Text>
                     ) : null}

                     <>
                        <span style={{ width: '20px' }} />
                        <Text as="subtitle">
                           {t(address.concat('par'))}: {par ?? 'N/A'}
                        </Text>
                     </>
                  </>
               ) : null}
            </Flex>
         </Flex>

         {edit && (
            <>
               <Spacer xAxis size="16px" />
               <IconButton type="outline" onClick={() => edit()}>
                  <EditIcon />
               </IconButton>
            </>
         )}
      </StyledCard>
   )
}

const StyledCard = styled.div`
   display: flex;
   align-items: center;
   margin-top: 16px;
   margin-left: 16px;
   width: 80%;
`
