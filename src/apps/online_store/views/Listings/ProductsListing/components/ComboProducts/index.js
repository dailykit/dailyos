import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import {
   IconButton,
   Loader,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Tag,
   Text,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { DeleteIcon } from '../../../../../../../shared/assets/icons'
import { Context } from '../../../../../context/tabs'
import { S_COMBO_PRODUCTS } from '../../../../../graphql'
import { GridContainer } from '../../../styled'

const address = 'apps.online_store.views.listings.productslisting.'

const ComboProducts = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)

   const { data, loading, error } = useSubscription(S_COMBO_PRODUCTS)

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
               <TableCell>{t(address.concat('labels'))}</TableCell>
               <TableCell></TableCell>
            </TableRow>
         </TableHead>
         <TableBody>
            {data.comboProducts.map(product => (
               <TableRow
                  key={product.id}
                  onClick={() =>
                     addTab(product.name, 'comboProduct', product.id)
                  }
               >
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                     {product.comboProductComponents.map(comp => (
                        <Tag key={comp.id}>{comp.label}</Tag>
                     ))}
                  </TableCell>
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

export default ComboProducts
