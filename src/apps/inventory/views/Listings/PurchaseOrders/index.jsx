import {
   IconButton,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   Loader,
} from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'

import { AddIcon } from '../../../assets/icons'
import { Context } from '../../../context/tabs'
import { StyledHeader, StyledWrapper } from '../styled'
import { PURCHASE_ORDERS_SUBSCRIPTION } from '../../../graphql'

const address = 'apps.inventory.views.listings.purchaseorders.'

export default function PurchaseOrders() {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)

   const [formState, setFormState] = useState([])

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   const { loading } = useSubscription(PURCHASE_ORDERS_SUBSCRIPTION, {
      onSubscriptionData: input => {
         setFormState(input.subscriptionData?.data?.purchaseOrderItems)
      },
   })

   if (loading) return <Loader />

   return (
      <>
         <StyledWrapper>
            <StyledHeader>
               <h1>{t(address.concat('purchase orders'))}</h1>
               <IconButton
                  type="solid"
                  onClick={() => addTab('New Purchase Order', 'purchaseOrder')}
               >
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledHeader>

            <div style={{ width: '95%', margin: '0 auto' }}>
               <Table>
                  <TableHead>
                     <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>Supplier Item</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {formState?.map(purchaseOrder => (
                        <TableRow
                           key={purchaseOrder.id}
                           onClick={() => {
                              dispatch({
                                 type: 'SET_PURCHASE_WORK_ORDER',
                                 payload: {
                                    id: purchaseOrder.id,
                                    status: purchaseOrder.status,
                                 },
                              })
                              addTab('Update Purchase Order', 'purchaseOrder')
                           }}
                        >
                           <TableCell>{purchaseOrder.status}</TableCell>
                           <TableCell>
                              {purchaseOrder.supplierItem.name}
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>

            <br />
         </StyledWrapper>
      </>
   )
}
