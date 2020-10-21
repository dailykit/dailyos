import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import { IconButton } from '@dailykit/ui'
import { InlineLoader } from '../../../../../shared/components'
import tableOptions from '../tableOption'
import { INFORMATION_GRID } from '../../../graphql'
import { useTabs } from '../../../context'
import { EditIcon } from '../../../../../shared/assets/icons'

export const InformationGrid = () => {
   const { tab, addTab } = useTabs()
   const tableRef = React.useRef()

   const {
      loading,
      error,
      data: { content_informationGrid = [] } = {},
   } = useSubscription(INFORMATION_GRID)

   React.useEffect(() => {
      if (!tab) {
         addTab('InformationGrid', '/content/blocks/grid/')
      }
   }, [tab, addTab])

   const edit = block => {
      addTab(block?.heading  || 'N/A', `/content/blocks/grid/${block.id}`)
      }

   const columns = React.useMemo(
      () => [
         {
            title: 'Heading',
            field: 'heading',
            headerSort: true,
            headerFilter: true,
         },
         {
            title: 'Sub Heading',
            field: 'subHeading',
            headerSort: true,
            headerFilter: true,
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

   if (loading) return <InlineLoader />
   if (error) return `${error.message}`
   return (
      <ReactTabulator
         ref={tableRef}
         columns={columns}
         data={content_informationGrid}
         options={tableOptions}
      />
   )
}

const EditBrand = ({ cell, edit }) => {
   return (
      <IconButton type="outline" size="sm" onClick={() => edit(cell.getData())}>
         <EditIcon color="rgb(40, 193, 247)" />
      </IconButton>
   )
}
