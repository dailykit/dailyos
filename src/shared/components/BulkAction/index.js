import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   Spacer,
   TunnelHeader,
   TextButton,
   Text,
   Flex,
   IconButton,
} from '@dailykit/ui'
import { toast } from 'react-toastify'

import { TunnelBody } from './styled'

import { RemoveIcon } from '../../../apps/products/assets/icons'
import ConfirmationPopup from './confirmationPopup'

import {
   SIMPLE_RECIPE_UPDATE,
   UPDATE_PRODUCTS,
   UPDATE_INGREDIENTS,
} from './mutation'

const BulkActions = ({
   children,
   table,
   selectedRows,
   removeSelectedRow,
   bulkActions,
   setBulkActions,
   clearAllActions,
   close,
}) => {
   const [showPopup, setShowPopup] = React.useState(false)
   const [popupHeading, setPopupHeading] = React.useState('')
   //mutation
   const [simpleRecipeUpdate] = useMutation(SIMPLE_RECIPE_UPDATE, {
      onCompleted: () => {
         toast.success('Update Successfully')
         close(1)
      },
      onError: error => {
         toast.error('Something went wrong!')
         //  logger(error)
      },
   })

   const [updateProducts] = useMutation(UPDATE_PRODUCTS, {
      onCompleted: () => {
         toast.success('Update Successfully')
         close(1)
      },
      onError: error => {
         toast.error('Something went wrong!')
         //  logger(error)
      },
   })

   const [updateIngredients] = useMutation(UPDATE_INGREDIENTS, {
      onCompleted: () => {
         toast.success('Update Successfully')
         close(1)
      },
      onError: error => {
         toast.error('Something went wrong!')
         //  logger(error)
      },
   })
   const getMutation = table => {
      switch (table) {
         case 'Recipe':
            return simpleRecipeUpdate
            break
         case 'Product':
            return updateProducts
            break
         case 'Ingredient':
            return updateIngredients
      }
   }
   const handleOnUpdate = () => {
      const fn = getMutation(table)
      if (fn) {
         fn({
            variables: {
               ids: selectedRows.map(idx => idx.id),
               _set: bulkActions,
            },
         })
      } else {
         toast.error('Incorrect schema or table name!')
      }
   }
   return (
      <>
         <TunnelHeader
            title="Apply Bulk Actions"
            close={() => close(1)}
            right={{
               title: 'Delete Selected Data',
               action: function () {
                  setShowPopup(true)
                  setPopupHeading(`Delete Selected ${table}`)
                  setBulkActions({ isArchived: true })
               },
            }}
         />
         <TunnelBody>
            <ConfirmationPopup
               bulkActions={bulkActions}
               setBulkActions={setBulkActions}
               showPopup={showPopup}
               setShowPopup={setShowPopup}
               popupHeading={popupHeading}
               selectedRows={selectedRows}
               handleOnUpdate={handleOnUpdate}
               table={table}
            />
            <Flex
               container
               as="header"
               width="100%"
               justifyContent="flex-start"
            >
               <Flex width="50%">
                  <Flex
                     container
                     as="header"
                     alignItems="center"
                     justifyContent="space-between"
                  >
                     <Text as="h3">{table}</Text>
                     <span
                        style={{
                           color: '#919699',
                           fontStyle: 'italic',
                           fontWeight: '500',
                           marginRight: '20px',
                        }}
                     >
                        {selectedRows.length}{' '}
                        {selectedRows.length > 1 ? table + 's' : table} selected{' '}
                     </span>
                  </Flex>
                  <div style={{ height: '400px', overflowY: 'auto' }}>
                     {selectedRows.map((item, id) => (
                        <div
                           as="title"
                           style={{
                              backgroundColor: `${
                                 id % 2 === 0 ? '#F4F4F4' : '#fff'
                              }`,
                              color: '#202020',
                           }}
                           key={id}
                        >
                           <Flex
                              container
                              as="header"
                              alignItems="center"
                              justifyContent="space-between"
                           >
                              {item.name}
                              <IconButton
                                 type="ghost"
                                 onClick={() => {
                                    removeSelectedRow(item.id)
                                 }}
                              >
                                 <RemoveIcon color="#FF5A52" />
                              </IconButton>
                           </Flex>
                        </div>
                     ))}
                  </div>
               </Flex>
               <Flex width="50%" padding="0px 0px 20px 20px">
                  <Flex
                     container
                     justifyContent="space-between"
                     alignItems="center"
                  >
                     <Text as="h3">Bulk Actions</Text>
                     <TextButton
                        type="ghost"
                        size="sm"
                        onClick={() => {
                           clearAllActions()
                        }}
                     >
                        Clear All Actions
                     </TextButton>
                  </Flex>
                  <Spacer size="16px" />
                  {children}
                  <Spacer size="16px" />
                  <Flex container alignItems="center" justifyContent="flex-end">
                     <TextButton
                        type="solid"
                        size="md"
                        disabled={
                           selectedRows.length > 0 &&
                           Object.keys(bulkActions).length !== 0
                              ? false
                              : true
                        }
                        onClick={() => {
                           setShowPopup(true)
                           setPopupHeading('Save All Changes')
                        }}
                     >
                        Save Changes
                     </TextButton>
                  </Flex>
               </Flex>
            </Flex>
         </TunnelBody>
      </>
   )
}
export default BulkActions
