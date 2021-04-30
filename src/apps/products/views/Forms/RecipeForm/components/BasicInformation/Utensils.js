import React from 'react'
import { Flex, Form, HelperText, Spacer } from '@dailykit/ui'
import { UPDATE_RECIPE } from '../../../../../graphql'
import {
   Tooltip,
   UpdatingSpinner,
} from '../../../../../../../shared/components'
import { useMutation } from '@apollo/react-hooks'
import validator from '../../validators'
import { isArray } from 'lodash'
import { logger } from '../../../../../../../shared/utils'
import { toast } from 'react-toastify'

const Utensils = ({ state, updated, setUpdated }) => {
   const [utensils, setUtensils] = React.useState(
      state.utensils === null ? [] : state.utensils
   )
   const [errors, setErrors] = React.useState([])

   const [updateUtensils, { loading: updatingUtensils }] = useMutation(
      UPDATE_RECIPE,
      {
         onCompleted: () => {
            setUpdated('utensils')
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
               <Form.Label htmlFor="utensils" title="utensils">
                  <Tooltip identifier="recipe_utensils" />
               </Form.Label>
               <Form.Text
                  variant="revamp-sm"
                  id="utensils"
                  name="utensils"
                  onChange={e => setUtensils(e.target.value)}
                  onBlur={() => {
                     const { isValid, errors } = validator.csv(
                        isArray(utensils) ? utensils.join(',') : utensils
                     )
                     setErrors(errors)
                     if (isValid) {
                        updateUtensils({
                           variables: {
                              id: state.id,
                              set: {
                                 utensils: utensils
                                    ? isArray(utensils)
                                       ? utensils
                                       : utensils
                                            .split(',')
                                            .map(tag => tag.trim())
                                    : [],
                              },
                           },
                        })
                     }
                  }}
                  value={isArray(utensils) ? utensils.join(',') : utensils}
                  placeholder="enter utensils"
                  hasError={Boolean(errors.length)}
               />
               {errors.map((error, index) => (
                  <Form.Error key={index}>{error}</Form.Error>
               ))}
            </Form.Group>
            <Spacer xAxis size="16px" />
            <UpdatingSpinner
               updated={updated}
               setUpdated={setUpdated}
               updatedField="utensils"
               loading={updatingUtensils}
            />
         </Flex>

         <HelperText
            type="hint"
            message="Enter comma separated values, for example: Pan, Spoon, Bowl"
         />
      </>
   )
}

export default Utensils
