import { useSubscription } from '@apollo/react-hooks'
import { Text } from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { ReactTabulator } from '@dailykit/react-tabulator'

import { useTabs } from '../../../context'
import {
   ACCOMPANIMENT_TYPES,
   ALLERGENS,
   CUISINES,
   PROCESSINGS,
   UNITS_COUNT,
   PRODUCT_CATEGORIES_COUNT,
} from '../../../graphql'
import { StyledHeader, StyledWrapper } from '../styled'
import tableOptions from '../tableOption'

const address = 'apps.settings.views.listings.masterlist.'

const MasterList = () => {
   const { t } = useTranslation()
   const history = useHistory()
   const { tabs, addTab } = useTabs()
   const tableRef = React.useRef()

   // subscription
   const { data: accompaniments } = useSubscription(ACCOMPANIMENT_TYPES)
   const { data: processings } = useSubscription(PROCESSINGS)
   const { data: allergens } = useSubscription(ALLERGENS)
   const { data: cuisines } = useSubscription(CUISINES)
   const { data: units } = useSubscription(UNITS_COUNT)
   const { data: productCategories } = useSubscription(PRODUCT_CATEGORIES_COUNT)

   const rowClick = (e, row) => {
      const { _click } = row._row.data
      _click()
   }

   const columns = [
      {
         title: t(address.concat('list name')),
         field: 'listName',
         headerFilter: true,
      },
      {
         title: t(address.concat('total inputs')),
         field: 'length',
         headerFilter: true,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 150,
      },
   ]

   const data = [
      {
         listName: t(address.concat('accompaniment types')),
         length: accompaniments?.accompaniments.length || '...',
         _click() {
            addTab(
               'Accompaniment Types',
               '/settings/master-lists/accompaniment-types'
            )
         },
      },
      {
         listName: t(address.concat('allergens')),
         length: allergens?.masterAllergens.length || '...',
         _click() {
            addTab('Allergens', '/settings/master-lists/allergens')
         },
      },
      {
         listName: t(address.concat('cuisines')),
         length: cuisines?.cuisineNames.length || '...',
         _click() {
            addTab('Cuisines', '/settings/master-lists/cuisines')
         },
      },
      {
         listName: t(address.concat('processings')),
         length: processings?.masterProcessings.length || '...',
         _click() {
            addTab('Processings', '/settings/master-lists/processings')
         },
      },
      {
         listName: t(address.concat('units')),
         length: units?.unitsAggregate.aggregate.count || '...',
         _click() {
            addTab('Units', '/settings/master-lists/units')
         },
      },
      {
         listName: 'Product Categories',
         length:
            productCategories?.productCategoriesAggregate.aggregate.count ||
            '...',
         _click() {
            addTab(
               'Product Categories',
               '/settings/master-lists/product-categories'
            )
         },
      },
   ]

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
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            data={data}
            rowClick={rowClick}
            options={tableOptions}
         />
      </StyledWrapper>
   )
}

export default MasterList
