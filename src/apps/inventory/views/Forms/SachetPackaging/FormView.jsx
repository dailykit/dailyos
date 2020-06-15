import React from 'react'
import { TextButton, IconButton } from '@dailykit/ui'

import { StyledHeader, StyledInfo, StyledSupplier } from '../Item/styled'
import InfoBar from './InfoBar'
import PackagingStats from './PackagingStatus'
import EditIcon from '../../../../../shared/assets/icons/Edit'

export default function FormView({ state, open }) {
   return (
      <>
         <StyledHeader>
            {state.name && (
               <>
                  <StyledInfo>
                     <h1>{state.name}</h1>
                     <span> {state.sku} </span>
                  </StyledInfo>
                  <SupplierInfo state={state} open={open} />
               </>
            )}
         </StyledHeader>

         <InfoBar open={open} state={state} />
         <br />

         <PackagingStats state={state} open={open} />
      </>
   )
}

function SupplierInfo({ state, open }) {
   if (state.supplier && state.supplier.name)
      return (
         <StyledSupplier>
            <span>{state.supplier.name}</span>
            <span>
               {(state.supplier.contactPerson?.phoneNumber &&
                  state.supplier.contactPerson?.firstName &&
                  state.supplier.contactPerson?.lastName &&
                  `${state.supplier.contactPerson.firstName} ${state.supplier.contactPerson.lastName} (${state.supplier.contactPerson.phoneNumber})`) ||
                  ''}
            </span>
            <IconButton type="outline" onClick={() => open(1)}>
               <EditIcon />
            </IconButton>
         </StyledSupplier>
      )

   return (
      <TextButton onClick={() => open(1)} type="outline">
         Select Supplier
      </TextButton>
   )
}
