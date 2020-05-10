import React from 'react'
import { useQuery, useSubscription, useMutation } from '@apollo/react-hooks'
import { RRule } from 'rrule'

import { COLLECTIONS, CREATE_COLLECTION } from '../../../graphql'

// State
import { Context } from '../../../context/tabs'

// Components
import {
   ButtonGroup,
   IconButton,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   AvatarGroup,
   Avatar,
   TagGroup,
   Tag,
   Loader,
} from '@dailykit/ui'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

// Icons
import { EditIcon, DeleteIcon, AddIcon } from '../../../assets/icons'

import { useTranslation, Trans } from 'react-i18next'
import { randomSuffix } from '../../../../../shared/utils'
import { toast } from 'react-toastify'

const address = 'apps.online_store.views.listings.collectionslisting.'

const CollectionsListing = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view, id) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view, id } })
   }

   // Queries
   const { data, loading } = useSubscription(COLLECTIONS, {
      onError: error => {
         console.log(error)
      },
   })

   // Mutation
   const [createCollection] = useMutation(CREATE_COLLECTION, {
      variables: {
         name: 'collection-' + randomSuffix(),
      },
      onCompleted: data => {
         addTab(
            data.createMenuCollection.returning[0].name,
            'collection',
            data.createMenuCollection.returning[0].id
         )
         toast.success('Collection created!')
      },
      onError: error => {
         console.log(error)
         toast.error('Some error occurred!')
      },
   })

   if (loading) return <Loader />

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>{t(address.concat('collections'))}</h1>
            <IconButton type="solid" onClick={createCollection}>
               <AddIcon color="#fff" size={24} />
            </IconButton>
         </StyledHeader>
         <Table>
            <TableHead>
               <TableRow>
                  <TableCell>{t(address.concat('collection name'))}</TableCell>
                  <TableCell>{t(address.concat('categories'))}</TableCell>
                  <TableCell>{t(address.concat('availability'))}</TableCell>
                  <TableCell></TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {data?.menuCollections.map((row, index) => (
                  <TableRow
                     key={row.id}
                     onClick={() => {
                        addTab(row.name, 'collection', row.id)
                     }}
                  >
                     <TableCell>{row.name}</TableCell>
                     <TableCell>{row.categories?.length || 0}</TableCell>
                     <TableCell>
                        {RRule.fromString(
                           row.availability?.rule || ''
                        ).toText()}
                     </TableCell>
                     <TableCell align="right">
                        <IconButton>
                           <DeleteIcon color="#FF5A52" />
                        </IconButton>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </StyledWrapper>
   )
}

export default CollectionsListing
