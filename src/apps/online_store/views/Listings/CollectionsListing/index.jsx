import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { RRule } from 'rrule'

import { COLLECTIONS } from '../../../graphql'

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
} from '@dailykit/ui'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

// Icons
import { EditIcon, DeleteIcon, AddIcon } from '../../../assets/icons'

import { useTranslation } from 'react-i18next'

const address = 'apps.online_store.views.listings.collectionslisting.'

const CollectionsListing = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   // Queries
   const { data, loading, error } = useQuery(COLLECTIONS)

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>Collections</h1>
            <IconButton
               type="solid"
               onClick={() => addTab('Collection Form', 'collection')}
            >
               <AddIcon color="#fff" size={24} />
            </IconButton>
         </StyledHeader>
         <Table>
            <TableHead>
               <TableRow>
                  <TableCell>{t(address.concat('collection name'))}</TableCell>
                  <TableCell>{t(address.concat('categories'))}</TableCell>
                  <TableCell>{t(address.concat('products'))}</TableCell>
                  {/* <TableCell align="right">{t(address.concat('actions'))}</TableCell> */}
               </TableRow>
            </TableHead>
            <TableBody>
               {data?.menuCollections.map((row, index) => (
                  <TableRow key={row.id}>
                     <TableCell>{row.name}</TableCell>
                     <TableCell>{row.categories.length}</TableCell>
                     <TableCell>
                        {RRule.fromString(row.availability.rule).toText()}
                     </TableCell>
                     {/* <TableCell align="right">
                        <ButtonGroup align="right">
                           <IconButton type="outline">
                              <EditIcon />
                           </IconButton>
                           <IconButton type="outline">
                              <DeleteIcon />
                           </IconButton>
                        </ButtonGroup>
                     </TableCell> */}
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </StyledWrapper>
   )
}

export default CollectionsListing
