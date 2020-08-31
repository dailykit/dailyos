import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { Text, Toggle } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'

import { useMenu } from './state'
import tableOptions from '../../../tableOption'
import { SUBSCRIPTION_OCCURENCES } from '../../../graphql'

const PlansSection = () => {
   const tableRef = React.useRef()
   const { state, dispatch } = useMenu()
   const {
      loading,
      data: { subscriptionOccurences = {} } = {},
   } = useSubscription(SUBSCRIPTION_OCCURENCES, {
      variables: {
         fulfillmentDate: {
            _in: [moment(state.date).format('YYYY-MM-DD')],
         },
      },
   })

   const columns = [
      {
         title: 'Servings',
         headerFilter: true,
         headerFilterPlaceholder: 'Search servings...',
         field: 'subscription.itemCount.serving.size',
      },
      {
         title: 'Title',
         headerFilter: true,
         headerFilterPlaceholder: 'Search titles...',
         field: 'subscription.itemCount.serving.subscriptionTitle.title',
      },
      {
         title: 'Item Count',
         headerFilter: true,
         headerFilterPlaceholder: 'Search item counts...',
         field: 'subscription.itemCount.count',
      },
      {
         title: 'Cut Off',
         field: 'cutoffTimeStamp',
         formatter: ({ _cell: { value } }) =>
            moment(value).format('MMM DD HH:MM A'),
      },
      {
         title: 'Start Time',
         field: 'startTimeStamp',
         formatter: ({ _cell: { value } }) =>
            moment(value).format('MMM DD HH:MM A'),
      },
      {
         hozAlign: 'right',
         title: 'Menu Products',
         formatter: reactFormatter(<ProductsCount />),
      },
      {
         title: 'Customers',
         field: 'subscription.customers.aggregate.count',
      },
   ]

   const handleRowSelection = row => {
      const data = row.getData()

      if (row.isSelected()) {
         dispatch({
            type: 'SET_PLAN',
            payload: {
               occurence: { id: data.id },
               subscription: { id: data.subscription.id },
               serving: { size: data.subscription.itemCount.serving.size },
            },
         })
      } else {
         dispatch({
            type: 'REMOVE_PLAN',
            payload: data.id,
         })
      }
   }

   const handleRowValidation = row => {
      if (!localStorage.getItem('serving_size')) return true
      return (
         row.getData().subscription.itemCount.serving.size ===
         Number(localStorage.getItem('serving_size'))
      )
   }

   return (
      <Wrapper>
         <Header>
            <Text as="h2">Plans</Text>
            <Toggle
               label="Add Permanently"
               checked={state.plans.isPermanent}
               setChecked={() => dispatch({ type: 'TOGGLE_PERMANENT' })}
            />
         </Header>
         {!state.date && <span>Select a date to view plans.</span>}
         {!loading && subscriptionOccurences?.aggregate?.count > 0 && (
            <ReactTabulator
               ref={tableRef}
               columns={columns}
               rowSelected={handleRowSelection}
               rowDeselected={handleRowSelection}
               data={subscriptionOccurences.nodes}
               selectableCheck={handleRowValidation}
               options={{
                  ...tableOptions,
                  selectable: true,
                  reactiveData: true,
                  groupBy:
                     'subscription.itemCount.serving.subscriptionTitle.title',
               }}
            />
         )}
      </Wrapper>
   )
}

export default PlansSection

const ProductsCount = ({ cell: { _cell } }) => {
   const data = _cell.row.getData()
   return (
      <div>
         <span title="Added to this occurence">
            {data.products.aggregate.count}
         </span>
         /
         <span title="Added to the subscription">
            {data.subscription.products.aggregate.count}
         </span>
      </div>
   )
}

const Wrapper = styled.main`
   padding: 0 16px;
`

const Header = styled.header`
   display: flex;
   align-items: center;
   justify-content: space-between;
`
