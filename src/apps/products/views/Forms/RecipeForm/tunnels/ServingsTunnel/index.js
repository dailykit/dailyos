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
import { Tooltip } from '../../../../../../../shared/components'

const ServingsTunnel = ({ state, closeTunnel }) => {
   // State
   const [servings, setServings] = React.useState([
      {
         serving: {
            value: '',
            meta: {
               isTouched: false,
               isValid: true,
               errors: [],
            },
         },
         label: {
            value: '',
            meta: {
               isTouched: false,
               isValid: true,
               errors: [],
            },
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
      const hasInvalidFields = servings.some(
         object => !object.serving.meta.isValid || !object.serving.value.trim()
      )
      if (hasInvalidFields) {
         return toast.error('All servings should be valid!')
      }
      const objects = servings.map(object => ({
         simpleRecipeId: state.id,
         yield: {
            serving: +object.serving.value.trim(),
            label: object.label.value,
         },
      }))
      createYields({
         variables: {
            objects,
         },
      })
   }

   const handleChange = (field, value, index) => {
      const newServings = [...servings]
      console.log(newServings)
      newServings[index] = {
         ...newServings[index],
         [field]: {
            ...newServings[index][field],
            value,
         },
      }
      setServings([...newServings])
   }

   const validate = index => {
      const { isValid, errors } = validator.serving(
         servings[index].serving.value
      )
      const newServings = servings
      newServings[index] = {
         ...servings[index],
         serving: {
            ...servings[index].serving,
            meta: {
               isTouched: true,
               isValid,
               errors,
            },
         },
      }
      setServings([...newServings])
   }

   const addField = () => {
      if (servings.every(object => object.serving.value.trim().length)) {
         setServings([
            ...servings,
            {
               serving: {
                  value: '',
                  meta: {
                     isTouched: false,
                     isValid: true,
                     errors: [],
                  },
               },
               label: {
                  value: '',
                  meta: {
                     isTouched: false,
                     isValid: true,
                     errors: [],
                  },
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
            tooltip={<Tooltip identifier="servings_tunnel" />}
         />
         <TunnelBody>
            {servings.map((object, i) => (
               <>
                  <Flex container alignItems="end">
                     <Flex container alignItems="start">
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
                              onChange={e =>
                                 handleChange('serving', e.target.value, i)
                              }
                              onBlur={() => validate(i)}
                              value={object.serving.value}
                              placeholder="Enter serving"
                              hasError={
                                 object.serving.meta.isTouched &&
                                 !object.serving.meta.isValid
                              }
                           />
                           {object.serving.meta.isTouched &&
                              !object.serving.meta.isValid &&
                              object.serving.meta.errors.map((error, index) => (
                                 <Form.Error key={index}>{error}</Form.Error>
                              ))}
                        </Form.Group>
                        <Spacer xAxis size="8px" />
                        <Form.Group>
                           <Form.Label
                              htmlFor={`label-${i}`}
                              title={`label-${i}`}
                           >
                              Label
                           </Form.Label>
                           <Form.Text
                              id={`label-${i}`}
                              name={`label-${i}`}
                              onChange={e =>
                                 handleChange('label', e.target.value, i)
                              }
                              value={object.label.value}
                              placeholder="Enter label"
                              hasError={
                                 object.label.meta.isTouched &&
                                 !object.label.meta.isValid
                              }
                           />
                           {object.label.meta.isTouched &&
                              !object.label.meta.isValid &&
                              object.label.meta.errors.map((error, index) => (
                                 <Form.Error key={index}>{error}</Form.Error>
                              ))}
                        </Form.Group>
                     </Flex>
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
