import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Form, Spacer, TunnelHeader } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../../shared/utils'
import { CREATE_PRODUCT_CATEGORY } from '../../../../../../graphql'
import validator from '../../../../validators'
import { TunnelBody } from '../styled'

const address = 'apps.settings.views.forms.accompanimenttypes.tunnels.addnew.'

const AddTypesTunnel = ({ closeTunnel }) => {
   const { t } = useTranslation()

   const [name, setName] = React.useState({
      value: '',
      meta: {
         isValid: true,
         isTouched: false,
         errors: [],
      },
   })

   const [description, setDescription] = React.useState({
      value: '',
      meta: {
         isValid: true,
         isTouched: false,
         errors: [],
      },
   })

   // Mutation
   const [addCategory, { loading: inFlight }] = useMutation(
      CREATE_PRODUCT_CATEGORY,
      {
         onCompleted: () => {
            toast.success('Product category added!')
            closeTunnel(1)
         },
         onError: error => {
            toast.error('Error')
            logger(error)
         },
      }
   )

   // Handlers
   const add = () => {
      if (inFlight) return
      if (!name.value || !name.meta.isValid) {
         return toast.error('Invalid values!')
      }
      addCategory({
         variables: {
            object: {
               name: name.value,
               metaDetails: {
                  description: description.value,
               },
            },
         },
      })
   }

   return (
      <>
         <TunnelHeader
            title="Add Product Category"
            right={{
               action: add,
               title: inFlight
                  ? t(address.concat('adding'))
                  : t(address.concat('add')),
            }}
            close={() => closeTunnel(1)}
         />
         <TunnelBody>
            <Form.Group>
               <Form.Label htmlFor="name" title="name">
                  Name*
               </Form.Label>
               <Form.Text
                  id="name"
                  name="name"
                  onChange={e => setName({ ...name, value: e.target.value })}
                  onBlur={() => {
                     const { isValid, errors } = validator.name(name.value)
                     setName({
                        ...name,
                        meta: {
                           isTouched: true,
                           isValid,
                           errors,
                        },
                     })
                  }}
                  value={name.value}
                  placeholder="Enter category name"
                  hasError={name.meta.isTouched && !name.meta.isValid}
               />
               {name.meta.isTouched &&
                  !name.meta.isValid &&
                  name.meta.errors.map((error, index) => (
                     <Form.Error key={index}>{error}</Form.Error>
                  ))}
            </Form.Group>
            <Spacer size="16px" />
            <Form.Group>
               <Form.Label htmlFor="description" title="description">
                  Description
               </Form.Label>
               <Form.TextArea
                  id="description"
                  name="description"
                  onChange={e =>
                     setDescription({ ...description, value: e.target.value })
                  }
                  value={description.value}
                  placeholder="Write about category"
                  hasError={
                     description.meta.isTouched && !description.meta.isValid
                  }
               />
               {description.meta.isTouched &&
                  !description.meta.isValid &&
                  description.meta.errors.map((error, index) => (
                     <Form.Error key={index}>{error}</Form.Error>
                  ))}
            </Form.Group>
         </TunnelBody>
      </>
   )
}

export default AddTypesTunnel
