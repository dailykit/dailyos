import { useSubscription } from '@apollo/react-hooks'
import { Loader } from '@dailykit/ui'
import React from 'react'
import { useParams } from 'react-router-dom'
import { PACKAGING_SUBSCRIPTION } from '../../../graphql'
import { StyledWrapper } from '../styled'
import FormView from './FormView'
import { logger } from '../../../../../shared/utils'

export default function SachetPackaging() {
   const { id } = useParams()

   const { error, loading, data: { packaging = {} } = {} } = useSubscription(
      PACKAGING_SUBSCRIPTION,
      {
         variables: { id },
      }
   )

   if (loading) return <Loader />

   if (error) {
      logger(error)
      throw error
   }

   return (
      <>
         <StyledWrapper>
            <FormView state={packaging} />
         </StyledWrapper>
      </>
   )
}
