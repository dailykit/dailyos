import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import {
   IconButton,
   Loader,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Text,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { DeleteIcon } from '../../../../../../../shared/assets/icons'
import { Context } from '../../../../../context/tabs'
import {
   S_INVENTORY_PRODUCTS,
   DELETE_INVENTORY_PRODUCTS,
} from '../../../../../graphql'
import { GridContainer } from '../../../styled'
import { toast } from 'react-toastify'

const address = 'apps.online_store.views.listings.productslisting.'

const InventoryProducts = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)

   const { data, loading, error } = useSubscription(S_INVENTORY_PRODUCTS)

   const addTab = (title, view, id) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view, id } })
   }

   const [deleteProducts] = useMutation(DELETE_INVENTORY_PRODUCTS, {
      onCompleted: () => {
         toast.success('Product deleted!')
      },
      onError: error => {
         console.log(error)
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

   if (loading) return <Loader />
   if (error) {
      console.log(error)
      return <Text as="p">Error: Could'nt fetch products!</Text>
   }

   return (
      <Table>
         <TableHead>
            <TableRow>
               <TableCell>{t(address.concat('product name'))}</TableCell>
               <TableCell></TableCell>
            </TableRow>
         </TableHead>
         <TableBody>
            {data.inventoryProducts.map(product => (
               <TableRow
                  key={product.id}
                  onClick={() =>
                     addTab(product.name, 'inventoryProduct', product.id)
                  }
               >
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right">
                     <GridContainer>
                        <IconButton onClick={e => deleteHandler(e, product)}>
                           <DeleteIcon color="#FF5A52" />
                        </IconButton>
                     </GridContainer>
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   )
}

export default InventoryProducts
