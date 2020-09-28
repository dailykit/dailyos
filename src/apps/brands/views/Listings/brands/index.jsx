import React from 'react'
import { IconButton, Text } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'

import { BRANDS } from '../../../graphql'
import { useTabs } from '../../../context'
import tableOptions from '../../../tableOption'
import { StyledWrapper, StyledHeader } from '../styled'
import { InlineLoader } from '../../../../../shared/components'
import { EditIcon } from '../../../../../shared/assets/icons'

export const Brands = () => {
   const tableRef = React.useRef()
   const { tab, addTab } = useTabs()
   const { error, loading, data: { brands = {} } = {} } = useSubscription(
      BRANDS.LIST
   )

   React.useEffect(() => {
      if (!tab) {
         addTab('Brands', '/brands/brands')
      }
   }, [tab, addTab])

   const edit = brand => {
      addTab(
         brand?.title || brand?.domain || 'N/A',
         `/brands/brands/${brand.id}`
      )
   }

   const columns = React.useMemo(
      () => [
         {
            title: 'Brand',
            field: 'title',
            headerSort: true,
            headerFilter: true,
            formatter: cell => cell.getData().title || 'N/A',
         },
         {
            title: 'Domain',
            field: 'domain',
            headerSort: true,
            headerFilter: true,
            formatter: cell => cell.getData().domain || 'N/A',
         },
         {
            title: 'Published',
            headerSort: false,
            field: 'isPublished',
            formatter: 'tickCross',
         },
         {
            title: 'Actions',
            hozAlign: 'center',
            headerSort: false,
            formatter: reactFormatter(<EditBrand edit={edit} />),
         },
      ],
      []
   )

   if (error) return <div>Something went wrong, please refresh!</div>
   return (
      <StyledWrapper>
         <StyledHeader>
            <Text as="h2">Brands ({brands?.aggregate?.count || 0})</Text>
         </StyledHeader>
         {loading ? (
            <InlineLoader />
         ) : (
            <>
               {brands?.aggregate?.count > 0 ? (
                  <ReactTabulator
                     ref={tableRef}
                     columns={columns}
                     data={brands?.nodes || []}
                     options={tableOptions}
                  />
               ) : (
                  <span>No Brands yet!</span>
               )}
            </>
         )}
      </StyledWrapper>
   )
}

const EditBrand = ({ cell, edit }) => {
   return (
      <IconButton type="outline" size="sm" onClick={() => edit(cell.getData())}>
         <EditIcon color="rgb(40, 193, 247)" />
      </IconButton>
   )
}
