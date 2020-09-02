import React from 'react'
import { v4 as uuid } from 'uuid'
import { useHistory } from 'react-router-dom'
import { Text, IconButton, PlusIcon } from '@dailykit/ui'
import { ReactTabulator } from '@dailykit/react-tabulator'
import { useSubscription, useMutation } from '@apollo/react-hooks'

import { Spacer } from '../../../styled'
import { useTabs } from '../../../context'
import { Wrapper, Header } from './styled'
import options from '../../../tableOption'
import { InlineLoader } from '../../../../../shared/components'
import { TITLES, UPSERT_SUBSCRIPTION_TITLE } from '../../../graphql'

export const Subscriptions = () => {
   const history = useHistory()
   const tableRef = React.useRef()
   const { tab, addTab } = useTabs()
   const { loading, data: { titles = [] } = {} } = useSubscription(TITLES)
   const [upsertTitle] = useMutation(UPSERT_SUBSCRIPTION_TITLE, {
      onCompleted: ({ upsertSubscriptionTitle = {} }) => {
         const { id, title } = upsertSubscriptionTitle
         addTab(title, `/subscription/subscriptions/${id}`)
      },
   })

   React.useEffect(() => {
      if (!tab) {
         addTab('Subscriptions', '/subscription/subscriptions')
      }
   }, [history, addTab, tab])

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
      upsertTitle({
         variables: {
            object: {
               title: hash,
            },
         },
      })
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
