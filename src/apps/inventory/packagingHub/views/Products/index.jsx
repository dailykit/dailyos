import React, { useContext } from 'react'
import { Loader } from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'

import { Context } from '../../../context/tabs'
import { PACKAGINGS } from '../../graphql'

export default function PackagingHubProducts() {
   const {
      state: {
         current: { id },
      },
   } = useContext(Context)

   const { data, loading, error } = useQuery(PACKAGINGS, { variables: id })

   if (error) return <p>{error.message}</p>
   if (loading) return <Loader />

   const { packagingHub_packaging: packagings = [] } = data
   console.log(packagings)

   return (
      <div>
         <h1>Products View</h1>
      </div>
   )
}
