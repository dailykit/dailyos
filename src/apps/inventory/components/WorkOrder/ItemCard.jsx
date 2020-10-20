import { Flex, IconButton, Spacer, Text } from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { EditIcon } from '../../../../shared/assets/icons'

const address = 'apps.inventory.components.workorder.'

export default function ItemCard({
   title,
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

            {isBulk ? (
               <Flex container>
                  <Text as="subtitle">
                     {t(address.concat('on hand'))}: {onHand ?? 'N/A'}
                  </Text>
                  <Spacer xAxis size="16px" />
                  <Text as="subtitle">
                     {t(address.concat('shelf life'))}: {shelfLife ?? 'N/A'}
                  </Text>

                  {available ? (
                     <Text as="subtitle">
                        {t(address.concat('available'))}: {available}{' '}
                     </Text>
                  ) : null}

                  <>
                     <Spacer xAxis size="16px" />
                     <Text as="subtitle">
                        {t(address.concat('par'))}: {par ?? 'N/A'}
                     </Text>
                  </>
               </Flex>
            ) : null}
         </Flex>

         {edit && (
            <Flex>
               <IconButton type="outline" onClick={() => edit()}>
                  <EditIcon />
               </IconButton>
            </Flex>
         )}
      </StyledCard>
   )
}

const StyledCard = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-top: 16px;
   margin-left: 16px;
`
