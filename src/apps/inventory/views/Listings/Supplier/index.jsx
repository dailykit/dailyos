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
import { randomSuffix } from '../../../../../shared/utils/index'
import { AddIcon } from '../../../assets/icons'
import { Context } from '../../../context/tabs'
import {
   CREATE_SUPPLIER,
   DELETE_SUPPLIER,
   SUPPLIERS_SUBSCRIPTION,
} from '../../../graphql'
import { StyledHeader, StyledWrapper } from '../styled'

const address = 'apps.inventory.views.listings.supplier.'

export default function SupplierListing() {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const [formState, setFormState] = useState([])

   const addTab = (title, view, id) => {
      dispatch({
         type: 'ADD_TAB',
         payload: { type: 'forms', title, view, id },
      })
   }

   const { loading: listLoading } = useSubscription(SUPPLIERS_SUBSCRIPTION, {
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.suppliers
         setFormState(data)
      },
      onError: error => {
         console.log(error)
         toast.error('Error! Please try reloading the page')
      },
   })

   const [createSupplier, { loading: supplierCreateLoading }] = useMutation(
      CREATE_SUPPLIER,
      {
         onCompleted: input => {
            const supplierData = input.createSupplier.returning[0]
            addTab(supplierData.name, 'suppliers', supplierData.id)
            toast.success('Supplier Added!')
         },
         onError: error => {
            console.log(error)
            toast.error('Something went wrong, try again')
         },
      }
   )

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

   const createSupplierHandler = () => {
      // create supplier in DB
      const name = `supplier-${randomSuffix()}`
      createSupplier({
         variables: {
            object: {
               name,
            },
         },
      })
   }

   if (loading || supplierCreateLoading || listLoading) return <Loader />

   return (
      <>
         <StyledWrapper>
            <StyledHeader>
               <h1>{t(address.concat('suppliers'))}</h1>
               <IconButton type="solid" onClick={createSupplierHandler}>
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledHeader>

            <div style={{ margin: '0 auto', width: '80%' }}>
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
                           onClick={() =>
                              addTab(supplier.name, 'suppliers', supplier.id)
                           }
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
            </div>
         </StyledWrapper>
      </>
   )
}
