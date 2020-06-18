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
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { RRule } from 'rrule'
import { randomSuffix } from '../../../../../shared/utils'
// Icons
import { AddIcon, DeleteIcon } from '../../../assets/icons'
// State
import { Context } from '../../../context/tabs'
import {
   COLLECTIONS,
   CREATE_COLLECTION,
   DELETE_COLLECTIONS,
} from '../../../graphql'
// Styled
import { StyledHeader, StyledWrapper } from '../styled'

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
         availability: {
            rule:
               'RRULE:FREQ=WEEKLY;INTERVAL=1;WKST=MO;BYDAY=TH,WE,TU,SU,SA,MO,FR',
            time: {
               end: '23:59',
               start: '00:00',
            },
         },
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

   const [deleteCollections] = useMutation(DELETE_COLLECTIONS, {
      onCompleted: () => {
         toast.success('Collection deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Could not delete!')
      },
   })

   // Handler
   const deleteHandler = (e, collection) => {
      e.stopPropagation()
      if (
         window.confirm(
            `Are you sure you want to delete collection - ${collection.name}?`
         )
      ) {
         deleteCollections({
            variables: {
               ids: [collection.id],
            },
         })
      }
   }

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
                        <IconButton onClick={e => deleteHandler(e, row)}>
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
