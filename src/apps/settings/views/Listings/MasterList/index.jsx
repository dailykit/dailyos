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
import { useSubscription } from '@apollo/react-hooks'
import {
   ACCOMPANIMENT_TYPES,
   PROCESSINGS,
   ALLERGENS,
   CUISINES,
   UNITS_COUNT,
} from '../../../graphql'

const address = 'apps.settings.views.listings.masterlist.'

const MasterList = () => {
   const { t } = useTranslation()
   const history = useHistory()
   const { tabs, addTab } = useTabs()

   // subscription
   const { data: accompaniments } = useSubscription(ACCOMPANIMENT_TYPES)
   const { data: processings } = useSubscription(PROCESSINGS)
   const { data: allergens } = useSubscription(ALLERGENS)
   const { data: cuisines } = useSubscription(CUISINES)
   const { data: units } = useSubscription(UNITS_COUNT)

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
                  <TableCell>
                     {accompaniments?.master_accompanimentType.length || '...'}
                  </TableCell>
               </TableRow>
               <TableRow
                  onClick={() =>
                     addTab('Allergens', '/settings/master-lists/allergens')
                  }
               >
                  <TableCell>{t(address.concat('allergens'))}</TableCell>
                  <TableCell>
                     {allergens?.masterAllergens.length || '...'}
                  </TableCell>
               </TableRow>
               <TableRow
                  onClick={() =>
                     addTab('Cuisines', '/settings/master-lists/cuisines')
                  }
               >
                  <TableCell>{t(address.concat('cuisines'))}</TableCell>
                  <TableCell>
                     {cuisines?.cuisineNames.length || '...'}
                  </TableCell>
               </TableRow>
               <TableRow
                  onClick={() =>
                     addTab('Processings', '/settings/master-lists/processings')
                  }
               >
                  <TableCell>{t(address.concat('processings'))}</TableCell>
                  <TableCell>
                     {processings?.masterProcessings.length || '...'}
                  </TableCell>
               </TableRow>
               <TableRow
                  onClick={() =>
                     addTab('Units', '/settings/master-lists/units')
                  }
               >
                  <TableCell>{t(address.concat('units'))}</TableCell>
                  <TableCell>
                     {units?.unitsAggregate.aggregate.count || '...'}
                  </TableCell>
               </TableRow>
            </TableBody>
         </Table>
      </StyledWrapper>
   )
}

export default MasterList
