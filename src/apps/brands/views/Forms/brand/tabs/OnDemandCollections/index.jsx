import React from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { Text, Spacer, Toggle } from '@dailykit/ui'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'

import tableOptions from '../../../../../tableOption'
import { BRANDS, COLLECTIONS } from '../../../../../graphql'
import { Flex, InlineLoader } from '../../../../../../../shared/components'

export const OnDemandCollections = () => {
   const params = useParams()
   const tableRef = React.useRef()
   const [collections, setCollections] = React.useState({})
   const [updateBrandCollection] = useMutation(BRANDS.UPSERT_BRAND_COLLECTION, {
      onCompleted: () => toast.success('Successfully updated!'),
      onError: () => toast.error('Failed to update, please try again!'),
   })
   const { loading } = useSubscription(COLLECTIONS.LIST, {
      variables: {
         brandId: {
            _eq: params.id,
         },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { collections: list = {} } = {} } = {},
      }) => {
         const transform = node => ({
            ...node,
            endTime: node.endTime || 'N/A',
            rrule: node.rrule?.text || 'N/A',
            startTime: node.startTime || 'N/A',
            totalBrands: node.totalBrands.aggregate.count,
            isActive: isEmpty(node.brands) ? false : node.brands[0].isActive,
         })

         setCollections({ ...list, nodes: list.nodes.map(transform) })
      },
   })

   const toggleStatus = ({ id, isActive }) => {
      updateBrandCollection({
         variables: {
            object: {
               isActive,
               collectionId: id,
               brandId: params.id,
            },
         },
      })
   }

   const columns = React.useMemo(
      () => [
         {
            title: 'Name',
            field: 'name',
            headerFilter: true,
         },
         {
            title: 'Start Time',
            field: 'startTime',
         },
         {
            title: 'End Time',
            field: 'endTime',
         },
         {
            title: 'Availability',
            field: 'rrule',
         },
         {
            headerFilter: true,
            title: 'Total Categories',
            field: 'details.categoriesCount',
         },
         {
            headerFilter: true,
            title: 'Total Products',
            field: 'details.productsCount',
         },
         {
            headerFilter: true,
            title: 'Total Brands',
            field: 'totalBrands',
         },
         {
            title: 'Published',
            field: 'isActive',
            hozAlign: 'center',
            headerSort: false,
            formatter: reactFormatter(<ToggleStatus update={toggleStatus} />),
         },
      ],
      [toggleStatus]
   )

   return (
      <Flex padding="16px">
         <Text as="h2">Collections ({collections?.aggregate?.count || 0})</Text>
         <Spacer size="24px" />
         {loading ? (
            <InlineLoader />
         ) : (
            <>
               {collections?.aggregate?.count > 0 ? (
                  <ReactTabulator
                     ref={tableRef}
                     columns={columns}
                     options={tableOptions}
                     data={collections?.nodes || []}
                  />
               ) : (
                  <span>No Collections yet!</span>
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
   }, [checked])

   return <Toggle checked={checked} setChecked={setChecked} />
}
