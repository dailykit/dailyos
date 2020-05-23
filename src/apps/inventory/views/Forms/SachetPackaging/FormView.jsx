import React from 'react'

import { StyledHeader, StyledInfo, StyledSupplier } from '../Item/styled'
import InfoBar from './InfoBar'
import PackagingStats from './PackagingStatus'

export default function FormView({ state, open }) {
   return (
      <>
         <StyledHeader>
            {state.name && (
               <>
                  <StyledInfo>
                     <h1>{state.title || state.name}</h1>
                     <span> {state.sku} </span>
                  </StyledInfo>
                  <StyledSupplier>
                     <span>{state.supplier?.name}</span>
                     <span>
                        {`${state.supplier.contactPerson.firstName} ${state.supplier.contactPerson.lastName} (${state.supplier.contactPerson?.countryCode} ${state.supplier.contactPerson?.phoneNumber})` ||
                           ''}
                     </span>
                  </StyledSupplier>
               </>
            )}
         </StyledHeader>

         <InfoBar open={open} state={state} />
         <br />

         <PackagingStats state={state} />
      </>
   )
}
