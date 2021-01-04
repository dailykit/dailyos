import React, { useRef } from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import { toast } from 'react-toastify'
import { IconButton, ComboButton, PlusIcon } from '@dailykit/ui'
import { InlineLoader } from '../../../../../shared/components'
import tableOptions from '../../Listings/tableOption'
import { INFORMATION_BLOCK } from '../../../graphql'
import { useTabs } from '../../../context'
import { EditIcon } from '../../../../../shared/assets/icons'
import { useLocation } from 'react-router-dom'
import { logger } from '../../../../../shared/utils'
import { useParams } from 'react-router-dom'

export default function InformationBlock() {
   const tableRef = useRef()
   const { id } = useParams()
   const { tab, addTab } = useTabs()
   const location = useLocation()

   const {
      loading,
      error,
      data: { content_informationBlock = [] } = {},
   } = useSubscription(INFORMATION_BLOCK, {
      variables: {
         gridId: id,
      },
   })

   const edit = block => {
      addTab(block?.title || 'N/A', `/content/blocks/block/${block.id}`)
   }
   const columns = [
      {
         title: 'Title',
         field: 'title',
         headerSort: true,
         headerFilter: true,
      },
      {
         title: 'Thumbnail',
         field: 'thumbnail',
      },
      {
         title: 'Description',
         field: 'description',
      },
      {
         title: 'Actions',
         hozAlign: 'center',
         headerSort: false,
         formatter: reactFormatter(<EditBrand edit={edit} />),
      },
   ]

   if (loading) return <InlineLoader />
   if (error) {
      logger(error)
      toast.error('Something went wrong')
   }
   return (
      <>
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            data={content_informationBlock}
            options={{
               ...tableOptions,
               placeholder: 'No Block Data Available',
            }}
         />
         <ComboButton type="solid">
            <PlusIcon />
            Add Block Data
         </ComboButton>
      </>
   )
}

const EditBrand = ({ cell, edit }) => {
   return (
      <IconButton type="outline" size="sm" onClick={() => edit(cell.getData())}>
         <EditIcon color="rgb(40, 193, 247)" />
      </IconButton>
   )
}
