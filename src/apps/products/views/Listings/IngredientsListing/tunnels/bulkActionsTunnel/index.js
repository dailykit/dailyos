import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Spacer,
   TextButton,
   Text,
   Flex,
   Dropdown,
   ButtonGroup,
   RadioGroup,
} from '@dailykit/ui'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useTabs } from '../../../../../../../shared/providers'
import { INGREDIENT_CATEGORY_CREATE } from '../../../../../graphql/mutations'
import { INGREDIENT_CATEGORIES_INGREDIENTS_AGGREGATE } from '../../../../../graphql/subscriptions'
import BulkActions from '../../../../../../../shared/components/BulkAction'
const address = 'apps.menu.views.listings.productslisting.'

export default function BulkActionsTunnel({
   close,
   selectedRows,
   setSelectedRows,
   removeSelectedRow,
}) {
   const { t } = useTranslation()
   const { addTab } = useTabs()

   const [initialBulkAction, setInitialBulkAction] = React.useState({
      isPublished: false,
      category: {
         defaultOption: null,
         value: '',
      },
   })
   const [bulkActions, setBulkActions] = React.useState({})
   const [ingredientCategories, setIngredientCategories] = React.useState([])
   const radioPublishOption = [
      { id: 1, title: 'Publish', payload: { isPublished: true } },
      { id: 2, title: 'Unpublish', payload: { isPublished: false } },
   ]
   const removeRecipe = index => {
      console.log('index', index)
      removeSelectedRow(index)
      setSelectedRows(prevState => prevState.filter(row => row.id !== index))
   }
   //mutation
   const [_createIngredientCategory] = useMutation(INGREDIENT_CATEGORY_CREATE, {
      variables: {
         name: initialBulkAction.category.value,
      },
      onCompleted: () => {
         toast.success('Update Successfully')
         setInitialBulkAction({
            ...initialBulkAction,
            category: { ...initialBulkAction.category, value: '' },
         })
      },
      onError: error => {
         toast.error('Something went wrong!')
         //  logger(error)
      },
   })
   //subscription
   useSubscription(INGREDIENT_CATEGORIES_INGREDIENTS_AGGREGATE, {
      onSubscriptionData: data => {
         const newIngredientCategories = data.subscriptionData.data.ingredientCategories.map(
            (item, index) => ({
               ...item,
               id: index + 1,
               payload: { category: item.title },
            })
         )
         setIngredientCategories(newIngredientCategories)
         console.log(
            'this is category',
            data.subscriptionData.data.ingredientCategories.map(
               (item, index) => ({
                  ...item,
                  id: index + 1,
                  payload: { category: item.title },
               })
            )
         )
      },
   })
   const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)
   const createIngredientCategory = () => {
      const newCategory = capitalize(initialBulkAction.category.value)
      _createIngredientCategory({
         variables: {
            name: newCategory,
         },
      })
   }
   const clearAllActions = () => {
      setInitialBulkAction(prevState => ({
         ...prevState,
         isPublished: !prevState.isPublished,
         category: {
            defaultOption: null,
            value: '',
         },
      }))
      setBulkActions({})
   }
   return (
      <>
         <BulkActions
            table="Ingredient"
            selectedRows={selectedRows}
            removeSelectedRow={removeRecipe}
            bulkActions={bulkActions}
            setBulkActions={setBulkActions}
            clearAllActions={clearAllActions}
            close={close}
         >
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
               <Text as="text1">Ingredient Category</Text>
               <TextButton
                  type="ghost"
                  size="sm"
                  onClick={() => {
                     console.log('publish clear')
                     setInitialBulkAction(prevState => ({
                        ...prevState,
                        category: {
                           defaultOption: null,
                           value: '',
                        },
                     }))
                     setBulkActions(prevState => {
                        delete prevState['category']
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
               defaultValue={initialBulkAction.category.defaultOption}
               options={ingredientCategories}
               addOption={() => {
                  createIngredientCategory()
               }}
               searchedOption={option =>
                  setInitialBulkAction({
                     ...initialBulkAction,
                     category: {
                        ...initialBulkAction.category,
                        value: option,
                     },
                  })
               }
               selectedOption={option => {
                  setInitialBulkAction(prevState => ({
                     ...prevState,
                     category: {
                        ...prevState,
                        defaultOption: option,
                     },
                  }))
                  setBulkActions(prevState => ({
                     ...prevState,
                     ...option.payload,
                  }))
               }}
               placeholder="choose ingredient type"
            />
         </BulkActions>
      </>
   )
}
