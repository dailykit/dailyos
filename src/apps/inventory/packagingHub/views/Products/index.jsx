import React, { useContext } from 'react'
import { Loader } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'

import { Context } from '../../../context/tabs'
import FiltersProvider from '../../context/filters'

import { Category } from '../../graphql'
import { Badge, Packagings, CartButton } from '../../components'
import { FlexContainer } from '../../../views/Forms/styled'

import Filters from './Filters'

export default function PackagingHubProducts() {
   const {
      state: {
         current: { id },
      },
   } = useContext(Context)

   const { data, loading, error } = useQuery(Category, {
      variables: { id },
   })

   if (error) return <p>{error.message}</p>
   if (loading) return <Loader />

   const { packagingHub_packagingType_by_pk: category = {} } = data

   return (
      <>
         <CartButton />
         <Wrapper>
            <Header>
               <h2>{category.name}</h2>
               <Badge />
            </Header>
            <FlexContainer>
               <FiltersProvider>
                  <Filters />
                  <Packagings />
               </FiltersProvider>
            </FlexContainer>
         </Wrapper>
      </>
   )
}

const Wrapper = styled.div`
   height: 100%;
   width: 100%;
   padding: 2rem;
   padding-left: 0;
`

const Header = styled.div`
   padding-bottom: 2rem;
   padding-left: 2rem;
   display: flex;
   justify-content: space-between;
   align-items: center;

   h2 {
      font-weight: 500;
      font-size: 28px;
      line-height: 27px;

      color: #555b6e;
   }
`
