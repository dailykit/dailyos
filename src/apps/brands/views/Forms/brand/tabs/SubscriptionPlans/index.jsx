import React from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { Text, Spacer, Toggle } from '@dailykit/ui'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'

import tableOptions from '../../../../../tableOption'
import { BRANDS, PLANS } from '../../../../../graphql'
import { Flex, InlineLoader } from '../../../../../../../shared/components'

export const SubscriptionPlans = () => {
   const params = useParams()
   const tableRef = React.useRef()
   const [plans, setPlans] = React.useState({})
   const [updateBrandCollection] = useMutation(BRANDS.UPSERT_BRAND_TITLE, {
      onCompleted: () => toast.success('Successfully updated!'),
      onError: () => toast.error('Failed to update, please try again!'),
   })
   const { loading } = useSubscription(PLANS.LIST, {
      variables: {
         brandId: {
            _eq: params.id,
         },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { titles = {} } = {} } = {},
      }) => {
         const transform = node => ({
            ...node,
            totalBrands: node.totalBrands.aggregate.count,
            isActive: isEmpty(node.brands) ? false : node.brands[0].isActive,
         })

         setPlans({ ...titles, nodes: titles.nodes.map(transform) })
      },
   })

   const toggleStatus = ({ id, isActive }) => {
      updateBrandCollection({
         variables: {
            object: {
               isActive,
               brandId: params.id,
               subscriptionTitleId: id,
            },
         },
      })
   }

   const columns = React.useMemo(
      () => [
         {
            title: 'Title',
            field: 'title',
            headerFilter: true,
         },
         {
            headerFilter: true,
            title: 'Total Brands',
            field: 'totalBrands',
            hozAlign: 'right',
            headerHozAlign: 'right',
            width: 200,
         },
         {
            title: 'Published',
            field: 'isActive',
            hozAlign: 'center',
            headerHozAlign: 'center',
            headerSort: false,
            formatter: reactFormatter(<ToggleStatus update={toggleStatus} />),
            width: 150,
         },
      ],
      [toggleStatus]
   )

   return (
      <Flex padding="16px">
         <Text as="h2">
            Subscription Plans ({plans?.aggregate?.count || 0})
         </Text>
         <Spacer size="24px" />
         {loading ? (
            <InlineLoader />
         ) : (
            <>
               {plans?.aggregate?.count > 0 ? (
                  <ReactTabulator
                     ref={tableRef}
                     columns={columns}
                     options={tableOptions}
                     data={plans?.nodes || []}
                  />
               ) : (
                  <span>No Plans yet!</span>
               )}
            </>
         )}
      </Flex>
   )
}

const ToggleStatus = ({ update, cell }) => {
   const [checked, setChecked] = React.useState(cell.getData().isActive)

   React.useEffect(() => {
      if (checked !== cell.getData().isActive) {
         update({
            id: cell.getData().id,
            isActive: checked,
         })
      }
   }, [checked, update, cell])

   return <Toggle checked={checked} setChecked={setChecked} />
}
