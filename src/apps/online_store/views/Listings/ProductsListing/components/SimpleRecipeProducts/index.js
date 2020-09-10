import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { Loader, Text, TextButton } from '@dailykit/ui'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

import { DeleteIcon } from '../../../../../../../shared/assets/icons'
import { useTabs } from '../../../../../context'
import {
   S_SIMPLE_RECIPE_PRODUCTS,
   DELETE_SIMPLE_RECIPE_PRODUCTS,
} from '../../../../../graphql'
import tableOptions from '../../../tableOption'

const address = 'apps.online_store.views.listings.productslisting.'

const InventoryProducts = () => {
   const { t } = useTranslation()
   const { addTab } = useTabs()

   const tableRef = React.useRef()

   const {
      data: { simpleRecipeProducts = [] } = {},
      loading,
      error,
   } = useSubscription(S_SIMPLE_RECIPE_PRODUCTS)

   const [deleteProducts] = useMutation(DELETE_SIMPLE_RECIPE_PRODUCTS, {
      onCompleted: () => {
         toast.success('Product deleted!')
      },
      onError: err => {
         console.log(err)
         toast.error('Could not delete!')
      },
   })

   // Handler
   const deleteHandler = (e, product) => {
      e.stopPropagation()
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
         title: t(address.concat('recipe')),
         field: 'simpleRecipe',
         headerFilter: false,
         formatter: reactFormatter(<RcipeName />),
      },
      {
         title: 'Actions',
         headerFilter: false,
         headerSort: false,
         hozAlign: 'center',
         cellClick: (e, cell) => {
            e.stopPropagation()
            deleteHandler(e, cell._cell.row.data)
         },
         formatter: reactFormatter(<DeleteIngredient />),
      },
   ]

   const rowClick = (e, row) => {
      const { id, name } = row._row.data
      addTab(name, `/online-store/simple-recipe-products/${id}`)
   }

   if (loading) return <Loader />
   if (error) {
      console.log(error)
      return <Text as="p">Error: Could`&apos;`nt fetch products!</Text>
   }
   return (
      <div style={{ width: '80%', margin: '0 auto' }}>
         <TextButton
            type="outline"
            onClick={() => tableRef.current.table.clearHeaderFilter()}
            style={{ marginBottom: '20px' }}
         >
            Clear Filters
         </TextButton>
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            data={simpleRecipeProducts}
            rowClick={rowClick}
            options={tableOptions}
         />
      </div>
   )
}

function DeleteIngredient() {
   return <DeleteIcon color="#FF5A52" />
}

function RcipeName({
   cell: {
      _cell: { value },
   },
}) {
   if (value && value.name) return <>{value.name}</>
   return null
}

export default InventoryProducts
