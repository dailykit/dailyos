import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Spacer,
   TunnelHeader,
   TextButton,
   Text,
   Flex,
   Dropdown,
   IconButton,
   ButtonGroup,
   RadioGroup,
   ClearIcon,
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
import { CUISINES } from '../../../../../graphql/subscriptions'
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
   const [initialBulkAction, setInitialBulkAction] = React.useState({
      isPublished: false,
      dropdownDefaultOption: null,
   })
   const [bulkActions, setBulkActions] = React.useState({})
   const [cuisineNames, setCuisineNames] = React.useState([])
   const radioPublishOption = [
      { id: 1, title: 'Publish', payload: { isPublished: true } },
      { id: 2, title: 'Unpublish', payload: { isPublished: false } },
   ]

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
   //Subscription
   const { loading, error } = useSubscription(CUISINES, {
      onSubscriptionData: data => {
         const newCuisine = data.subscriptionData.data.cuisineNames.map(x => {
            x.payload = { cuisine: x.title }
            return x
         })
         setCuisineNames(newCuisine)
      },
   })
   const searchedOption = option => console.log(option)
   return (
      <>
         <TunnelHeader
            title="Apply Bulk Actions"
            right={{
               action: function () {
                  setShowPopup(true)
                  setPopupHeading('Delete selected Recipes')
                  setBulkActions({ isArchived: true })
               },
               title: 'Delete Selected Data',
            }}
            close={() => close(1)}
            tooltip={
               <Tooltip identifier="products_listing_recipe_simple_recipe_bulk_action_tunnel" />
            }
         />
         <TunnelBody>
            <ConfirmationPopup
               bulkActions={bulkActions}
               setBulkActions={setBulkActions}
               showPopup={showPopup}
               setShowPopup={setShowPopup}
               popupHeading={popupHeading}
               selectedRows={selectedRows}
               simpleRecipeUpdate={simpleRecipeUpdate}
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
                  <Flex container justifyContent="space-between">
                     <Text as="h3">Bulk Actions</Text>
                     <TextButton
                        type="solid"
                        size="sm"
                        onClick={() => {
                           console.log('this is all clear')
                           setInitialBulkAction(prevState => ({
                              ...prevState,
                              isPublished: !prevState.isPublished,
                              dropdownDefaultOption: null,
                           }))
                           setBulkActions({})
                        }}
                     >
                        Clear All Actions
                     </TextButton>
                  </Flex>
                  <Spacer size="16px" />
                  <Flex container alignItems="center">
                     <Text as="text1">Change Publish Status</Text>
                     <TextButton
                        type="ghost"
                        size="sm"
                        onClick={() => {
                           console.log('publish clear')
                           setInitialBulkAction(prevState => ({
                              ...prevState,
                              isPublished: !prevState.isPublished,
                           }))
                           setBulkActions(prevState => {
                              delete prevState.isPublished
                              return prevState
                           })
                        }}
                     >
                        Clear
                     </TextButton>
                  </Flex>
                  <Spacer size="10px" />
                  <ButtonGroup align="left">
                     <RadioGroup
                        options={radioPublishOption}
                        active={initialBulkAction.isPublished}
                        onChange={option => {
                           if (option !== null) {
                              console.log(option.payload)
                              setBulkActions(prevState => ({
                                 ...prevState,
                                 ...option.payload,
                              }))
                              return
                           }
                           setBulkActions(prevState => {
                              const newActions = { ...prevState }
                              delete newActions['isPublished']
                              return newActions
                           })
                        }}
                     />
                  </ButtonGroup>
                  <br />
                  <Flex container alignItems="center">
                     <Text as="text1">Cuisine Type</Text>
                     <TextButton
                        type="ghost"
                        size="sm"
                        onClick={() => {
                           console.log('publish clear')
                           setInitialBulkAction(prevState => ({
                              ...prevState,
                              dropdownDefaultOption: null,
                           }))
                           setBulkActions(prevState => {
                              delete prevState.cuisine
                              return prevState
                           })
                        }}
                     >
                        Clear
                     </TextButton>
                  </Flex>
                  <Spacer size="10px" />
                  <Dropdown
                     type="single"
                     defaultValue={initialBulkAction.dropdownDefaultOption}
                     options={cuisineNames}
                     searchedOption={searchedOption}
                     selectedOption={option => {
                        setInitialBulkAction(prevState => ({
                           ...prevState,
                           dropdownDefaultOption: option,
                        }))
                        setBulkActions(prevState => ({
                           ...prevState,
                           ...option.payload,
                        }))
                     }}
                     placeholder="type what you're looking for..."
                  />
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
                           console.log(bulkActions)
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
