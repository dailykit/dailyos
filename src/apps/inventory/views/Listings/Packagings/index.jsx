import { useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'
import {
   ComboButton,
   IconButton,
   Loader,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import React from 'react'
import { toast } from 'react-toastify'
import { AddIcon, PackagingHubIcon } from '../../../assets/icons'
import { useTabs } from '../../../context'
import { PACKAGINGS_LISTINGS_SUBSCRIPTION } from '../../../graphql'
import { FlexContainer } from '../../Forms/styled'
import { StyledHeader, StyledWrapper } from '../styled'
import tableOptions from '../tableOption'
import PackagingTypeTunnel from './PackagingTypeTunnel'

export default function Packagings() {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const { addTab } = useTabs()

   const {
      loading: subLoading,
      data: { packagings = [] } = {},
   } = useSubscription(PACKAGINGS_LISTINGS_SUBSCRIPTION, {
      onError: error => {
         toast.error('Error! Please try reloading the page')
         console.log(error)
      },
   })

   const tableRef = React.useRef()

   const rowClick = (_, row) => {
      const { id, packagingName } = row._row.data
      addTab(packagingName, `/inventory/packagings/${id}`)
   }

   const columns = [
      { title: 'Name', field: 'packagingName', headerFilter: true },
      {
         title: 'Supplier',
         field: 'supplier',
         headerFilter: false,
         formatter: reactFormatter(<SupplierName />),
         hozAlign: 'left',
         headerHozAlign: 'left',
         width: 180,
      },
      {
         title: 'Type',
         field: 'type',
         headerFilter: false,
         hozAlign: 'left',
         headerHozAlign: 'left',
         width: 200,
      },
      {
         title: 'Par Level',
         field: 'parLevel',
         headerFilter: false,
         headerSort: false,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 120,
      },
      {
         title: 'On Hand',
         field: 'onHand',
         headerFilter: true,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 120,
      },
      {
         title: 'Max Level',
         field: 'maxLevel',
         headerFilter: true,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 120,
      },
      {
         title: 'Awaiting',
         field: 'awaiting',
         headerFilter: true,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 120,
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
                     onClick={() =>
                        addTab('Packaging Hub', '/inventory/packaging-hub')
                     }
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

            <div>
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
