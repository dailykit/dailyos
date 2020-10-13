import React from 'react'

// third party imports
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { IconButton, Loader, Spacer, TextButton } from '@dailykit/ui'

// shared dir imports
import { DeleteIcon } from '../../../../../../../shared/assets/icons'
import { logger } from '../../../../../../../shared/utils'

// graphql imports
import {
   DELETE_INVENTORY_PRODUCTS,
   S_INVENTORY_PRODUCTS,
} from '../../../../../graphql'

// context imports
import { useTabs } from '../../../../../context'

// local imports
import tableOptions from '../../../tableOption'

const address = 'apps.online_store.views.listings.productslisting.'

const InventoryProducts = () => {
   const { t } = useTranslation()
   const { addTab } = useTabs()

   const tableRef = React.useRef()

   const {
      data: { inventoryProducts = [] } = {},
      loading,
      error,
   } = useSubscription(S_INVENTORY_PRODUCTS)

   if (error) {
      toast.error('Something went wrong!')
      logger(error)
   }

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

   const rowClick = (e, row) => {
      const { id, name } = row._row.data
      addTab(name, `/recipe/inventory-products/${id}`)
   }

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
            data={inventoryProducts}
            rowClick={rowClick}
            options={tableOptions}
         />
      </>
   )
}

function DeleteProduct({ cell, onDelete }) {
   const product = cell.getData()

   return (
      <IconButton
         type="ghost"
         onClick={e => e.stopPropagation() && onDelete(product)}
      >
         <DeleteIcon color="#FF5A52" />
      </IconButton>
   )
}

export default InventoryProducts
