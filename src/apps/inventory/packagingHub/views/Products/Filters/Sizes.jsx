import React, { useContext, useState } from 'react'
import { Loader, TextButton } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import styled from 'styled-components'

import { Context } from '../../../../context/tabs'
import { useFilters } from '../../../context/filters'

import {
   PACKAGE_HEIGHT_FILTER_OPTIONS,
   PACKAGE_WIDTH_FILTER_OPTIONS,
} from '../../../graphql'

import { Section, SectionHeader } from './styled'

const style = {
   marginTop: '1rem',
}

export default function Sizes() {
   const { dispatch } = useFilters()

   const [selectedOption, setSelectedOption] = useState({
      height: null,
      width: null,
   })

   const handleHeightSelect = e => {
      const selectedOption = e.target.value

      setSelectedOption(option => ({ ...option, height: selectedOption }))
   }

   const handleWidthSelect = e => {
      const selectedOption = e.target.value

      setSelectedOption(option => ({ ...option, width: selectedOption }))
   }

   const applyFilters = () => {
      dispatch({
         type: 'SELECT_OPTION',
         payload: {
            value: selectedOption,
         },
      })
   }

   return (
      <Section>
         <SectionHeader>
            <p>Sizes</p>
         </SectionHeader>

         <HeightOptions handleHeightSelect={handleHeightSelect} />
         <WidthOptions handleWidthSelect={handleWidthSelect} />

         {selectedOption.height || selectedOption.width ? (
            <TextButton style={style} onClick={applyFilters} type="outline">
               Apply
            </TextButton>
         ) : null}
      </Section>
   )
}

function HeightOptions({ handleHeightSelect }) {
   const {
      state: {
         current: { id: categoryId },
      },
   } = useContext(Context)

   const {
      loading: heightsLoading,
      data: {
         packagingHub_packaging_aggregate: { nodes: heightOptions = [] } = {},
      } = {},
   } = useQuery(PACKAGE_HEIGHT_FILTER_OPTIONS, {
      onError: error => {
         toast.error(error.message)
      },
      variables: { categoryId },
   })

   if (heightsLoading) return <Loader />

   return (
      <>
         <h5 style={style}>Height</h5>
         <StyledSelect onChange={handleHeightSelect}>
            <option value="">Choose height...</option>

            {heightOptions.map(option => (
               <option key={option.id} value={option.height}>
                  {option.height} {option.LWHUnit}
               </option>
            ))}
         </StyledSelect>
      </>
   )
}

function WidthOptions({ handleWidthSelect }) {
   const {
      state: {
         current: { id: categoryId },
      },
   } = useContext(Context)

   const {
      loading: widthOptionsLoading,
      data: {
         packagingHub_packaging_aggregate: { nodes: widthOptions = [] } = {},
      } = {},
   } = useQuery(PACKAGE_WIDTH_FILTER_OPTIONS, {
      onError: error => {
         toast.error(error.message)
      },
      variables: { categoryId },
   })

   if (widthOptionsLoading) return <Loader />

   return (
      <>
         <h5 style={style}>Width</h5>
         <StyledSelect onChange={handleWidthSelect}>
            <option value="">Choose width...</option>
            {widthOptions.map(option => (
               <option key={option.id} value={option.width}>
                  {option.width} {option.LWHUnit}
               </option>
            ))}
         </StyledSelect>
      </>
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
