import {
   IconButton,
   Tunnel,
   Tunnels,
   useTunnel,
   Text,
   TextButton,
   Loader,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { Context } from '../../../context/tabs'

import { AddIcon } from '../../../assets/icons'
import { StyledHeader, StyledWrapper } from '../styled'
import PackagingTypeTunnel from './PackagingTypeTunnel'
import { PACKAGINGS_SUBSCRIPTION } from '../../../graphql'

export default function Packagings() {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const {
      loading: subLoading,
      data: { packagings = [] } = {},
   } = useSubscription(PACKAGINGS_SUBSCRIPTION, {
      onError: error => {
         toast.error('Error! Please try reloading the page')
         console.log(error)
      },
   })

   if (subLoading) return <Loader />

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <PackagingTypeTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               <Text as="h1">Packagings</Text>
               <IconButton type="solid" onClick={() => openTunnel(1)}>
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledHeader>

            <div style={{ width: '90%', margin: '20px auto' }}>
               <DataTable data={packagings} />
            </div>
         </StyledWrapper>
      </>
   )
}

function DataTable({ data }) {
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   const tableRef = React.useRef()

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

   const rowClick = (e, row) => {
      const { id, name } = row._row.data
      dispatch({
         type: 'SET_PACKAGING_ID',
         payload: id,
      })
      addTab(name, 'sachetPackaging')
   }

   const columns = [
      { title: 'Name', field: 'name', headerFilter: true },
      {
         title: 'Supplier',
         field: 'supplier',
         headerFilter: false,
         formatter: reactFormatter(<SupplierName />),
      },
      {
         title: 'Type',
         field: 'type',
         headerFilter: true,
      },
      {
         title: 'Par Level',
         field: 'parLevel',
         headerFilter: true,
         hozAlign: 'right',
      },
      {
         title: 'On Hand',
         field: 'onHand',
         headerFilter: true,
         hozAlign: 'right',
      },
      {
         title: 'Max Level',
         field: 'maxLevel',
         headerFilter: true,
         hozAlign: 'right',
      },
      {
         title: 'Awaiting',
         field: 'awaiting',
         headerFilter: true,
         hozAlign: 'right',
      },
      {
         title: 'Committed',
         field: 'committed',
         headerFilter: true,
         hozAlign: 'right',
      },
   ]

   return (
      <div>
         <TextButton
            style={{ marginBottom: '20px' }}
            type="outline"
            onClick={() => tableRef.current.table.clearHeaderFilter()}
         >
            Clear Filters
         </TextButton>
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            data={data}
            rowClick={rowClick}
            options={options}
         />
      </div>
   )
}

function SupplierName({
   cell: {
      _cell: { value },
   },
}) {
   if (value && value.name) return <>{value.name}</>
   return 'NA'
}
