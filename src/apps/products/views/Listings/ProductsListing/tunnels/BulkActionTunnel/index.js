import React from 'react'
import {
   Spacer,
   TextButton,
   Text,
   Flex,
   ButtonGroup,
   RadioGroup,
} from '@dailykit/ui'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useTabs } from '../../../../../../../shared/providers'

import BulkActions from '../../../../../../../shared/components/BulkAction'
const address = 'apps.menu.views.listings.productslisting.'

export default function BulkActionsTunnel({
   close,
   selectedRows,
   removeSelectedRow,
}) {
   const { t } = useTranslation()
   const { addTab } = useTabs()

   const [initialBulkAction, setInitialBulkAction] = React.useState({
      isPublished: false,
   })
   const [bulkActions, setBulkActions] = React.useState({})

   const radioPublishOption = [
      { id: 1, title: 'Publish', payload: { isPublished: true } },
      { id: 2, title: 'Unpublish', payload: { isPublished: false } },
   ]
   const removeRecipe = index => {
      console.log('index', index)
      removeSelectedRow(index)
   }

   const clearAllActions = () => {
      setInitialBulkAction(prevState => ({
         ...prevState,
         isPublished: !prevState.isPublished,
      }))
      setBulkActions({})
   }

   return (
      <>
         <BulkActions
            table="Product"
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
         </BulkActions>
      </>
   )
}
