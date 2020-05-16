import {
   IconButton,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   Loader,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'

import { AddIcon } from '../../../assets/icons'
import { Context } from '../../../context/tabs'
import { StyledHeader, StyledWrapper } from '../styled'
import EditIcon from '../../../../recipe/assets/icons/Edit'
import { PURCHASE_ORDERS_SUBSCRIPTION } from '../../../graphql'

const address = 'apps.inventory.views.listings.purchaseorders.'

export default function PurchaseOrders() {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   const { data, loading } = useSubscription(PURCHASE_ORDERS_SUBSCRIPTION)

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

            <DataTable data={data?.purchaseOrderItems} />

            <br />
         </StyledWrapper>
      </>
   )
}

function DataTable({ data }) {
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   return (
      <div style={{ width: '95%', margin: '0 auto' }}>
         <Table>
            <TableHead>
               <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Supplier Item</TableCell>
                  <TableCell align="right" />
               </TableRow>
            </TableHead>
            <TableBody>
               {data?.map(purchaseOrder => (
                  <TableRow key={purchaseOrder.id}>
                     <TableCell>{purchaseOrder.status}</TableCell>
                     <TableCell>{purchaseOrder.supplierItem.name}</TableCell>
                     <TableCell align="right">
                        <IconButton
                           type="outline"
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
                           <EditIcon />
                        </IconButton>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   )
}
