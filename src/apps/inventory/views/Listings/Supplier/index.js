import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'

// Components
import {
   IconButton,
   Table,
   TableRow,
   TableHead,
   TableBody,
   TableCell,
   Loader,
   Toggle,
} from '@dailykit/ui'

import { Context } from '../../../context/tabs'
import { SUPPLIERS, DELETE_SUPPLIER } from '../../../graphql'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

// Icons
import { AddIcon } from '../../../assets/icons'
import EditIcon from '../../../../recipe/assets/icons/Edit'
import DeleteIcon from '../../../../../shared/assets/icons/Delete'

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.views.listings.supplier.'

export default function SupplierListing() {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const { loading, error, data, refetch } = useQuery(SUPPLIERS)

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   const [deleteSupplier] = useMutation(DELETE_SUPPLIER)

   const handleSupplierDelete = async id => {
      const res = await deleteSupplier({ variables: { id } })
      const {
         data: {
            deleteSupplier: { affected_rows: deleteCount },
         },
      } = res

      if (deleteCount) {
         await refetch()
      }
   }

   const handleSupplierEdit = id => {
      dispatch({ type: 'ADD_SUPPLIER_ID', payload: id })
      addTab('Add Supplier', 'suppliers')
   }

   return (
      <>
         <StyledWrapper>
            <StyledHeader>
               <h1>{t(address.concat('suppliers'))}</h1>
               <IconButton
                  type="solid"
                  onClick={() => addTab('Add Supplier', 'suppliers')}
               >
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledHeader>

            <div style={{ margin: '0 auto', width: '80%' }}>
               {loading ? (
                  <Loader />
               ) : (
                     <Table>
                        <TableHead>
                           <TableRow>
                              <TableCell>{t(address.concat('name'))}</TableCell>
                              <TableCell>{t(address.concat('person of contact'))}</TableCell>
                              <TableCell>{t(address.concat('active'))}</TableCell>
                              <TableCell align="right" />
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {data.suppliers.map(supplier => (
                              <TableRow key={supplier?.id}>
                                 <TableCell>{supplier?.name}</TableCell>
                                 <TableCell>{`${supplier?.contactPerson?.firstName} ${supplier?.contactPerson?.lastName} (${supplier?.contactPerson?.countryCode} ${supplier?.contactPerson?.phoneNumber})`}</TableCell>
                                 <TableCell>
                                    <ShowAvailability supplier={supplier} />
                                 </TableCell>
                                 <TableCell align="right">
                                    <div style={{ display: 'flex' }}>
                                       <IconButton
                                          onClick={() =>
                                             handleSupplierEdit(supplier?.id)
                                          }
                                          type="outline"
                                       >
                                          <EditIcon />
                                       </IconButton>
                                       <span style={{ width: '5px' }} />
                                       <IconButton
                                          onClick={() =>
                                             handleSupplierDelete(supplier?.id)
                                          }
                                          type="ghost"
                                       >
                                          <DeleteIcon />
                                       </IconButton>
                                    </div>
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  )}
            </div>
         </StyledWrapper>
      </>
   )
}

function ShowAvailability({ supplier }) {
   const [available, setAvailable] = useState(supplier?.available || false)

   return <Toggle checked={available} setChecked={setAvailable} />
}
