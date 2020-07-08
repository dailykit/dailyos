import React from 'react'
import styled from 'styled-components'
import { Loader } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'

import { CATEGORIES } from '../graphql'

import Card from './Card'

export default function Categories() {
   const { data, error, loading } = useQuery(CATEGORIES)

   if (error)
      return (
         <Wrapper>
            <p>{error.message}</p>
         </Wrapper>
      )

   if (loading) return <Loader />

   const { packagingHub_packagingCompanyBrand: categories } = data

   return (
      <Wrapper>
         <h2>Categories</h2>

         {categories.map(category => {
            return <Card key={category.id} category={category} />
         })}
      </Wrapper>
   )
}

const Wrapper = styled.div`
   margin: 36px 0px 24px 3rem;
   position: relative;

   h2 {
      font-weight: 500;
      font-size: 40px;
      line-height: 38px;
      color: #555b6e;
   }
`
