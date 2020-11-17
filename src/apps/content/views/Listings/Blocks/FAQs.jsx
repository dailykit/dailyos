import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import { Tooltip, InlineLoader } from '../../../../../shared/components'
import tableOptions from '../tableOption'
import { IconButton, Flex, Text } from '@dailykit/ui'
import { FAQS, FAQ_ARCHIVED } from '../../../graphql'
import { useTabs } from '../../../context'
import { useTooltip } from '../../../../../shared/providers'
import { logger } from '../../../../../shared/utils'
import { DeleteIcon } from '../../../../../shared/assets/icons'
import { toast } from 'react-toastify'
import { StyledWrapper } from '../styled'

export const FAQs = () => {
   const { tab, addTab } = useTabs()
   const tableRef = React.useRef()
   const { tooltip } = useTooltip()
   const { loading, error, data: { content_faqs = [] } = {} } = useSubscription(
      FAQS
   )

   // Mutation
   const [deleteFAQ] = useMutation(FAQ_ARCHIVED, {
      onCompleted: () => {
         toast.success('FAQ deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Could not delete!')
      },
   })

   const DeleteButton = () => {
      return (
         <IconButton type="ghost">
            <DeleteIcon color="#FF5A52" />
         </IconButton>
      )
   }

   // Handler
   const deleteHandler = (e, FAQ) => {
      e.stopPropagation()
      if (
         window.confirm(
            `Are you sure you want to delete FAQ - "${FAQ.heading}"?`
         )
      ) {
         deleteFAQ({
            variables: {
               id: FAQ.id,
            },
         })
      }
   }

   const columns = [
      {
         title: 'Heading',
         field: 'heading',
         headerSort: true,
         headerFilter: true,
         cellClick: (e, cell) => {
            const { id } = cell._cell.row.data
            addTab('FAQ Info', `/content/blocks/faq-form/${id}`)
         },
         headerTooltip: function (column) {
            const identifier = 'faq_listing_heading_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
         cssClass: 'colHover',
      },
      {
         title: 'Sub Heading',
         field: 'subHeading',
         headerSort: true,
         headerFilter: true,
         headerTooltip: function (column) {
            const identifier = 'faq_listing_subheading_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         title: 'Action',
         field: 'action',
         cellClick: (e, cell) => {
            e.stopPropagation()
            deleteHandler(e, cell._cell.row.data)
         },
         formatter: reactFormatter(<DeleteButton />),
         hozAlign: 'center',
         titleFormatter: function (cell) {
            cell.getElement().style.textAlign = 'center'
            return '' + cell.getValue()
         },
         width: 150,
      },
   ]

   if (loading) return <InlineLoader />
   if (error) {
      logger(error)
      toast.error(error)
   }
   return (
      <StyledWrapper>
         <Flex container height="50px" alignItems="center">
            <Text as="title">
               FAQs(
               {content_faqs.length})
            </Text>
            <Tooltip identifier="FAQ_list_heading" />
         </Flex>
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            data={content_faqs}
            options={tableOptions}
         />
      </StyledWrapper>
   )
}
