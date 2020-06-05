import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   IconButton,
   Loader,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
} from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import DeleteIcon from '../../../../../shared/assets/icons/Delete'
import { AddIcon } from '../../../assets/icons'
import { Context } from '../../../context/tabs'
import { DELETE_SUPPLIER, SUPPLIERS_SUBSCRIPTION } from '../../../graphql'
import { StyledHeader, StyledWrapper } from '../styled'

const address = 'apps.inventory.views.listings.supplier.'

export default function SupplierListing() {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const [formState, setFormState] = useState([])
   const { loading: listLoading } = useSubscription(SUPPLIERS_SUBSCRIPTION, {
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.suppliers
         setFormState(data)
      },
   })

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   const [deleteSupplier, { loading }] = useMutation(DELETE_SUPPLIER, {
      onCompleted: () => {
         toast.info('Supplier deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error(
            'Supplier is linked with items, hence can not be removed. To delete the supplier, remove those items first'
         )
      },
   })

   const handleSupplierEdit = id => {
      dispatch({ type: 'ADD_SUPPLIER_ID', payload: id })
      addTab('Add Supplier', 'suppliers')
   }

   if (loading) return <Loader />

   return (
      <>
         <StyledWrapper>
            <StyledHeader>
               <h1>{t(address.concat('suppliers'))}</h1>
               <IconButton
                  type="solid"
                  onClick={() => {
                     dispatch({ type: 'ADD_SUPPLIER_ID', payload: '' })
                     addTab('Add Supplier', 'suppliers')
                  }}
               >
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledHeader>

            <div style={{ margin: '0 auto', width: '80%' }}>
               {listLoading ? (
                  <Loader />
               ) : (
                  <Table>
                     <TableHead>
                        <TableRow>
                           <TableCell>{t(address.concat('name'))}</TableCell>
                           <TableCell>
                              {t(address.concat('person of contact'))}
                           </TableCell>

                           <TableCell align="right" />
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {formState.map(supplier => (
                           <TableRow
                              onClick={() => handleSupplierEdit(supplier?.id)}
                              key={supplier?.id}
                           >
                              <TableCell>{supplier?.name}</TableCell>
                              <TableCell>{`${supplier?.contactPerson?.firstName} ${supplier?.contactPerson?.lastName} ${supplier?.contactPerson?.countryCode} ${supplier?.contactPerson?.phoneNumber}`}</TableCell>

                              <TableCell align="right">
                                 <IconButton
                                    onClick={e => {
                                       e.stopPropagation()

                                       deleteSupplier({
                                          variables: { id: supplier?.id },
                                       })
                                    }}
                                    type="ghost"
                                 >
                                    <DeleteIcon />
                                 </IconButton>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               )}
            </div>
         </StyledWrapper>
      </>
   )
}
