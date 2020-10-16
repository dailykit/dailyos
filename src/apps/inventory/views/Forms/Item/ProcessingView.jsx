import { useMutation } from '@apollo/react-hooks'
import {
   Card,
   Flex,
   HorizontalTab,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
   HorizontalTabs,
   IconButton,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { DeleteIcon, EditIcon } from '../../../../../shared/assets/icons'
import { logger } from '../../../../../shared/utils/errorLog'
import { ERROR_DELETING_BULK_ITEM } from '../../../constants/errorMessages'
import {
   BULK_ITEM_DELETED,
   CONFIRM_DELETE_BULK_ITEM,
} from '../../../constants/successMessages'
import { DELETE_BULK_ITEM } from '../../../graphql'
import { FlexContainer, Flexible } from '../styled'
import PlannedLotView from './PlannedLot'
import RealTimeView from './RealtimeView'

const address = 'apps.inventory.views.forms.item.'

export default function ProcessingView({ proc = {}, isDefault }) {
   const { t } = useTranslation()

   const [deleteBulkItem, { loading }] = useMutation(DELETE_BULK_ITEM, {
      onCompleted: () => {
         toast.info(BULK_ITEM_DELETED)
      },
      onError: error => {
         logger(error)
         toast.error(ERROR_DELETING_BULK_ITEM)
      },
   })

   const handleBulkItemDelete = () => {
      if (window.confirm(CONFIRM_DELETE_BULK_ITEM))
         deleteBulkItem({ variables: { id: proc.id } })
   }

   return (
      <>
         <HorizontalTabs>
            <HorizontalTabList>
               <HorizontalTab>{t(address.concat('real-time'))}</HorizontalTab>
               <HorizontalTab>{t(address.concat('planned-lot'))}</HorizontalTab>
            </HorizontalTabList>

            <HorizontalTabPanels>
               <HorizontalTabPanel>
                  <Flex container justifyContent="flex-end">
                     <IconButton
                        // onClick={() => openProcessingTunnel(2)}
                        type="outline"
                     >
                        <EditIcon />
                     </IconButton>
                     {!isDefault ? (
                        <>
                           <span style={{ width: '8px' }} />
                           <IconButton
                              onClick={handleBulkItemDelete}
                              type="ghost"
                              disabled={loading}
                           >
                              <DeleteIcon color="#FF5A52" />
                           </IconButton>
                        </>
                     ) : null}
                  </Flex>
                  <RealtimePanel proc={proc} />
               </HorizontalTabPanel>
               <HorizontalTabPanel>
                  <PlannedLotView
                     sachetItems={proc.sachetItems}
                     procId={proc.id}
                     unit={proc.unit}
                  />
               </HorizontalTabPanel>
            </HorizontalTabPanels>
         </HorizontalTabs>
      </>
   )
}

function RealtimePanel({ proc }) {
   return (
      <FlexContainer>
         <Flexible width="4">
            <RealTimeView proc={proc} />
         </Flexible>
         <Flexible width="1">
            <Card>
               <Card.Title>{proc.name}</Card.Title>
               <Card.Img src={proc.image} alt="processing" />
               <Card.Body>
                  <Card.Text>
                     <Card.Stat>
                        <span>Bulk Density:</span>
                        <span>{proc.bulkDensity}</span>
                     </Card.Stat>
                  </Card.Text>
                  <Card.Text>
                     <Card.Stat>
                        <span>% of yield:</span>
                        <span>{proc.yield?.value || 'N/A'}</span>
                     </Card.Stat>
                  </Card.Text>
                  <Card.Text>
                     <Card.Stat>
                        <span>Labour time per unit:</span>
                        <span>{`${proc.labor?.value || 'N/A'} ${
                           proc.labor?.unit || ''
                        }`}</span>
                     </Card.Stat>
                  </Card.Text>

                  <Card.Text>
                     <Card.Stat>
                        <span>Shelf life:</span>
                        <span>{`${proc.shelfLife?.value || 'N/A'} ${
                           proc.shelfLife?.unit || ''
                        }`}</span>
                     </Card.Stat>
                  </Card.Text>
               </Card.Body>
            </Card>
         </Flexible>
      </FlexContainer>
   )
}
