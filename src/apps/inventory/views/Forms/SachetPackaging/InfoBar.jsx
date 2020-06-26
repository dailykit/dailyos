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
      !state.unitPrice &&
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
                  <span>{`${state.leadTime?.value}  ${state.leadTime?.unit}`}</span>
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
