import React from 'react'
import { Flex, Form, HelperText, Spacer } from '@dailykit/ui'
import { UPDATE_RECIPE } from '../../../../../graphql'
import {
   Tooltip,
   UpdatingSpinner,
} from '../../../../../../../shared/components'
import { useMutation } from '@apollo/react-hooks'
import validator from '../../validators'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../shared/utils'
import { isArray } from 'lodash'

const NotIncluded = ({ state, updated, setUpdated }) => {
   const [notIncluded, setNotIncluded] = React.useState(state.notIncluded)
   const [errors, setErrors] = React.useState([])

   const [updateNotIncluded, { loading: updatingNotIncluded }] = useMutation(
      UPDATE_RECIPE,
      {
         onCompleted: () => {
            setUpdated('not-included')
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   return (
      <>
         <Flex container alignItems="center">
            <Form.Group>
               <Tooltip identifier="recipe_not_included" />
               <Form.Text
                  variant="revamp-sm"
                  id="notIncluded"
                  name="notIncluded"
                  onChange={e => setNotIncluded(e.target.value)}
                  onBlur={() => {
                     const { isValid, errors } = validator.csv(
                        isArray(notIncluded)
                           ? notIncluded.join(',')
                           : notIncluded
                     )
                     setErrors(errors)
                     if (isValid) {
                        updateNotIncluded({
                           variables: {
                              id: state.id,
                              set: {
                                 notIncluded: notIncluded
                                    ? isArray(notIncluded)
                                       ? notIncluded
                                       : notIncluded
                                            .split(',')
                                            .map(tag => tag.trim())
                                    : [],
                              },
                           },
                        })
                     }
                  }}
                  value={
                     isArray(notIncluded) ? notIncluded.join(',') : notIncluded
                  }
                  placeholder="enter what's not included"
                  hasError={errors.length}
               />
               {errors.map((error, index) => (
                  <Form.Error key={index}>{error}</Form.Error>
               ))}
            </Form.Group>
            <Spacer xAxis size="16px" />
            <UpdatingSpinner
               updated={updated}
               setUpdated={setUpdated}
               updatedField="not-included"
               loading={updatingNotIncluded}
            />
         </Flex>
         <HelperText
            type="hint"
            message="Enter comma separated values, for example: Salt, Oil, Pepper"
         />
      </>
   )
}

export default NotIncluded
