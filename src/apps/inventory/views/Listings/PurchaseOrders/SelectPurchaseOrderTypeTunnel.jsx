import { useMutation } from '@apollo/react-hooks'
import { Loader, Text } from '@dailykit/ui'
import React from 'react'
import { toast } from 'react-toastify'

import { Spacer, TunnelContainer, TunnelHeader } from '../../../components'
import { Context } from '../../../context/tabs'
import { CREATE_PACKAGING_PURCHASE_ORDER } from '../../../graphql'
import { SolidTile } from '../styled'

function onError(error) {
   toast.error(error.message)
   console.log(error)
}

export default function SelectPurchaseOrderTypeTunnel({ close }) {
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view, id) => {
      dispatch({
         type: 'ADD_TAB',
         payload: { type: 'forms', title, view, id },
      })
   }

   const [createPackagingOrder, { loading }] = useMutation(
      CREATE_PACKAGING_PURCHASE_ORDER,
      {
         onCompleted: data => {
            const { id } = data.item
            addTab('Purchase Order', 'packagingPurchaseOrder', id)
         },
         onError,
      }
   )

   const createPackagingPurchaseOrder = () => {
      createPackagingOrder()
   }

   const createSupplierItemPurchaseOrder = () => {
      addTab('New Purchase Order', 'purchaseOrder')
   }

   if (loading) return <Loader />

   return (
      <TunnelContainer>
         <TunnelHeader
            title="select type of packaging"
            close={() => {
               close(1)
            }}
            next={() => {
               close(1)
            }}
            nextAction="Save"
         />
         <Spacer />
         <SolidTile onClick={createPackagingPurchaseOrder}>
            <Text as="h1">Packaging</Text>
            <Text as="subtitle">
               Purchase orders associated with inventory packagings.
            </Text>
         </SolidTile>
         <br />
         <SolidTile onClick={createSupplierItemPurchaseOrder}>
            <Text as="h1">Supplier Item</Text>
            <Text as="subtitle">
               Purchase orders associated with inventory supplier items.
            </Text>
         </SolidTile>
      </TunnelContainer>
   )
}
