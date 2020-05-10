import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { useTranslation, Trans } from 'react-i18next'

import {
   Table,
   TableHead,
   TableBody,
   TableCell,
   TableRow,
   Loader,
   IconButton,
   Text,
   Tag,
} from '@dailykit/ui'

import { Context } from '../../../../../context/tabs'
import { S_CUSTOMIZABLE_PRODUCTS } from '../../../../../graphql'
import { EditIcon, DeleteIcon } from '../../../../../../../shared/assets/icons'
import { GridContainer } from '../../../styled'

const address = 'apps.online_store.views.listings.productslisting.'

const CustomizableProducts = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)

   const { data, loading, error } = useSubscription(S_CUSTOMIZABLE_PRODUCTS)

   const addTab = (title, view, id) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view, id } })
   }

   if (loading) return <Loader />
   if (error) return <Text as="p">{t(address.concat('error'))}</Text>

   return (
      <Table>
         <TableHead>
            <TableRow>
               <TableCell>{t(address.concat('product name'))}</TableCell>
               <TableCell></TableCell>
            </TableRow>
         </TableHead>
         <TableBody>
            {data.customizableProducts.map(product => (
               <TableRow
                  key={product.id}
                  onClick={() =>
                     addTab(product.name, 'customizableProduct', product.id)
                  }
               >
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right">
                     <GridContainer>
                        <IconButton>
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

export default CustomizableProducts
