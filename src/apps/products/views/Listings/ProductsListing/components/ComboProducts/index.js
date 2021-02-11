import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { IconButton, Spacer, Tag, TextButton } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { DeleteIcon } from '../../../../../../../shared/assets/icons'
import {
   ErrorState,
   InlineLoader,
} from '../../../../../../../shared/components'
import { useTooltip, useTabs } from '../../../../../../../shared/providers'
import { logger } from '../../../../../../../shared/utils'
import { DELETE_COMBO_PRODUCTS, S_COMBO_PRODUCTS } from '../../../../../graphql'
import tableOptions from '../../../tableOption'

const address = 'apps.menu.views.listings.productslisting.'

const ComboProducts = () => {
   const { t } = useTranslation()
   const { addTab } = useTabs()
   const { tooltip } = useTooltip()

   const tableRef = React.useRef()

   const {
      data: { comboProducts = [] } = {},
      loading,
      error,
   } = useSubscription(S_COMBO_PRODUCTS)

   const [deleteProducts] = useMutation(DELETE_COMBO_PRODUCTS, {
      onCompleted: () => {
         toast.success('Product deleted!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   // Handler
   const deleteProductHandler = product => {
      if (
         window.confirm(
            `Are you sure you want to delete product - ${product.name}?`
         )
      ) {
         deleteProducts({
            variables: {
               ids: [product.id],
            },
         })
      }
   }

   const columns = [
      {
         title: t(address.concat('product name')),
         field: 'name',
         headerFilter: true,
         cellClick: (e, cell) => {
            const { name, id } = cell._cell.row.data
            addTab(name, `/products/combo-products/${id}`)
         },
         cssClass: 'colHover',
         headerTooltip: function (column) {
            const identifier = 'combo_products_listing_name_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
      },
      {
         title: t(address.concat('labels')),
         field: 'comboProductComponents',
         headerFilter: false,
         headerSort: false,
         formatter: reactFormatter(<ShowLabels />),
      },
      {
         title: 'Published',
         field: 'isPublished',
         formatter: 'tickCross',
         hozAlign: 'center',
         headerHozAlign: 'center',
         width: 150,
      },
      {
         title: 'Actions',
         headerFilter: false,
         headerSort: false,
         hozAlign: 'center',
         formatter: reactFormatter(
            <DeleteProduct onDelete={deleteProductHandler} />
         ),
         width: 150,
      },
   ]

   if (!loading && error) {
      toast.error('Failed to fetch Combo Products!')
      logger(error)
      return <ErrorState />
   }

   return (
      <>
         <TextButton
            type="outline"
            onClick={() => tableRef.current.table.clearHeaderFilter()}
         >
            Clear Filters
         </TextButton>
         <Spacer size="16px" />
         {loading ? (
            <InlineLoader />
         ) : (
            <ReactTabulator
               ref={tableRef}
               columns={columns}
               data={comboProducts}
               options={tableOptions}
            />
         )}
      </>
   )
}

function DeleteProduct({ cell, onDelete }) {
   const product = cell.getData()

   return (
      <IconButton type="ghost" onClick={() => onDelete(product)}>
         <DeleteIcon color="#FF5A52" />
      </IconButton>
   )
}

function ShowLabels({
   cell: {
      _cell: { value },
   },
}) {
   if (value && value.length)
      return value.map(comp => <Tag key={comp.id}>{comp.label}</Tag>)
   return null
}

export default ComboProducts
