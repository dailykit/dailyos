import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Form, HelperText, Spacer, TunnelHeader } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../../../shared/utils'
import { UPDATE_COMBO_PRODUCT } from '../../../../../../graphql'
import validator from '../../../validators'
import { TunnelBody } from '../styled'
import { Tooltip } from '../../../../../../../../shared/components'

const address =
   'apps.menu.views.forms.product.inventoryproduct.tunnels.descriptiontunnel.'

const DescriptionTunnel = ({ state, close }) => {
   const { t } = useTranslation()

   const [additionalText, setAdditionalText] = React.useState({
      value: state.additionalText || '',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   })
   const [tags, setTags] = React.useState({
      value: state.tags ? state.tags.join(', ') : '',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   })
   const [description, setDescription] = React.useState({
      value: state.description || '',
      meta: {
         isTouched: false,
         isValid: true,
         errors: [],
      },
   })

   // Mutations
   const [updateProduct, { loading: inFlight }] = useMutation(
      UPDATE_COMBO_PRODUCT,
      {
         variables: {
            id: state.id,
            set: {
               tags: tags.value.trim().length
                  ? tags.value.split(',').map(tag => tag.trim())
                  : [],
               description: description.value,
               additionalText: additionalText.value,
            },
         },
         onCompleted: () => {
            toast.success('Updated!')
            close(1)
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   // Handlers
   const save = () => {
      if (inFlight) return
      if (tags.meta.isValid && description.meta.isValid) {
         updateProduct()
      } else {
         toast.error('Invalid values!')
      }
   }

   return (
      <>
         <TunnelHeader
            title={t(address.concat('add description and tags'))}
            right={{
               action: save,
               title: inFlight
                  ? t(address.concat('saving'))
                  : t(address.concat('save')),
            }}
            close={() => close(1)}
            tooltip={<Tooltip identifier="combo_product_description_tunnel" />}
         />
         <TunnelBody>
            <Form.Group>
               <Form.Label htmlFor="text" title="text">
                  Additional Text (shown with Name)
               </Form.Label>
               <Form.Text
                  id="text"
                  name="text"
                  onChange={e => {
                     setAdditionalText({
                        ...additionalText,
                        value: e.target.value,
                     })
                  }}
                  value={additionalText.value}
                  placeholder="Enter text"
               />
            </Form.Group>
            <Spacer size="16px" />
            <Form.Group>
               <Form.Label htmlFor="tags" title="tags">
                  Tags
               </Form.Label>
               <Form.Text
                  id="tags"
                  name="tags"
                  onBlur={() => {
                     const { isValid, errors } = validator.csv(tags.value)
                     setTags({
                        ...tags,
                        meta: {
                           isTouched: true,
                           isValid,
                           errors,
                        },
                     })
                  }}
                  onChange={e => setTags({ ...tags, value: e.target.value })}
                  value={tags.value}
                  placeholder="Enter tags"
                  hasError={tags.meta.isTouched && !tags.meta.isValid}
               />
               {tags.meta.isTouched &&
                  !tags.meta.isValid &&
                  tags.meta.errors.map((error, index) => (
                     <Form.Error key={index}>{error}</Form.Error>
                  ))}
            </Form.Group>
            <HelperText
               type="hint"
               message="Enter comma separated values, for example: New, Hot, Spicy"
            />
            <Spacer size="16px" />
            <Form.Group>
               <Form.Label htmlFor="description" title="description">
                  Description
               </Form.Label>
               <Form.TextArea
                  id="description"
                  name="description"
                  onChange={e => {
                     setDescription({
                        ...description,
                        value: e.target.value,
                     })
                  }}
                  value={description.value}
                  placeholder="Write product description"
               />
            </Form.Group>
         </TunnelBody>
      </>
   )
}

export default DescriptionTunnel
