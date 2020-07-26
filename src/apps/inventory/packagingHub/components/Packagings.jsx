import React, { useContext } from 'react'
import { Loader } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'

import { Context } from '../../context/tabs'
import { useFilters } from '../context/filters'
import { PACKAGINGS } from '../graphql'

import ProductCard from './ProductCard'

export default function Packagings() {
   const {
      state: {
         current: { id },
      },
   } = useContext(Context)
   const { filters } = useFilters()

   const { data, loading, error } = useQuery(PACKAGINGS, {
      variables: { id, ...filters },
   })

   if (error) return <p>{error.message}</p>
   if (loading) return <Loader />

   const { packagingHub_packaging: packagings = [] } = data

   return (
      <Wrapper>
         {packagings.map(packaging => (
            <ProductCard key={packaging.id} product={packaging} />
         ))}
      </Wrapper>
   )
}

const Wrapper = styled.div`
   margin: 24px 0;
   flex: 4;

   display: grid;
   grid-gap: 2rem;

   justify-items: center;

   grid-template-columns: 1fr 1fr;
   grid-template-rows: auto;
`
