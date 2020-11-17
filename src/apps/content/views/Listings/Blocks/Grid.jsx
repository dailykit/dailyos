import React, { useRef } from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { IconButton, Flex, Text } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import { Tooltip, InlineLoader } from '../../../../../shared/components'
import tableOptions from '../tableOption'
import { INFORMATION_GRID, GRID_ARCHIVED } from '../../../graphql'
import { useTabs } from '../../../context'
import { useTooltip } from '../../../../../shared/providers'
import { logger } from '../../../../../shared/utils'
import { DeleteIcon } from '../../../../../shared/assets/icons'
import { useLocation } from 'react-router-dom'
import { StyledWrapper } from '../styled'

export const InformationGrid = () => {
   const { tab, addTab } = useTabs()
   const location = useLocation()
   const tableRef = useRef()
   const { tooltip } = useTooltip()

   const {
      loading,
      error,
      data: { content_informationGrid = [] } = {},
   } = useSubscription(INFORMATION_GRID)

   // Mutation
   const [deleteGrid] = useMutation(GRID_ARCHIVED, {
      onCompleted: () => {
         toast.success('Grid deleted!')
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
   const deleteHandler = (e, grid) => {
      e.stopPropagation()
      if (
         window.confirm(
            `Are you sure you want to delete Grid - "${grid.heading}"?`
         )
      ) {
         deleteGrid({
            variables: {
               id: grid.id,
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
            addTab('Grid Info', `/content/blocks/grid-form/${id}`)
         },
         headerTooltip: function (column) {
            const identifier = 'grid_listing_heading_column'
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
            const identifier = 'grid_listing_subheading_column'
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
      toast.error('Something went wrong')
   }
   return (
      <StyledWrapper>
         <Flex container height="50px" alignItems="center">
            <Text as="title">
               Grid(
               {content_informationGrid.length})
            </Text>
            <Tooltip identifier="Information_Grid_list_heading" />
         </Flex>
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            data={content_informationGrid}
            options={{
               ...tableOptions,
               placeholder: 'No Grid Information Available!',
            }}
         />
      </StyledWrapper>
   )
}
