import React from 'react'
import { useTranslation } from 'react-i18next'

import { StyledGrid } from '../Item/styled'

import { ItemIcon, CaseIcon, TruckIcon, ClockIcon } from '../../../assets/icons'

const address = 'apps.inventory.views.forms.item.'

export default function InfoBar({ open, state }) {
   const { t } = useTranslation()
   return (
      <StyledGrid onClick={() => open(2)}>
         <div>
            <div>
               <ItemIcon />
            </div>
            <div>
               <span>{t(address.concat('unit qty'))}</span>
               <div>
                  <span>{state.unitQuantity}</span>
                  <span>${state.unitPrice}</span>
               </div>
            </div>
         </div>
         <div>
            <div>
               <CaseIcon />
            </div>
            <div>
               <span>{t(address.concat('case qty'))}</span>
               <div>
                  <span>{state.caseQuantity}</span>
                  <span>${+state.unitPrice * +state.caseQuantity}</span>
               </div>
            </div>
         </div>
         <div>
            <div>
               <TruckIcon />
            </div>
            <div>
               <span>{t(address.concat('min order value'))}</span>
               <div>
                  <span>{state.minOrderValue}</span>
                  <span>${+state.unitPrice * +state.minOrderValue}</span>
               </div>
            </div>
         </div>
         <div>
            <div>
               <ClockIcon />
            </div>
            <div>
               <span>{t(address.concat('lead time'))}</span>
               <div>
                  <span>{state.leadTime?.value + state.leadTime?.unit}</span>
               </div>
            </div>
         </div>
      </StyledGrid>
   )
}
