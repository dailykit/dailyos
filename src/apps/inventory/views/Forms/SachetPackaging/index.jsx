import React, { useReducer } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Tunnels, Tunnel, useTunnel, ButtonTile, Loader } from '@dailykit/ui'

import {
   sachetPackagingInitialState,
   sachetPackagingReducers,
   SachetPackagingContext,
} from '../../../context'
import { StyledWrapper } from '../styled'
import { SuppliersTunnel } from './Tunnels'

import { SUPPLIERS } from '../../../graphql'

export default function SachetPackaging() {
   const [sachetPackagingState, sachetPackagingDispatch] = useReducer(
      sachetPackagingReducers,
      sachetPackagingInitialState
   )
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const { loading: supplierLoading, data: supplierData } = useQuery(SUPPLIERS)

   if (supplierLoading) return <Loader />

   return (
      <>
         <SachetPackagingContext.Provider
            value={(sachetPackagingState, sachetPackagingDispatch)}
         >
            <Tunnels tunnels={tunnels}>
               <Tunnel layer={1}>
                  <SuppliersTunnel
                     close={closeTunnel}
                     open={openTunnel}
                     suppliers={supplierData?.suppliers?.map(supplier => ({
                        id: supplier.id,
                        title: supplier.name,
                        description: `${supplier.contactPerson?.firstName} ${supplier.contactPerson?.lastName} (${supplier.contactPerson?.countryCode} ${supplier.contactPerson?.phoneNumber})`,
                     }))}
                     rawSuppliers={supplierData.suppliers}
                  />
               </Tunnel>
            </Tunnels>

            <StyledWrapper>
               <ButtonTile
                  type="primary"
                  size="lg"
                  text="Select Supplier"
                  onClick={() => openTunnel(1)}
                  style={{ margin: '20px 0' }}
               />
            </StyledWrapper>
         </SachetPackagingContext.Provider>
      </>
   )
}
