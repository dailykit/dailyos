import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { IconButton } from '@dailykit/ui'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import { InlineLoader } from '../../../../../shared/components'
import tableOptions from '../tableOption'
import { FAQS } from '../../../graphql'
import { useTabs } from '../../../context'
import { EditIcon } from '../../../../../shared/assets/icons'

export const FAQs = () => {
   const { tab, addTab } = useTabs()
   const tableRef = React.useRef()

   const { loading, error, data: { content_faqs = [] } = {} } = useSubscription(
      FAQS
   )
   React.useEffect(() => {
      if (!tab) {
         addTab('InformationBlock', '/content/blocks/faq/')
      }
   }, [tab, addTab])

   const edit = faq => {
      addTab(faq?.heading || 'N/A', `/content/blocks/faq/${faq.id}`)
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
         data={content_faqs}
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
