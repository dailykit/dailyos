import React from 'react'
import { v4 as uuid } from 'uuid'
import { useHistory } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { Text, IconButton, PlusIcon } from '@dailykit/ui'
import { ReactTabulator } from '@dailykit/react-tabulator'

import { Spacer } from '../../../styled'
import { TITLES } from '../../../graphql'
import { useTabs } from '../../../context'
import { Wrapper, Header } from './styled'
import options from '../../../tableOption'
import { InlineLoader } from '../../../../../shared/components'

export const Subscriptions = () => {
   const history = useHistory()
   const tableRef = React.useRef()
   const { tab, tabs, addTab } = useTabs()
   const { loading, data: { titles = [] } = {} } = useSubscription(TITLES)

   React.useEffect(() => {
      if (!tab) {
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

   const createTab = () => {
      const hash = `form-${uuid().split('-')[0]}`
      addTab('Create Subscription', `/subscription/subscriptions/${hash}`)
   }

   if (loading) return <InlineLoader />
   return (
      <Wrapper>
         <div>
            <Spacer size="32px" />
            <Header>
               <Text as="title">Subscriptions</Text>
               <IconButton type="outline" onClick={() => createTab()}>
                  <PlusIcon />
               </IconButton>
            </Header>
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
