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

const address = 'apps.online_store.views.listings.productslisting.'

const ComboProducts = () => {
   const { t } = useTranslation()
   const { addTab } = useTabs()

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
      },
      {
         title: t(address.concat('labels')),
         field: 'comboProductComponents',
         headerFilter: false,
         headerSort: false,
         formatter: reactFormatter(<ShowLabels />),
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
      addTab(name, `/recipe/combo-products/${id}`)
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
            data={comboProducts}
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
