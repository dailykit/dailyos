import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import { InlineLoader } from '../../../../../shared/components'
import tableOptions from '../tableOption'
import { INFORMATION_GRID } from '../../../graphql'
import { useTabs } from '../../../context'
import { useTooltip } from '../../../../../shared/providers'

export const InformationGrid = () => {
   const { tab, addTab } = useTabs()
   const tableRef = React.useRef()
   const { tooltip } = useTooltip()

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

   const columns = React.useMemo(
      () => [
         {
            title: 'Heading',
            field: 'heading',
            headerSort: true,
            headerFilter: true,
            cellClick: (e, cell) => {
               const { id } = cell._cell.row.data
               addTab('Grid Info', `/content/blocks/grid/${id}`)
            },
            headerTooltip: function (column) {
               const identifier = 'grid_listing_heading_column'
               return (
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
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
                  tooltip(identifier)?.description ||
                  column.getDefinition().title
               )
            },
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
