import React from 'react'

import { SearchBox, IconButton } from '@dailykit/ui'

import {
   StyledWrapper,
   StyledTableHeader,
   StyledTableActions,
   StyledHeader,
   StyledContent,
   StyledPagination,
} from '../styled'

import {
   AddIcon,
   ChevronLeftIcon,
   ChevronRightIcon,
} from '../../../assets/icons'

import { Context } from '../../../context/tabs'

export default function ItemListing() {
   const { dispatch } = React.useContext(Context)
   const [search, setSearch] = React.useState('')

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>Supplier Items</h1>
            <StyledPagination>
               {29}
               <span disabled={true}>
                  <ChevronLeftIcon />
               </span>
               <span>
                  <ChevronRightIcon />
               </span>
            </StyledPagination>
         </StyledHeader>
         <StyledTableHeader>
            <p>filters</p>
            <StyledTableActions>
               <SearchBox
                  placeholder="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
               />
               <IconButton
                  type="solid"
                  onClick={() => addTab('Add Item', 'items')}
               >
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledTableActions>
         </StyledTableHeader>
         <StyledContent></StyledContent>
      </StyledWrapper>
   )
}
