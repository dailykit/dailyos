import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Loader } from '@dailykit/ui'
import styled from 'styled-components'

import { Badge } from '../../components'
import { Context } from '../../../context/tabs'

import { PACKAGING } from '../../graphql'

export default function ProductDetailsPage() {
   const {
      state: {
         current: { id },
      },
   } = useContext(Context)

   const { data, loading, error } = useQuery(PACKAGING, { variables: { id } })

   if (error)
      return (
         <Wrapper>
            <Header>
               <div />
               <Badge />
            </Header>

            <p>{error.message}</p>
         </Wrapper>
      )

   if (loading) return <Loader />

   const { packagingHub_packaging_by_pk: packaging } = data

   return (
      <Wrapper>
         <Header>
            <div />
            <Badge />
         </Header>

         <Main>
            {/* carousel and description */}
            <div>
               <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptate quos voluptatem praesentium doloremque laborum illum
                  sed accusantium vitae labore quae minima quia tenetur minus,
                  velit architecto? Ab nobis quisquam aliquid?
               </p>
            </div>

            {/* specs and cta button */}
            <div>
               <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptate quos voluptatem praesentium doloremque laborum illum
                  sed accusantium vitae labore quae minima quia tenetur minus,
                  velit architecto? Ab nobis quisquam aliquid?
               </p>
            </div>
         </Main>
      </Wrapper>
   )
}

const Header = styled.div`
   padding-bottom: 2rem;
   display: flex;
   justify-content: space-between;
   align-items: center;
`

const Wrapper = styled.div`
   height: 100%;
   width: 100%;
   padding: 2rem;
`

const Main = styled.div`
   margin: 24px 0;

   display: grid;
   grid-gap: 2rem;
   grid-template-columns: 0.9fr 1.1fr;
   grid-template-rows: 1fr;
`
