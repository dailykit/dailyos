import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   Spacer,
   TunnelHeader,
   TextButton,
   Text,
   Flex,
   Dropdown,
   IconButton,
   ButtonGroup,
} from '@dailykit/ui'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { randomSuffix } from '../../../../../../../shared/utils'
import { TunnelBody } from '../styled'
import { useTabs } from '../../../../../../../shared/providers'
import { PRODUCTS } from '../../../../../graphql'
import { DeleteIcon, RemoveIcon } from '../../../../../assets/icons'
import { Tooltip } from '../../../../../../../shared/components'
import ConfirmationPopup from './confirmationPopup'
import { SIMPLE_RECIPE_UPDATE } from '../../../../../graphql/mutations'

const address = 'apps.menu.views.listings.productslisting.'

export default function BulkActionsTunnel({
   close,
   selectedRows,
   setSelectedRows,
   removeSelectedRow,
}) {
   const { t } = useTranslation()
   const { addTab } = useTabs()

   const [showPopup, setShowPopup] = React.useState(false)
   const [popupHeading, setPopupHeading] = React.useState('')

   const [bulkData, setBulkData] = React.useState({})

   const [mutationData, setMutationData] = React.useState({})
   const removeRecipe = index => {
      console.log('index', index)
      removeSelectedRow(index)
      setSelectedRows(prevState => prevState.filter(row => row.id !== index))
   }

   // Mutations

   const [simpleRecipeUpdate] = useMutation(SIMPLE_RECIPE_UPDATE, {
      onCompleted: () => {
         toast.success('Update Successfully')
      },
      onError: error => {
         toast.error('Something went wrong!')
         //  logger(error)
      },
   })

   return (
      <>
         <TunnelHeader
            title="Apply Bulk Actions"
            right={{
               action: function () {
                  console.log('this is bulk', bulkData)
                  simpleRecipeUpdate({
                     variables: {
                        ids: selectedRows.map(idx => idx.id),
                        _set: bulkData,
                     },
                  })
               },
               title: 'Save Changes',
            }}
            close={() => close(1)}
            tooltip={
               <Tooltip identifier="products_listing_recipe_simple_recipe_bulk_action_tunnel" />
            }
         />
         <TunnelBody>
            <ConfirmationPopup
               setBulkData={setBulkData}
               showPopup={showPopup}
               setShowPopup={setShowPopup}
               popupHeading={popupHeading}
               selectedRows={selectedRows}
               mutationData={mutationData}
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
                     width=""
                     alignItems="center"
                     justifyContent="space-between"
                  >
                     <Text as="h3">Recipes</Text>
                     <span
                        style={{
                           color: '#919699',
                           fontStyle: 'italic',
                           fontWeight: '500',
                           marginRight: '20px',
                        }}
                     >
                        {selectedRows.length}{' '}
                        {selectedRows.length > 1 ? 'recipes' : 'recipe'}{' '}
                        selected{' '}
                     </span>
                  </Flex>
                  <div style={{ height: '400px', overflowY: 'auto' }}>
                     {selectedRows.map((recipe, id) => (
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
                              {recipe.name}
                              <IconButton
                                 type="ghost"
                                 onClick={() => removeRecipe(recipe.id)}
                              >
                                 <RemoveIcon color="#FF5A52" />
                              </IconButton>
                           </Flex>
                        </div>
                     ))}
                  </div>
               </Flex>
               <Flex width="50%" padding="0px 0px 20px 20px">
                  <Text as="h3">Bulk Actions</Text>
                  <Spacer size="16px" />
                  <Text as="text1">Change Publish Status</Text>
                  <Spacer size="10px" />
                  <ButtonGroup align="left">
                     <TextButton
                        type="solid"
                        size="md"
                        onClick={() => {
                           setShowPopup(true)
                           setPopupHeading('Make All Published')
                           setMutationData({ isPublished: true })
                        }}
                     >
                        Make All Published
                     </TextButton>

                     <TextButton
                        type="solid"
                        size="md"
                        onClick={() => {
                           setShowPopup(true)
                           setPopupHeading('Make All Unpublished')
                           setMutationData({ isPublished: false })
                        }}
                     >
                        Make All Unpublished
                     </TextButton>
                  </ButtonGroup>
                  <br />
                  <Flex container alignItems="center">
                     <Text as="text1" margin="20px">
                        Remove selected Recipes
                     </Text>
                     <IconButton
                        type="ghost"
                        onClick={() => {
                           setShowPopup(true)
                           setPopupHeading('Delete selected Recipes')
                           setMutationData({ isArchived: true })
                        }}
                     >
                        <DeleteIcon color="#FF5A52" />
                     </IconButton>
                  </Flex>
               </Flex>
            </Flex>
            <Spacer size="16px" />
         </TunnelBody>
      </>
   )
}