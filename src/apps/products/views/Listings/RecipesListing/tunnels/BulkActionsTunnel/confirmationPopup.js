import React from 'react'
import {
   Popup,
   TextButton,
   ButtonGroup,
   ContextualMenu,
   Context,
   Form,
} from '@dailykit/ui'

import { toast } from 'react-toastify'
import { logger } from '../../../../../utils'

import { SIMPLE_RECIPE_UPDATE } from '../../../../../graphql/mutations'
import { useMutation, useSubscription } from '@apollo/react-hooks'

export default function ConfirmationPopup({
   showPopup,
   setShowPopup,
   popupHeading,
   selectedRows,
   mutationData,
}) {
   const [isValid, setIsValid] = React.useState(false)
   const [inputValue, setInputValue] = React.useState('')
   const [username, setUsername] = React.useState({
      value: '',
      meta: {
         isValid: false,
         isTouched: false,
         errors: [],
      },
   })

   const onBlur = () => {
      console.log('this is on blur')
   }

   const onChange = e => {
      setInputValue(e.target.value)
      setIsValid(false)
      console.log('onchange', e.target.value)
   }

   const checkValidation = () => {
      if (inputValue == selectedRows.length) {
         simpleRecipeUpdate({
            variables: {
               ids: selectedRows.map(idx => idx.id),
               _set: mutationData,
            },
         })

         setShowPopup(false)
      } else {
         setIsValid(true)
         console.log('invalid')
      }
   }

   //Mutation
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
      <Popup show={showPopup}>
         <Popup.Text as="h3">{popupHeading}</Popup.Text>
         <Popup.ConfirmText>
            You’re making a change for {selectedRows.length} recipes. Type the
            number of recipes <br />
            selected to confirm this bulk action
         </Popup.ConfirmText>
         <Popup.Actions>
            <Form.Group>
               <Form.Text
                  id="username"
                  name="username"
                  onBlur={onBlur}
                  onChange={onChange}
                  value={inputValue}
                  placeholder="Enter number of recipes"
               />
               {isValid && <Form.Error>Wrong Input, Enter again</Form.Error>}
            </Form.Group>

            <ButtonGroup align="left">
               <TextButton type="solid" onClick={() => checkValidation()}>
                  Confirm
               </TextButton>
            </ButtonGroup>
         </Popup.Actions>
      </Popup>
   )
}
