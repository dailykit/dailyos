import {
   IconButton,
   Tunnel,
   Tunnels,
   useTunnel,
   Text,
   ComboButton,
   Loader,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { Context } from '../../../context/tabs'

import { AddIcon, PackagingHubIcon } from '../../../assets/icons'
import { StyledHeader, StyledWrapper } from '../styled'
import PackagingTypeTunnel from './PackagingTypeTunnel'
import { PACKAGINGS_LISTINGS_SUBSCRIPTION } from '../../../graphql'
import tableOptions from '../tableOption'
import { FlexContainer } from '../../Forms/styled'

export default function Packagings() {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const {
      loading: subLoading,
      data: { packagings = [] } = {},
   } = useSubscription(PACKAGINGS_LISTINGS_SUBSCRIPTION, {
      onError: error => {
         toast.error('Error! Please try reloading the page')
         console.log(error)
      },
   })

   const { dispatch } = React.useContext(Context)

   const addTab = (title, view, id) => {
      dispatch({
         type: 'ADD_TAB',
         payload: { type: 'forms', title, view, id },
      })
   }
   const tableRef = React.useRef()

   const rowClick = (_, row) => {
      const { id, packagingName } = row._row.data
      addTab(packagingName, 'sachetPackaging', id)
   }

   const columns = [
      { title: 'Name', field: 'packagingName', headerFilter: true },
      {
         title: 'Supplier',
         field: 'supplier',
         headerFilter: false,
         formatter: reactFormatter(<SupplierName />),
      },
      {
         title: 'Type',
         field: 'type',
         headerFilter: false,
      },
      {
         title: 'Par Level',
         field: 'parLevel',
         headerFilter: false,
         headerSort: false,
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
   ]

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
               <Text as="title">Packagings</Text>
               <FlexContainer>
                  <ComboButton
                     type="outline"
                     onClick={() => addTab('Packaging Hub', 'packagingHub')}
                  >
                     <PackagingHubIcon />
                     EXPLORE PACKAGING HUB
                  </ComboButton>
                  <span style={{ width: '10px' }} />
                  <IconButton type="solid" onClick={() => openTunnel(1)}>
                     <AddIcon color="#fff" size={24} />
                  </IconButton>
               </FlexContainer>
            </StyledHeader>
            <br />

            <div style={{ width: '90%', margin: '0 auto' }}>
               <ReactTabulator
                  ref={tableRef}
                  columns={columns}
                  data={packagings}
                  rowClick={rowClick}
                  options={tableOptions}
               />
            </div>
         </StyledWrapper>
      </>
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
