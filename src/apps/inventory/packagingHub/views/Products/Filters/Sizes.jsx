import React from 'react'
import { SearchBox, Loader } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import styled from 'styled-components'

import {
   PACKAGE_HEIGHT_FILTER_OPTIONS,
   PACKAGE_WIDTH_FILTER_OPTIONS,
} from '../../../graphql'

import { Section, SectionHeader } from './styled'

export default function Sizes() {
   const {
      loading: heightsLoading,
      data: {
         packagingHub_packaging_aggregate: { nodes: heightOptions = [] } = {},
      } = {},
   } = useQuery(PACKAGE_HEIGHT_FILTER_OPTIONS, {
      onError: error => {
         toast.error(error.message)
      },
   })

   const {
      loading: widthOptionsLoading,
      data: {
         packagingHub_packaging_aggregate: { nodes: widthOptions = [] } = {},
      } = {},
   } = useQuery(PACKAGE_WIDTH_FILTER_OPTIONS, {
      onError: error => {
         toast.error(error.message)
      },
   })

   const handleHeightSelect = e => {
      console.log(e.target.value)
   }

   const handleWidthSelect = e => {
      console.log(e.target.value)
   }

   if (heightsLoading || widthOptionsLoading) return <Loader />

   return (
      <Section>
         <SectionHeader>
            <p>Sizes</p>
         </SectionHeader>

         <SearchBox placeholder="Search" value={''} onChange={() => {}} />

         <h5 style={{ marginTop: '1rem' }}>Height</h5>
         <StyledSelect onChange={handleHeightSelect}>
            {heightOptions.map(option => (
               <option key={option.id} value={option.height}>
                  {option.height} {option.LWHUnit}
               </option>
            ))}
         </StyledSelect>

         <h5 style={{ marginTop: '1rem' }}>Width</h5>
         <StyledSelect onChange={handleWidthSelect}>
            {widthOptions.map(option => (
               <option key={option.id} value={option.width}>
                  {option.width} {option.LWHUnit}
               </option>
            ))}
         </StyledSelect>
      </Section>
   )
}

const StyledSelect = styled.select`
   border: none;
   font-weight: 500;
   font-size: 14px;
   line-height: 16px;
   color: #555b6e;
   outline: none;

   width: 100%;
   padding: 10px;
   background-color: #fff;
   margin-top: 12px;
`
