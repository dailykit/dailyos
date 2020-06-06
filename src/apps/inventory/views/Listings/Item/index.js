import { useSubscription, useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import {
   IconButton,
   Loader,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Toggle,
   Text,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { AddIcon } from '../../../assets/icons'
import { Context } from '../../../context/tabs'
import {
   SUPPLIER_ITEMS_SUBSCRIPTION,
   UPDATE_BULK_ITEM_AVAILABILITY,
   CREATE_ITEM,
} from '../../../graphql'
import {
   StyledContent,
   StyledTableActions,
   StyledTableHeader,
   StyledWrapper,
   CellColumnContainer,
   OnHandData,
} from '../styled'

import EditIcon from '../../../../recipe/assets/icons/Edit'
import { randomSuffix } from '../../../../../shared/utils/index'

const address = 'apps.inventory.views.listings.item.'

export default function ItemListing() {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view, id) => {
      dispatch({
         type: 'ADD_TAB',
         payload: { type: 'forms', title, view, id },
      })
   }

   const { loading: itemsLoading, data, error: subError } = useSubscription(
      SUPPLIER_ITEMS_SUBSCRIPTION
   )
   const [updateBulkItem] = useMutation(UPDATE_BULK_ITEM_AVAILABILITY, {
      onCompleted: () => {
         toast.info('Updated Successfully !')
      },
      onError: () => toast.error('Something went wrong, try again'),
   })

   const [createItem, { loading: creatItemLoading }] = useMutation(
      CREATE_ITEM,
      {
         onCompleted: input => {
            const itemData = input.createSupplierItem.returning[0]
            addTab(itemData.name, 'items', itemData.id)
            toast.success('Supplier Item Added!')
         },
         onError: error => {
            console.log(error)
            toast.error('Something went wrong, try again')
         },
      }
   )

   const createItemHandler = () => {
      // create item in DB
      const name = `item-${randomSuffix()}`
      createItem({
         variables: {
            object: {
               name,
            },
         },
      })
   }

   if (itemsLoading || creatItemLoading) return <Loader />

   if (subError) return <p>{subError.message}</p>

   if (data)
      return (
         <StyledWrapper>
            <StyledTableHeader style={{ marginTop: '30px' }}>
               <div />
               <StyledTableActions>
                  <IconButton type="solid" onClick={createItemHandler}>
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
                        <TableCell>Par Level</TableCell>
                        <TableCell>On Hand</TableCell>
                        <TableCell>Max Level</TableCell>
                        <TableCell>Awaiting</TableCell>
                        <TableCell>Committed</TableCell>
                        <TableCell>Availability</TableCell>
                        <TableCell />
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {data && data.supplierItems.length ? (
                        data.supplierItems.map(item => (
                           <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>
                                 {item.supplier?.name
                                    ? item.supplier.name
                                    : 'N/A'}
                              </TableCell>
                              <TableCell>
                                 <CellColumnContainer>
                                    {item.bulkItems?.map(processing => (
                                       <div style={{ padding: '5px' }}>
                                          {processing.processingName}
                                       </div>
                                    ))}
                                 </CellColumnContainer>
                              </TableCell>
                              <TableCell>
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
                                       </div>
                                    </CellColumnContainer>
                                 ))}
                              </TableCell>
                              <TableCell>
                                 {item.bulkItems?.map(processing => (
                                    <CellColumnContainer>
                                       <div
                                          style={{
                                             padding: '5px 0',
                                             display: 'flex',
                                          }}
                                       >
                                          <OnHandData
                                             alertAndSuccess={
                                                processing.onHand >
                                                processing.parLevel
                                             }
                                          >
                                             {processing.onHand}
                                          </OnHandData>
                                       </div>
                                    </CellColumnContainer>
                                 ))}
                              </TableCell>
                              <TableCell>
                                 {item.bulkItems?.map(processing => (
                                    <CellColumnContainer>
                                       <div
                                          style={{
                                             padding: '5px 0',
                                             display: 'flex',
                                          }}
                                       >
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
                                          {processing.awaiting}{' '}
                                          {processing.unit}
                                       </div>
                                    ))}
                                 </CellColumnContainer>
                              </TableCell>
                              <TableCell>
                                 <CellColumnContainer>
                                    {item.bulkItems?.map(processing => (
                                       <div style={{ padding: '5px' }}>
                                          {processing.committed}{' '}
                                          {processing.unit}
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
                                             setChecked={() =>
                                                updateBulkItem({
                                                   variables: {
                                                      id: processing.id,
                                                      availability: !processing.isAvailable,
                                                   },
                                                })
                                             }
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

                                       addTab(item.name, 'items', item.id)
                                    }}
                                    type="outline"
                                 >
                                    <EditIcon />
                                 </IconButton>
                              </TableCell>
                           </TableRow>
                        ))
                     ) : (
                        <Text as="title">No Supplier Items</Text>
                     )}
                  </TableBody>
               </Table>
            </StyledContent>
         </StyledWrapper>
      )
}
