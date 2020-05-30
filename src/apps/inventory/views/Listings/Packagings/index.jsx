import {
   IconButton,
   Tunnel,
   Tunnels,
   useTunnel,
   Text,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   Loader,
   Toggle,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import React, { useState } from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'

import { Context } from '../../../context/tabs'

import { AddIcon } from '../../../assets/icons'
import { StyledHeader, StyledWrapper } from '../styled'
import PackagingTypeTunnel from './PackagingTypeTunnel'
import { PACKAGINGS_SUBSCRIPTION, UPDATE_PACKAGING } from '../../../graphql'

export default function Packagings() {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [data, setData] = useState([])

   const { loading: subLoading } = useSubscription(PACKAGINGS_SUBSCRIPTION, {
      onSubscriptionData: input => {
         setData(input.subscriptionData.data.packagings)
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

            <DataTable data={data} />
         </StyledWrapper>
      </>
   )
}

function DataTable({ data }) {
   const { dispatch } = React.useContext(Context)
   const [loading, setLoading] = useState(false)

   const [updatePackaging] = useMutation(UPDATE_PACKAGING)

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   if (loading) return <Loader />

   return (
      <Table>
         <TableHead>
            <TableRow>
               <TableCell>Packaging item</TableCell>
               <TableCell>Supplier</TableCell>
               <TableCell>Packaging type</TableCell>
               <TableCell>On hand</TableCell>
               <TableCell>Awaiting</TableCell>
               <TableCell>Committed</TableCell>
               <TableCell>Availability</TableCell>
            </TableRow>
         </TableHead>
         <TableBody>
            {data.reverse().map(packaging => (
               <TableRow
                  key={packaging.id}
                  onClick={() => {
                     dispatch({
                        type: 'SET_PACKAGING_ID',
                        payload: packaging.id,
                     })
                     addTab('Packaging', 'sachetPackaging')
                  }}
               >
                  <TableCell>{packaging.name}</TableCell>
                  <TableCell>{packaging.supplier.name}</TableCell>
                  <TableCell>{packaging.type}</TableCell>
                  <TableCell>
                     <span style={{ marginRight: '5px' }}>
                        {packaging.parLevel}
                     </span>
                     {'{'}
                     <span style={{ margin: '0 10px' }}>
                        {packaging.onHand}
                     </span>
                     {'}'}
                     <span style={{ marginLeft: '5px' }}>
                        {packaging.maxLevel}
                     </span>
                  </TableCell>
                  <TableCell>{packaging.awaiting}</TableCell>
                  <TableCell>{packaging.committed}</TableCell>
                  <TableCell>
                     <Toggle
                        checked={packaging.isAvailable}
                        setChecked={async () => {
                           try {
                              setLoading(true)
                              const resp = await updatePackaging({
                                 variables: {
                                    id: packaging.id,
                                    object: {
                                       isAvailable: !packaging.isAvailable,
                                    },
                                 },
                              })

                              if (resp?.data?.updatePackaging) {
                                 setLoading(false)
                              }
                           } catch (error) {
                              setLoading(false)
                              console.log(error)
                              toast.error('Internal Error')
                           }
                        }}
                     />
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   )
}
