import React from 'react'

// Components
import { IconButton } from '@dailykit/ui'

import { Context } from '../../../context/tabs'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

// Icons
import { AddIcon } from '../../../assets/icons'

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.views.listings.purchaseorders.'

export default function PurchaseOrders() {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   return (
      <>
         <StyledWrapper>
            <StyledHeader>
               <h1>{t(address.concat('purchase orders'))}</h1>
               <IconButton
                  type="solid"
                  onClick={() => addTab('New Purchase Order', 'purchaseOrder')}
               >
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledHeader>
         </StyledWrapper>
      </>
   )
}
