import { useSubscription, useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import {
   IconButton,
   Loader,
   SearchBox,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Toggle,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
   AddIcon,
   ChevronLeftIcon,
   ChevronRightIcon,
} from '../../../assets/icons'
import { Context } from '../../../context/tabs'
import {
   SUPPLIER_ITEMS_SUBSCRIPTION,
   UPDATE_BULK_ITEM_AVAILABILITY,
} from '../../../graphql'
import {
   StyledContent,
   StyledHeader,
   StyledPagination,
   StyledTableActions,
   StyledTableHeader,
   StyledWrapper,
   CellColumnContainer,
   OnHandData,
} from '../styled'

import EditIcon from '../../../../recipe/assets/icons/Edit'

const address = 'apps.inventory.views.listings.item.'

export default function ItemListing() {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const [search, setSearch] = React.useState('')
   const [loading, setLoading] = React.useState(false)

   const { loading: itemsLoading, data, error } = useSubscription(
      SUPPLIER_ITEMS_SUBSCRIPTION
   )
   const [updateBulkItem] = useMutation(UPDATE_BULK_ITEM_AVAILABILITY)

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   if (error) return <p>Errr! I messed Up :(</p>

   if (loading || itemsLoading) return <Loader />

   if (data)
      return (
         <StyledWrapper>
            <StyledTableHeader style={{ marginTop: '30px' }}>
               <div />
               <StyledTableActions>
                  <IconButton
                     type="solid"
                     onClick={() => {
                        dispatch({
                           type: 'SET_ITEM_ID',
                           payload: '',
                        })

                        addTab('Add Item', 'items')
                     }}
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
                        <TableCell>Processings</TableCell>
                        <TableCell align="center">On Hand</TableCell>
                        <TableCell>Awaiting</TableCell>
                        <TableCell>Committed</TableCell>
                        <TableCell>Availability</TableCell>
                        <TableCell />
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {data.supplierItems.reverse().map(item => (
                        <TableRow key={item.id}>
                           <TableCell>{item.name}</TableCell>
                           <TableCell>{item.supplier.name}</TableCell>
                           <TableCell>
                              <CellColumnContainer>
                                 {item.bulkItems?.map(processing => (
                                    <div style={{ padding: '5px' }}>
                                       {processing.processingName}
                                    </div>
                                 ))}
                              </CellColumnContainer>
                           </TableCell>
                           <TableCell style={{ width: '15%' }}>
                              {item.bulkItems?.map(processing => (
                                 <CellColumnContainer>
                                    <div
                                       style={{
                                          padding: '5px 0',
                                          display: 'flex',
                                       }}
                                    >
                                       <OnHandData
                                          alert={
                                             processing.onHand <
                                             processing.parLevel
                                          }
                                       >
                                          {processing.parLevel}
                                       </OnHandData>
                                       <span style={{ width: '10px' }} />

                                       <span
                                          style={{ color: '#888D9D' }}
                                       >{`{`}</span>
                                       <OnHandData
                                          style={{
                                             padding: '0 30px',
                                             textAlign: 'center',
                                          }}
                                          alertAndSuccess={
                                             processing.onHand >
                                             processing.parLevel
                                          }
                                       >
                                          {processing.onHand}
                                       </OnHandData>
                                       <span
                                          style={{ color: '#888D9D' }}
                                       >{`}`}</span>

                                       <span style={{ width: '10px' }} />
                                       <OnHandData>
                                          {processing.maxLevel}
                                       </OnHandData>
                                    </div>
                                 </CellColumnContainer>
                              ))}
                           </TableCell>
                           <TableCell>
                              <CellColumnContainer>
                                 {item.bulkItems?.map(processing => (
                                    <div style={{ padding: '5px' }}>
                                       {processing.awaiting} {processing.unit}
                                    </div>
                                 ))}
                              </CellColumnContainer>
                           </TableCell>
                           <TableCell>
                              <CellColumnContainer>
                                 {item.bulkItems?.map(processing => (
                                    <div style={{ padding: '5px' }}>
                                       {processing.committed} {processing.unit}
                                    </div>
                                 ))}
                              </CellColumnContainer>
                           </TableCell>
                           <TableCell>
                              <CellColumnContainer>
                                 {item.bulkItems?.map(processing => (
                                    <div style={{ padding: '5px' }}>
                                       <Toggle
                                          checked={processing.isAvailable}
                                          setChecked={async () => {
                                             setLoading(true)
                                             const resp = await updateBulkItem({
                                                variables: {
                                                   id: processing.id,
                                                   availability: !processing.isAvailable,
                                                },
                                             })

                                             if (resp?.data?.updateBulkItem) {
                                                setLoading(false)
                                                toast.info(
                                                   'Updated Successfully !'
                                                )
                                             }
                                          }}
                                       />
                                    </div>
                                 ))}
                              </CellColumnContainer>
                           </TableCell>
                           <TableCell>
                              <IconButton
                                 onClick={() => {
                                    dispatch({
                                       type: 'SET_ITEM_ID',
                                       payload: item.id,
                                    })

                                    addTab('Edit Item', 'items')
                                 }}
                                 type="outline"
                              >
                                 <EditIcon />
                              </IconButton>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </StyledContent>
         </StyledWrapper>
      )
}
