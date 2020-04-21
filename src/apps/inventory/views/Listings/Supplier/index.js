import React from 'react'

// Components
import { IconButton } from '@dailykit/ui'

import { Context } from '../../../context/tabs'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

// Icons
import { AddIcon } from '../../../assets/icons'

export default function SupplierListing() {
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   return (
      <>
         <StyledWrapper>
            <StyledHeader>
               <h1>Suppliers</h1>
               <IconButton
                  type="solid"
                  onClick={() => addTab('Add Supplier', 'suppliers')}
               >
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledHeader>
         </StyledWrapper>
      </>
   )
}
