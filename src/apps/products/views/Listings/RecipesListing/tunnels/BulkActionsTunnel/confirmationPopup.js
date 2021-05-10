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

import { useMutation, useSubscription } from '@apollo/react-hooks'

export default function ConfirmationPopup({
   showPopup,
   setShowPopup,
   popupHeading,
   selectedRows,
   mutationData,
   setBulkData,
}) {
   const [isValid, setIsValid] = React.useState(false)
   const [inputValue, setInputValue] = React.useState('')

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
         setBulkData(prevState => ({ ...prevState, ...mutationData }))
         setInputValue('')
         setShowPopup(false)
      } else {
         setIsValid(true)
         console.log('invalid')
      }
   }

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
               <TextButton
                  type="solid"
                  disabled={inputValue.length > 0 ? false : true}
                  onClick={() => checkValidation()}
               >
                  Confirm
               </TextButton>
            </ButtonGroup>
         </Popup.Actions>
      </Popup>
   )
}
