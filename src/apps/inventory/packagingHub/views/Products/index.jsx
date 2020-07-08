import React, { useContext } from 'react'
import { Loader } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'

import { Context } from '../../../context/tabs'
import { Category } from '../../graphql'
import { Badge, Packagings } from '../../components'

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
      <Wrapper>
         <Header>
            <h2>{category.name}</h2>
            <Badge />
         </Header>

         <Packagings />
      </Wrapper>
   )
}

const Wrapper = styled.div`
   height: 100%;
   width: 100%;
   padding: 2rem;
`

const Header = styled.div`
   padding-bottom: 2rem;
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
