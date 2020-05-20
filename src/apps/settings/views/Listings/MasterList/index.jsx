import React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import {
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   Text,
} from '@dailykit/ui'

// State
import { useTabs } from '../../../context'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

import { useTranslation } from 'react-i18next'

const address = 'apps.settings.views.listings.masterlist.'

const MasterList = () => {
   const { t } = useTranslation()
   const history = useHistory()
   const { tabs, addTab } = useTabs()

   React.useEffect(() => {
      const tab =
         tabs.find(item => item.path === `/settings/master-lists`) || {}
      if (!Object.prototype.hasOwnProperty.call(tab, 'path')) {
         history.push('/settings')
      }
   }, [history, tabs])

   return (
      <StyledWrapper>
         <StyledHeader>
            <Text as="h2">{t(address.concat('master lists'))}</Text>
         </StyledHeader>
         <Table>
            <TableHead>
               <TableRow>
                  <TableCell>{t(address.concat('list name'))}</TableCell>
                  <TableCell>{t(address.concat('total inputs'))}</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               <TableRow>
                  <TableCell
                     onClick={() =>
                        addTab(
                           'Accompaniment Types',
                           '/settings/master-lists/accompaniment-types'
                        )
                     }
                  >
                     {t(address.concat('accompaniment types'))}
                  </TableCell>
                  <TableCell>20</TableCell>
               </TableRow>
               <TableRow
                  onClick={() =>
                     addTab('Allergens', '/settings/master-lists/allergens')
                  }
               >
                  <TableCell>{t(address.concat('allergens'))}</TableCell>
                  <TableCell>20</TableCell>
               </TableRow>
               <TableRow
                  onClick={() =>
                     addTab('Cuisines', '/settings/master-lists/cuisines')
                  }
               >
                  <TableCell>{t(address.concat('cuisines'))}</TableCell>
                  <TableCell>20</TableCell>
               </TableRow>
               <TableRow
                  onClick={() =>
                     addTab('Processings', '/settings/master-lists/processings')
                  }
               >
                  <TableCell>{t(address.concat('processings'))}</TableCell>
                  <TableCell>20</TableCell>
               </TableRow>
            </TableBody>
         </Table>
      </StyledWrapper>
   )
}

export default MasterList
