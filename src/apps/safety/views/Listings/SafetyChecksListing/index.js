import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
// Components
import {
   IconButton,
   Loader,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
} from '@dailykit/ui'
import * as moment from 'moment'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

// Icons
import { AddIcon, DeleteIcon } from '../../../assets/icons'
// State
import { Context } from '../../../context/tabs'
import {
   CREATE_SAFETY_CHECK,
   SAFETY_CHECKS,
   DELETE_SAFETY_CHECK,
} from '../../../graphql'
// Styled
import { StyledHeader, StyledWrapper } from '../styled'
const address = 'apps.safety.views.listings.safetycheckslisting.'
const SafetyChecksListing = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view, id) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view, id } })
   }

   // Queries
   const { data, loading } = useSubscription(SAFETY_CHECKS, {
      onError: error => {
         console.log(error)
      },
   })

   // Mutation
   const [createSafetyCheck] = useMutation(CREATE_SAFETY_CHECK, {
      onCompleted: data => {
         addTab(
            'Check',
            'check',
            data.insert_safety_safetyCheck.returning[0].id
         )
         toast.success('Initiated!')
      },
      onError: error => {
         console.log(error)
         toast.error('Some error occurred!')
      },
   })
   const [deleteSafetyCheck] = useMutation(DELETE_SAFETY_CHECK, {
      onCompleted: () => {
         toast.success('Safety check deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   if (loading) return <Loader />

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>{t(address.concat('safety checks'))}</h1>
            <IconButton type="solid" onClick={createSafetyCheck}>
               <AddIcon color="#fff" size={24} />
            </IconButton>
         </StyledHeader>
         <Table>
            <TableHead>
               <TableRow>
                  <TableCell>{t(address.concat('time'))}</TableCell>
                  <TableCell>{t(address.concat('users tested'))}</TableCell>
                  <TableCell></TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {data?.safety_safetyCheck.map(row => (
                  <TableRow
                     key={row.id}
                     onClick={() => {
                        addTab('Check', 'check', row.id)
                     }}
                  >
                     <TableCell>
                        {moment(row.created_at).format('LLL')}
                     </TableCell>
                     <TableCell>
                        {row.SafetyCheckPerUsers?.length || 0}
                     </TableCell>
                     <TableCell align="right">
                        <IconButton>
                           <span
                              onClick={e => {
                                 e.stopPropagation()
                                 deleteSafetyCheck({
                                    variables: {
                                       id: row.id,
                                    },
                                 })
                              }}
                           >
                              <DeleteIcon color="#FF5A52" />
                           </span>
                        </IconButton>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </StyledWrapper>
   )
}

export default SafetyChecksListing
