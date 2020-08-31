import React from 'react'
import { useTranslation } from 'react-i18next'
import { TextButton } from '@dailykit/ui'
import styled from 'styled-components'

import { StyledGrid } from '../Item/styled'

import { ItemIcon, CaseIcon, TruckIcon, ClockIcon } from '../../../assets/icons'

const address = 'apps.inventory.views.forms.item.'

export default function InfoBar({ open, state }) {
   const { t } = useTranslation()

   if (
      !state.unitQuantity &&
      !state.unitPrice &&
      !state.caseQuantity &&
      !state.minOrderValue &&
      !state.leadTime?.value &&
      !state.leadTime?.unit
   )
      return (
         <EmptyWrapper>
            <TextButton onClick={() => open(1)} type="outline">
               Add Information
            </TextButton>
         </EmptyWrapper>
      )

   return (
      <StyledGrid onClick={() => open(1)}>
         <div>
            <div>
               <ItemIcon />
            </div>
            <div>
               <span>{t(address.concat('unit qty'))}</span>
               <div>
                  <span>{state.unitQuantity || 'N/A'}</span>
                  {state.unitPrice ? <span>${state.unitPrice}</span> : null}
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
                  <span>{state.caseQuantity || 'N/A'}</span>
                  {state.unitPrice && state.caseQuantity ? (
                     <span>${+state.unitPrice * +state.caseQuantity}</span>
                  ) : null}
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
                  {state.unitPrice && state.minOrderValue ? (
                     <span>${+state.unitPrice * +state.minOrderValue}</span>
                  ) : null}
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
                  <span>{`${state.leadTime?.value || 'N/A'}  ${
                     state.leadTime?.value ? state.leadTime?.unit : ''
                  }`}</span>
               </div>
            </div>
         </div>
      </StyledGrid>
   )
}

const EmptyWrapper = styled.div`
   width: 100%;
   padding: 30px;
   text-align: center;
   border-bottom: 1px solid #dddddd;
   border-top: 1px solid #dddddd;
`
