import React from 'react'

// third party imports
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { IconButton, Loader, Spacer, Tag, TextButton } from '@dailykit/ui'

// shared dir imports
import { DeleteIcon } from '../../../../../../../shared/assets/icons'
import { logger } from '../../../../../../../shared/utils'

// graphql imports
import { DELETE_COMBO_PRODUCTS, S_COMBO_PRODUCTS } from '../../../../../graphql'

// context imports
import { useTabs } from '../../../../../context/tabs'

// local imports
import tableOptions from '../../../tableOption'
import { useTooltip } from '../../../../../../../shared/providers'

const address = 'apps.online_store.views.listings.productslisting.'

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

   if (error) {
      toast.error('Something went wrong!')
      logger(error)
   }

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

   if (loading) return <Loader />

   return (
      <>
         <TextButton
            type="outline"
            onClick={() => tableRef.current.table.clearHeaderFilter()}
         >
            Clear Filters
         </TextButton>
         <Spacer size="16px" />
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            data={comboProducts}
            options={tableOptions}
         />
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
