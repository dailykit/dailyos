import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import { IconButton } from '@dailykit/ui'
import { InlineLoader } from '../../../../../shared/components'
import tableOptions from '../tableOption'
import { INFORMATION_BLOCK } from '../../../graphql'
import { useTabs } from '../../../context'
import { EditIcon } from '../../../../../shared/assets/icons'

export const InformationBlock = () => {
   const tableRef = React.useRef()
   const { tab, addTab } = useTabs()

   const {
      loading,
      error,
      data: { content_informationBlock = [] } = {},
   } = useSubscription(INFORMATION_BLOCK)
   React.useEffect(() => {
      if (!tab) {
         addTab('InformationBlock', '/content/blocks/block/')
      }
   }, [tab, addTab])

   const edit = block => {
      addTab(block?.title || 'N/A', `/content/blocks/block/${block.id}`)
   }
   const columns = React.useMemo(
      () => [
         {
            title: 'Title',
            field: 'title',
            headerSort: true,
            headerFilter: true,
         },
         {
            title: 'FAQ',
            field: 'faqsId',
            headerSort: true,
            formatter: 'tickCross',
         },
         {
            title: 'Information Grid',
            headerSort: true,
            field: 'informationGridId',
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

   if (loading) return <InlineLoader />
   if (error) return `${error.message}`
   return (
      <ReactTabulator
         ref={tableRef}
         columns={columns}
         data={content_informationBlock}
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
