import React from 'react'
import { Text } from '@dailykit/ui'
import { useHistory } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { ReactTabulator } from '@dailykit/react-tabulator'

import { Wrapper } from './styled'
import { Spacer } from '../../../styled'
import { useTabs } from '../../../context'
import options from '../../../tableOption'
import { TITLES } from '../../../graphql'
import { InlineLoader } from '../../../../../shared/components'

export const Subscriptions = () => {
   const history = useHistory()
   const tableRef = React.useRef()
   const { tabs, addTab } = useTabs()
   const { loading, data: { titles = [] } = {} } = useSubscription(TITLES)

   React.useEffect(() => {
      const tab =
         tabs.find(item => item.path === `/subscription/subscriptions`) || {}
      if (!Object.prototype.hasOwnProperty.call(tab, 'path')) {
         addTab('Subscriptions', '/subscription/subscriptions')
      }
   }, [history, tabs])

   const columns = [
      {
         title: 'Title',
         field: 'title',
         headerFilter: true,
         headerFilterPlaceholder: 'Search titles...',
      },
   ]

   const rowClick = (e, row) => {
      e.preventDefault()
      addTab(
         row.getData().title,
         `/subscription/subscriptions/${row.getData().id}`
      )
   }

   if (loading) return <InlineLoader />
   return (
      <Wrapper>
         <div>
            <Spacer size="32px" />
            <Text as="title">Subscriptions</Text>
            <Spacer size="16px" />
            <ReactTabulator
               data={titles}
               ref={tableRef}
               columns={columns}
               options={options}
               rowClick={rowClick}
            />
         </div>
      </Wrapper>
   )
}
