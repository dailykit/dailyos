import React from 'react'
import { useQuery } from '@apollo/react-hooks'

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

const CollectionsListing = () => {
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   // Queries
   const { data, loading, error } = useQuery(COLLECTIONS)

   console.log(data)

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
                  <TableCell>Collection Name</TableCell>
                  <TableCell>Categories</TableCell>
                  <TableCell>Products</TableCell>
                  <TableCell align="right">Actions</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {data?.menucollections.map((row, index) => (
                  <TableRow key={row.id}>
                     <TableCell>{row.title}</TableCell>
                     <TableCell>{row.categories.length}</TableCell>
                     <TableCell></TableCell>
                     <TableCell align="right">
                        <ButtonGroup align="right">
                           <IconButton type="outline">
                              <EditIcon />
                           </IconButton>
                           <IconButton type="outline">
                              <DeleteIcon />
                           </IconButton>
                        </ButtonGroup>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </StyledWrapper>
   )
}

export default CollectionsListing
