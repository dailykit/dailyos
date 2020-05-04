import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import {
   SearchBox,
   IconButton,
   Loader,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { SUPPLIER_ITEMS } from '../../../graphql'

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

const address = 'apps.inventory.views.listings.item.'

export default function ItemListing() {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const [search, setSearch] = React.useState('')

   const { loading, data, error } = useSubscription(SUPPLIER_ITEMS)

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   if (error) return <p>Error! I messed Up :(</p>

   if (loading) return <Loader />

   if (data)
      return (
         <StyledWrapper>
            <StyledHeader>
               <h1>{t(address.concat('supplier items'))}</h1>
               <StyledPagination>
                  {29}
                  <span disabled>
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
                     placeholder={t(address.concat('search'))}
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
            <StyledContent style={{ width: '90%', margin: '20px auto' }}>
               <Table>
                  <TableHead>
                     <TableRow>
                        <TableCell>Supplier Item</TableCell>
                        <TableCell>Supplier</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {data.supplierItems.reverse().map(item => (
                        <TableRow key={item.id}>
                           <TableCell>{item.name}</TableCell>
                           <TableCell>
                              {item.supplier.name} (
                              {item.supplier.contactPerson?.email})
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </StyledContent>
         </StyledWrapper>
      )
}
