import React from 'react'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { useParams } from 'react-router'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Filler,
   Flex,
   Form,
   IconButton,
   Spacer,
   Text,
   TextButton,
   Popup,
   ButtonGroup,
   ButtonTile,
} from '@dailykit/ui'

import { CloseIcon, EditIcon } from '../../../../shared/assets/icons'
import { MUTATIONS, QUERIES } from '../../graphql'
import { currencyFmt, logger } from '../../../../shared/utils'

const EditPrice = ({ product }) => {
   const [visible, setVisible] = React.useState(false)
   const [isEdit, setIsEdit] = React.useState(false)
   const [showPrimary, setShowPrimary] = React.useState(false)
   const [updatedPrice, setUpdatedPrice] = React.useState({
      value: product.price,
      meta: {
         errors: [],
         isTouched: false,
         isValid: true,
      },
   })

   const [update] = useMutation(MUTATIONS.PRODUCT.PRICE.UPDATE, {
      onCompleted: () => toast.success('Successfully updated the price'),
      onError: () => toast.error('Failed to update the price of product.'),
   })
   const validate = e => {
      const { value } = e.target
      if (value === '') {
         setUpdatedPrice({
            ...updatedPrice,
            meta: {
               errors: [],
               isTouched: true,
               isValid: false,
            },
         })
         return
      }

      const v = parseInt(value)
      if (isNaN(v)) {
         setUpdatedPrice({
            ...updatedPrice,
            meta: {
               errors: ['Please input numbers only!'],
               isTouched: true,
               isValid: false,
            },
         })
         return
      }
      if (v <= 0) {
         setUpdatedPrice({
            ...updatedPrice,
            meta: {
               errors: ['Price should be greater than 0!'],
               isTouched: true,
               isValid: false,
            },
         })
         return
      }

      setUpdatedPrice({
         ...updatedPrice,
         meta: {
            errors: [],
            isValid: true,
            isTouched: true,
         },
      })
   }
   return (
      <>
         <Flex container alignItems="center" justifyContent="space-between">
            {isEdit ? (
               <Flex
                  container
                  alignItems="center"
                  justifyContent="space-between"
               >
                  <Form.Group>
                     <Form.Number
                        value={updatedPrice.value}
                        onChange={e =>
                           setUpdatedPrice({
                              ...updatedPrice,
                              value: e.target.value,
                           })
                        }
                        onBlur={validate}
                        hasError={
                           updatedPrice.meta.isTouched &&
                           !updatedPrice.meta.isValid
                        }
                     />
                     {updatedPrice.meta.isTouched &&
                        !updatedPrice.meta.isValid &&
                        updatedPrice.meta.errors.map((error, index) => (
                           <Form.Error justifyContent="center" key={index}>
                              {error}
                           </Form.Error>
                        ))}
                  </Form.Group>
                  <Spacer size="2px" xAxis />
                  <IconButton
                     type="ghost"
                     size="sm"
                     onClick={() => setIsEdit(!isEdit)}
                  >
                     <CloseIcon color="#ec3333" />
                  </IconButton>
                  <TextButton
                     type="ghost"
                     size="sm"
                     disabled={
                        !updatedPrice.meta.isValid || !updatedPrice.value
                     }
                     onClick={() => {
                        setIsEdit(!isEdit)
                        setShowPrimary(!showPrimary)
                     }}
                  >
                     Update
                  </TextButton>
               </Flex>
            ) : (
               <Text
                  as="text3"
                  // style={{ marginLeft: '8px' }}
                  onMouseOver={() => setVisible(!visible)}
               >
                  Price: {currencyFmt(product.price || product.unitPrice)}
               </Text>
            )}

            <Spacer xAxis size="20px" />
            <Popup
               show={showPrimary}
               clickOutsidePopup={() => setShowPrimary(false)}
            >
               <Popup.Actions>
                  <Popup.Text type="primary">
                     Closing this file will not save any changes!
                  </Popup.Text>
                  <Popup.Close
                     closePopup={() => setShowPrimary(!showPrimary)}
                  />
               </Popup.Actions>
               <Popup.ConfirmText>Are you sure?</Popup.ConfirmText>
               <Popup.Actions>
                  <ButtonGroup align="left">
                     <TextButton
                        type="solid"
                        onClick={() => {
                           setShowPrimary(!showPrimary)
                           if (
                              updatedPrice.meta.isValid &&
                              updatedPrice.value
                           ) {
                              update({
                                 variables: {
                                    id: product.id,
                                    _set: {
                                       unitPrice: updatedPrice.value,
                                    },
                                 },
                              })
                           }
                        }}
                     >
                        Yes! change the price
                     </TextButton>
                     <TextButton
                        type="ghost"
                        onClick={() => setShowPrimary(!showPrimary)}
                     >
                        Don't want to change
                     </TextButton>
                  </ButtonGroup>
               </Popup.Actions>
            </Popup>

            {visible ? (
               <IconButton
                  type="ghost"
                  size="sm"
                  onClick={() => {
                     setIsEdit(!isEdit)

                     setVisible(!visible)
                  }}
               >
                  <EditIcon />
               </IconButton>
            ) : (
               ''
            )}
         </Flex>
      </>
   )
}

export default EditPrice
