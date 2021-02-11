import React from 'react'

import { useMutation, useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { IconButton, Spacer, TextButton } from '@dailykit/ui'

import { DeleteIcon } from '../../../../../../../shared/assets/icons'
import { logger } from '../../../../../../../shared/utils'

import {
   DELETE_INVENTORY_PRODUCTS,
   S_INVENTORY_PRODUCTS,
} from '../../../../../graphql'

import tableOptions from '../../../tableOption'
import { useTooltip, useTabs } from '../../../../../../../shared/providers'
import {
   ErrorState,
   InlineLoader,
} from '../../../../../../../shared/components'

const address = 'apps.menu.views.listings.productslisting.'

const InventoryProducts = () => {
   const { t } = useTranslation()
   const { addTab } = useTabs()
   const { tooltip } = useTooltip()

   const tableRef = React.useRef()

   const {
      data: { inventoryProducts = [] } = {},
      loading,
      error,
   } = useSubscription(S_INVENTORY_PRODUCTS)

   const [deleteProducts] = useMutation(DELETE_INVENTORY_PRODUCTS, {
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
         widthGrow: 2,
         cellClick: (e, cell) => {
            const { name, id } = cell._cell.row.data
            addTab(name, `/products/inventory-products/${id}`)
         },
         cssClass: 'colHover',
         headerTooltip: function (column) {
            const identifier = 'inventory_products_listing_name_column'
            return (
               tooltip(identifier)?.description || column.getDefinition().title
            )
         },
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
      toast.error('Failed to fetch Inventory Products!')
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
               data={inventoryProducts}
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

export default InventoryProducts
