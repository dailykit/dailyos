import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { Text, Form, Flex, TextButton } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'

import { useMenu } from './state'
import tableOptions from '../../../tableOption'
import { SUBSCRIPTION_OCCURENCES } from '../../../graphql'
import { useTooltip } from '../../../../../shared/providers'
import { InlineLoader, Tooltip } from '../../../../../shared/components'

const PlansSection = () => {
   const tableRef = React.useRef()
   const { state, dispatch } = useMenu()
   const { tooltip } = useTooltip()
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
   const columns = React.useMemo(
      () => [
         {
            title: 'Servings',
            headerFilter: true,
            headerFilterPlaceholder: 'Search servings...',
            field: 'subscription.itemCount.serving.size',
            hozAlign: 'right',
            headerHozAlign: 'right',
            headerTooltip: column => {
               const identifier = 'plan_listing_column_servings'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            title: 'Title',
            headerFilter: true,
            headerFilterPlaceholder: 'Search titles...',
            field: 'subscription.itemCount.serving.subscriptionTitle.title',
            headerTooltip: column => {
               const identifier = 'plan_listing_column_title'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            title: 'Item Count',
            headerFilter: true,
            headerFilterPlaceholder: 'Search item counts...',
            field: 'subscription.itemCount.count',
            hozAlign: 'right',
            headerHozAlign: 'right',
            headerTooltip: column => {
               const identifier = 'plan_listing_column_item_count'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            title: 'Cut Off',
            field: 'cutoffTimeStamp',
            formatter: ({ _cell: { value } }) =>
               moment(value).format('MMM DD HH:MM A'),
            headerTooltip: column => {
               const identifier = 'plan_listing_column_cut_off'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            title: 'Start Time',
            field: 'startTimeStamp',
            formatter: ({ _cell: { value } }) =>
               moment(value).format('MMM DD HH:MM A'),
            headerTooltip: column => {
               const identifier = 'plan_listing_column_state_time'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            hozAlign: 'right',
            title: 'Add On Products',
            formatter: reactFormatter(<AddOnProductsCount />),
            headerHozAlign: 'right',
            headerTooltip: column => {
               const identifier = 'plan_listing_column_addon_products'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            hozAlign: 'right',
            title: 'Menu Products',
            formatter: reactFormatter(<ProductsCount />),
            headerHozAlign: 'right',
            headerTooltip: column => {
               const identifier = 'plan_listing_column_products'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
         {
            title: 'Customers',
            field: 'subscription.customers.aggregate.count',
            hozAlign: 'right',
            headerHozAlign: 'right',
            headerTooltip: column => {
               const identifier = 'plan_listing_column_customers'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
         },
      ],
      []
   )
   const handleRowSelection = row => {
      const data = row.getData()
      if (row.isSelected()) {
         dispatch({
            type: 'SET_PLAN',
            payload: {
               occurence: { id: data.id },
               subscription: { id: data.subscription.id },
               item: { count: data.subscription.itemCount.count },
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
         <Flex
            container
            height="48px"
            alignItems="center"
            justifyContent="space-between"
         >
            <Flex container alignItems="center">
               <Flex container alignItems="center">
                  <Text as="h2">Plans</Text>
                  <Tooltip identifier="listing_menu_section_plans_heading" />
               </Flex>
               {state.date && (
                  <TextButton
                     size="sm"
                     type="ghost"
                     onClick={() => {
                        dispatch({ type: 'SET_DATE', payload: null })
                        localStorage.removeItem('serving_size')
                     }}
                  >
                     Clear Selections
                  </TextButton>
               )}
            </Flex>
            <Flex container alignItems="center">
               <Form.Toggle
                  name="add_permanently"
                  value={state.plans.isPermanent}
                  onChange={() => dispatch({ type: 'TOGGLE_PERMANENT' })}
               >
                  Add Permanently
               </Form.Toggle>
               <Tooltip identifier="listing_menu_section_plans_add_permanently" />
            </Flex>
         </Flex>
         {!state.date && <Text as="h3">Select a date to view plans.</Text>}
         {state.date && loading && <InlineLoader />}
         {state && !loading && subscriptionOccurences?.aggregate?.count > 0 && (
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

const AddOnProductsCount = ({ cell: { _cell } }) => {
   const data = _cell.row.getData()
   return (
      <div>
         <span title="Added to this occurence">
            {data.addOnProducts.aggregate.count}
         </span>
         /
         <span title="Added to the subscription">
            {data.subscription.addOnProducts.aggregate.count}
         </span>
      </div>
   )
}

const Wrapper = styled.main`
   padding: 0 16px;
`
