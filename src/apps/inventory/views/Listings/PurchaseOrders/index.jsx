import {
   IconButton,
   Loader,
   TextButton,
   Text,
   Tag,
   Tunnels,
   Tunnel,
   useTunnel,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import { v4 as uuid } from 'uuid'

import { AddIcon } from '../../../assets/icons'
import { Context } from '../../../context/tabs'
import { StyledHeader, StyledWrapper } from '../styled'
import { PURCHASE_ORDERS_SUBSCRIPTION } from '../../../graphql'
import tableOptions from '../tableOption'
import { FlexContainer } from '../../Forms/styled'
import SelectPurchaseOrderTypeTunnel from './SelectPurchaseOrderTypeTunnel'

const address = 'apps.inventory.views.listings.purchaseorders.'

export default function PurchaseOrders() {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)

   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const addTab = (title, view, id) => {
      dispatch({
         type: 'ADD_TAB',
         payload: { type: 'forms', title, view, id },
      })
   }

   const { loading, data: { purchaseOrderItems = [] } = {} } = useSubscription(
      PURCHASE_ORDERS_SUBSCRIPTION,
      {
         onError: error => {
            toast.error('Error! Please try reloading the page')
            console.log(error)
         },
      }
   )

   const tableRef = React.useRef()

   const rowClick = (_, row) => {
      const { id, type } = row._row.data
      const tabTitle = `Purchase Order-${uuid().substring(30)}`
      if (type === 'PACKAGING') {
         addTab(tabTitle, 'packagingPurchaseOrder', id)
      }

      if (type === 'SUPPLIER_ITEM') {
         addTab(tabTitle, 'purchaseOrder', id)
      }
   }

   const columns = [
      { title: 'Status', field: 'status', headerFilter: true },
      {
         title: 'Item',
         field: 'supplierItem',
         headerFilter: false,
         formatter: reactFormatter(<SupplierItemName />),
      },
      {
         title: 'Type',
         field: 'packaging',
         headerFilter: false,
         formatter: reactFormatter(<LabelItem />),
      },
   ]

   if (loading) return <Loader />

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <SelectPurchaseOrderTypeTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               <Text as="title">{t(address.concat('purchase orders'))}</Text>
               <FlexContainer>
                  <TextButton
                     type="outline"
                     onClick={() => tableRef.current.table.clearHeaderFilter()}
                  >
                     Clear Filters
                  </TextButton>
                  <span style={{ width: '10px' }} />
                  <IconButton type="solid" onClick={() => openTunnel(1)}>
                     <AddIcon color="#fff" size={24} />
                  </IconButton>
               </FlexContainer>
            </StyledHeader>

            <div style={{ width: '90%', margin: '0 auto' }}>
               <ReactTabulator
                  ref={tableRef}
                  columns={columns}
                  data={purchaseOrderItems}
                  rowClick={rowClick}
                  options={tableOptions}
               />
            </div>
         </StyledWrapper>
      </>
   )
}

function SupplierItemName({
   cell: {
      _cell: {
         row: { data },
      },
   },
}) {
   if (data.supplierItem && data.supplierItem.name)
      return data.supplierItem.name
   if (data.packaging && data.packaging.packagingName)
      return data.packaging.packagingName
   return 'NA'
}

function LabelItem({
   cell: {
      _cell: {
         row: { data },
      },
   },
}) {
   if (data && data.type === 'PACKAGING')
      return <Tag color="success">Packaging</Tag>
   if (data && data.type === 'SUPPLIER_ITEM')
      return <Tag color="primary">Supplier Item</Tag>

   return <Tag color="danger">NA</Tag>
}
