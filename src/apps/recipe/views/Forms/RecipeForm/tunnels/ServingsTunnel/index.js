import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   Flex,
   Form,
   IconButton,
   Spacer,
   TunnelHeader,
} from '@dailykit/ui'
import { toast } from 'react-toastify'
import { DeleteIcon } from '../../../../../../../shared/assets/icons'
import { logger } from '../../../../../../../shared/utils'
import { CREATE_SIMPLE_RECIPE_YIELDS } from '../../../../../graphql'
import validator from '../../validators'
import { TunnelBody } from '../styled'

const ServingsTunnel = ({ state, closeTunnel }) => {
   // State
   const [servings, setServings] = React.useState([
      {
         value: '',
         meta: {
            isTouched: false,
            isValid: true,
            errors: [],
         },
      },
   ])

   // Mutation
   const [createYields, { loading: inFlight }] = useMutation(
      CREATE_SIMPLE_RECIPE_YIELDS,
      {
         onCompleted: () => {
            toast.success('Servings added!')
            closeTunnel(1)
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   const save = () => {
      if (inFlight || !servings.length) return
      const hasInvalidFields = servings.some(serving => !serving.meta.isValid)
      if (hasInvalidFields) {
         return toast.error('All servings should be valid!')
      }
      const objects = servings.map(serving => ({
         simpleRecipeId: state.id,
         yield: { serving: +serving.value.trim() },
      }))
      createYields({
         variables: {
            objects,
         },
      })
   }

   const handleChange = (value, index) => {
      const newServings = servings
      newServings[index] = { ...servings[index], value }
      setServings([...newServings])
   }

   const validate = index => {
      const { isValid, errors } = validator.serving(servings[index].value)
      const newServings = servings
      newServings[index] = {
         ...servings[index],
         meta: {
            isTouched: true,
            isValid,
            errors,
         },
      }
      setServings([...newServings])
   }

   const addField = () => {
      if (servings.every(serving => serving.value.trim().length)) {
         setServings([
            ...servings,
            {
               value: '',
               meta: {
                  isTouched: false,
                  isValid: true,
                  errors: [],
               },
            },
         ])
      }
   }

   const removeField = index => {
      const newServings = servings
      newServings.splice(index, 1)
      setServings([...newServings])
   }

   return (
      <>
         <TunnelHeader
            title="Add Servings"
            right={{ action: save, title: inFlight ? 'Adding...' : 'Add' }}
            close={() => closeTunnel(1)}
         />
         <TunnelBody>
            {servings.map((serving, i) => (
               <>
                  <Flex container alignItems="end">
                     <Form.Group>
                        <Form.Label
                           htmlFor={`serving-${i}`}
                           title={`serving-${i}`}
                        >
                           Serving*
                        </Form.Label>
                        <Form.Number
                           id={`serving-${i}`}
                           name={`serving-${i}`}
                           onChange={e => handleChange(e.target.value, i)}
                           onBlur={() => validate(i)}
                           value={serving.value}
                           placeholder="Enter serving"
                           hasError={
                              serving.meta.isTouched && !serving.meta.isValid
                           }
                        />
                        {serving.meta.isTouched &&
                           !serving.meta.isValid &&
                           serving.meta.errors.map((error, index) => (
                              <Form.Error key={index}>{error}</Form.Error>
                           ))}
                     </Form.Group>
                     <Spacer xAxis size="16px" />
                     <IconButton type="ghost" onClick={() => removeField(i)}>
                        <DeleteIcon color="#FF5A52" />
                     </IconButton>
                  </Flex>
                  <Spacer size="16px" />
               </>
            ))}
            <ButtonTile type="secondary" text="Add More" onClick={addField} />
         </TunnelBody>
      </>
   )
}

export default ServingsTunnel
