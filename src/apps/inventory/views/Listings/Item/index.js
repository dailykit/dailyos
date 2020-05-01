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

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.views.listings.item.'

export default function ItemListing() {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const [search, setSearch] = React.useState('')

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>{t(address.concat('supplier items'))}</h1>
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
            <p>{t(address.concat('filters'))}</p>
            <StyledTableActions>
               <SearchBox
                  placeholder={t(address.concat("search"))}
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
