import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { Loader, Text, TextButton } from '@dailykit/ui'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import { toast } from 'react-toastify'

import { useTranslation } from 'react-i18next'
import { DeleteIcon } from '../../../../../../../shared/assets/icons'
import { Context } from '../../../../../context/tabs'
import {
   S_CUSTOMIZABLE_PRODUCTS,
   DELETE_CUSTOMIZABLE_PRODUCTS,
} from '../../../../../graphql'

const address = 'apps.online_store.views.listings.productslisting.'

const CustomizableProducts = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)

   const tableRef = React.useRef()

   const {
      data: { customizableProducts = [] } = {},
      loading,
      error,
   } = useSubscription(S_CUSTOMIZABLE_PRODUCTS)

   const addTab = (title, view, id) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view, id } })
   }

   const [deleteProducts] = useMutation(DELETE_CUSTOMIZABLE_PRODUCTS, {
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

   const options = {
      cellVertAlign: 'middle',
      layout: 'fitColumns',
      autoResize: true,
      resizableColumns: true,
      virtualDomBuffer: 80,
      placeholder: 'No Data Available',
      persistence: true,
      persistenceMode: 'cookie',
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
         cellClick: (e, cell) => {
            e.stopPropagation()
            deleteHandler(e, cell._cell.row.data)
         },
         formatter: reactFormatter(<DeleteIngredient />),
      },
   ]

   const rowClick = (e, row) => {
      const { id, name } = row._row.data
      addTab(name, 'customizableProduct', id)
   }

   if (loading) return <Loader />
   if (error) {
      console.log(error)
      return <Text as="p">Error: Could'nt fetch products!</Text>
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
            data={customizableProducts}
            rowClick={rowClick}
            options={options}
         />
      </div>
   )
}

function DeleteIngredient() {
   return <DeleteIcon color="#FF5A52" />
}

export default CustomizableProducts
