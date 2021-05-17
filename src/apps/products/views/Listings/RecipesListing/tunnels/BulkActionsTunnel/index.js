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
   Form,
   HelperText,
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
import {
   SIMPLE_RECIPE_UPDATE,
   CREATE_CUISINE_NAME,
} from '../../../../../graphql/mutations'
import { CUISINES_NAMES } from '../../../../../graphql/subscriptions'
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

   const [showPopup, setShowPopup] = React.useState(false)
   const [popupHeading, setPopupHeading] = React.useState('')
   const [initialBulkAction, setInitialBulkAction] = React.useState({
      isPublished: false,
      type: false,
      cuisineName: {
         defaultOption: null,
         value: '',
      },
      author: '',
      cookingTime: '',
      utensils: '',
   })
   const [bulkActions, setBulkActions] = React.useState({})
   const [cuisineNames, setCuisineNames] = React.useState([])
   const radioPublishOption = [
      { id: 1, title: 'Publish', payload: { isPublished: true } },
      { id: 2, title: 'Unpublish', payload: { isPublished: false } },
   ]
   const radioTypeOption = [
      { id: 1, title: 'Non-vegetarian', payload: { type: 'Non-vegetarian' } },
      { id: 2, title: 'Vegetarian', payload: { type: 'Vegetarian' } },
      { id: 3, title: 'Vegan', payload: { type: 'Vegan' } },
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
         close(1)
      },
      onError: error => {
         toast.error('Something went wrong!')
         //  logger(error)
      },
   })
   const [createCuisineName] = useMutation(CREATE_CUISINE_NAME, {
      onCompleted: () => {
         toast.success('Update Successfully')
         setInitialBulkAction({ ...initialBulkAction, cuisineName: '' })
      },
      onError: error => {
         toast.error('Something went wrong!')
         //  logger(error)
      },
   })
   //Subscription
   const { loading, error } = useSubscription(CUISINES_NAMES, {
      onSubscriptionData: data => {
         const newCuisine = data.subscriptionData.data.cuisineNames.map(x => {
            x.payload = { cuisine: x.title }
            return x
         })
         setCuisineNames(newCuisine)
      },
   })

   const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)
   const createCuisine = () => {
      const newCuisine = capitalize(initialBulkAction.cuisineName.value)
      createCuisineName({
         variables: {
            name: newCuisine,
         },
      })
   }
   const clearAllActions = () => {
      setInitialBulkAction(prevState => ({
         ...prevState,
         isPublished: !prevState.isPublished,
         dropdownDefaultOption: null,
         type: !prevState.type,
         author: '',
         cookingTime: '30',
         utensils: '',
         cuisineName: '',
      }))
      setBulkActions({})
   }
   return (
      <>
         <BulkActions
            table="Recipe"
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
               <Text as="text1">Type</Text>
               <TextButton
                  type="ghost"
                  size="sm"
                  onClick={() => {
                     console.log('Type clear')
                     setInitialBulkAction(prevState => ({
                        ...prevState,
                        type: !prevState.type,
                     }))
                     setBulkActions(prevState => {
                        delete prevState.type
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
                  options={radioTypeOption}
                  active={initialBulkAction.type}
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
                        delete newActions['type']
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
               addOption={() => createCuisine()}
               searchedOption={option =>
                  setInitialBulkAction({
                     ...initialBulkAction,
                     cuisineName: option,
                  })
               }
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
               placeholder="choose cuisine type"
            />
            <Spacer size="20px" />
            <Flex container>
               <Form.Group>
                  <Form.Label htmlFor="author" title="author">
                     <Flex container alignItems="center">
                        <Text as="text1">Author</Text>
                        <TextButton
                           type="ghost"
                           size="sm"
                           onClick={() => {
                              setInitialBulkAction({
                                 ...initialBulkAction,
                                 author: '',
                              })
                              setBulkActions(prevState => {
                                 const newOption = { ...prevState }
                                 delete newOption['author']
                                 return newOption
                              })
                           }}
                        >
                           Clear
                        </TextButton>
                        <Tooltip identifier="recipe_author" />
                     </Flex>
                  </Form.Label>
                  <Form.Text
                     id="author"
                     name="author"
                     value={initialBulkAction.author}
                     onBlur={() => {
                        if (initialBulkAction.author) {
                           setBulkActions({
                              ...bulkActions,
                              author: initialBulkAction.author,
                           })
                           return
                        }
                        if ('author' in bulkActions) {
                           const newOptions = { ...bulkActions }
                           delete newOptions['author']
                           setBulkActions(newOptions)
                           return
                        }
                     }}
                     onChange={e => {
                        setInitialBulkAction({
                           ...initialBulkAction,
                           author: e.target.value,
                        })
                     }}
                     placeholder="Enter author name"
                  />
               </Form.Group>
               <Spacer xAxis size="16px" />
               <Form.Group>
                  <Form.Label htmlFor="cookingTime" title="cookingTime">
                     <Flex container alignItems="center">
                        <Text as="text2">Cooking Time(mins)</Text>
                        <TextButton
                           type="ghost"
                           size="sm"
                           onClick={() => {
                              setInitialBulkAction({
                                 ...initialBulkAction,
                                 cookingTime: '30',
                              })
                              setBulkActions(prevState => {
                                 const newOption = { ...prevState }
                                 delete newOption['cookingTime']
                                 return newOption
                              })
                           }}
                        >
                           Clear
                        </TextButton>
                        <Tooltip identifier="recipe_cooking_time" />
                     </Flex>
                  </Form.Label>
                  <Form.Number
                     id="cookingTime"
                     name="cookingTime"
                     value={initialBulkAction.cookingTime}
                     placeholder="Enter cooking time"
                     onChange={e =>
                        setInitialBulkAction({
                           ...initialBulkAction,
                           cookingTime: e.target.value,
                        })
                     }
                     onBlur={() => {
                        if (initialBulkAction.cookingTime) {
                           setBulkActions({
                              ...bulkActions,
                              cookingTime: initialBulkAction.cookingTime,
                           })
                           return
                        }
                        if ('cookingTime' in initialBulkAction) {
                           const newOptions = { ...bulkActions }
                           delete newOptions['cookingTime']
                           setBulkActions(newOptions)
                           return
                        }
                     }}
                  />
               </Form.Group>
            </Flex>
            <Spacer size="10px" />
            <Form.Group>
               <Form.Label htmlFor="utensils" title="utensils">
                  <Flex container alignItems="center">
                     <Text as="text1">Utensils</Text>
                     <TextButton
                        type="ghost"
                        size="sm"
                        onClick={() => {
                           setInitialBulkAction({
                              ...initialBulkAction,
                              utensils: '',
                           })
                           setBulkActions(prevState => {
                              const newOption = { ...prevState }
                              delete newOption['utensils']
                              return newOption
                           })
                        }}
                     >
                        Clear
                     </TextButton>
                     <Tooltip identifier="recipe_utensils" />
                  </Flex>
               </Form.Label>
               <Form.Text
                  id="utensils"
                  name="utensils"
                  value={initialBulkAction.utensils}
                  onChange={e =>
                     setInitialBulkAction({
                        ...initialBulkAction,
                        utensils: e.target.value,
                     })
                  }
                  onBlur={() => {
                     if (initialBulkAction.utensils) {
                        const newUtensils = initialBulkAction.utensils
                           .split(',')
                           .map(tag => {
                              const newTag = tag.trim()
                              return capitalize(newTag)
                           })
                        setBulkActions({
                           ...bulkActions,
                           utensils: newUtensils,
                        })
                        return
                     }
                     if ('utensils' in bulkActions) {
                        const newOptions = { ...bulkActions }
                        delete newOptions['utensils']
                        setBulkActions(newOptions)
                        return
                     }
                  }}
                  placeholder="Enter utensils"
               />
            </Form.Group>
            <Form.Error>
               Changing utensils will overwrite already existing utensils
            </Form.Error>
            <HelperText
               type="hint"
               message="Enter comma separated values, for example: Pan, Spoon, Bowl"
            />
         </BulkActions>
      </>
   )
}
const RadioAction = ({
   actionLabel,
   radioOptions,
   keyName,
   seedState,
   setSeedState,
   setBulkActions,
}) => {
   return (
      <>
         <Flex container alignItems="center">
            <Text as="text1">{actionLabel}</Text>
            <TextButton
               type="ghost"
               size="sm"
               onClick={() => {
                  console.log('publish clear')
                  setSeedState(prevState => ({
                     ...prevState,
                     [keyName]: !prevState[keyName],
                  }))
                  setBulkActions(prevState => {
                     delete prevState[keyName]
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
               options={radioOptions}
               active={seedState[keyName]}
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
                     delete newActions[keyName]
                     return newActions
                  })
               }}
            />
         </ButtonGroup>
      </>
   )
}
const DropdownAction = ({
   actionLabel,
   keyName,
   seedState,
   setSeedState,
   addOption,
   dropdownOption,
   placeholder,
   setBulkActions,
}) => (
   <>
      <Flex container alignItems="center">
         <Text as="text1">{actionLabel}</Text>
         <TextButton
            type="ghost"
            size="sm"
            onClick={() => {
               setSeedState(prevState => ({
                  ...prevState,
                  [keyName]: {
                     defaultOption: null,
                     value: '',
                  },
               }))
               setBulkActions(prevState => {
                  delete prevState[keyName]
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
         defaultValue={seedState[keyName].defaultOption}
         options={dropdownOption}
         addOption={() => addOption()}
         searchedOption={option =>
            setSeedState({
               ...seedState,
               [keyName]: {
                  ...seedState[keyName],
                  value: option,
               },
            })
         }
         selectedOption={option => {
            setSeedState(prevState => ({
               ...prevState,
               [keyName]: {
                  ...prevState[keyName],
                  defaultOption: option,
               },
            }))
            setBulkActions(prevState => ({
               ...prevState,
               ...option.payload,
            }))
         }}
         placeholder={placeholder}
      />
   </>
)
