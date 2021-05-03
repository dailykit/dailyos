import { useMutation } from '@apollo/react-hooks'
import { Flex, Form, Select, Spacer, TunnelHeader } from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { InlineLoader, Tooltip } from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils/errorLog'
import { TunnelContainer } from '../../../../../components'
import { SACHET_ITEMS_CREATE_ERROR } from '../../../../../constants/errorMessages'
import { CREATE_SACHET_ITEM } from '../../../../../graphql'
import { validators } from '../../../../../utils/validators'
import { StyledInputGroup } from '../styled'
import { DELETE_SACHET_ITEM_UNIT_CONVERSION } from '../../../../../graphql/mutations'

const address = 'apps.inventory.views.forms.item.tunnels.configuresachettunnel.'

export default function ConfigureSachetTunnel({
   close,
   procId,
   unit,
   openLinkConversionTunnel,
   selectedConversions,
}) {
   const { t } = useTranslation()

   const [quantity, setQuantity] = useState({
      value: '',
      meta: { isValid: false, isTouched: false, errors: [] },
   })
   const [par, setPar] = useState({
      value: '',
      meta: { isValid: false, isTouched: false, errors: [] },
   })
   const [maxInventoryLevel, setMaxInventoryLevel] = useState({
      value: '',
      meta: { isValid: false, isTouched: false, errors: [] },
   })

   const [creatSachetItem, { loading }] = useMutation(CREATE_SACHET_ITEM, {
      onCompleted: () => {
         close(1)
         toast.info('Sachet added!')
      },
      onError: error => {
         close(1)
         logger(error)
         toast.error(SACHET_ITEMS_CREATE_ERROR)
      },
   })
   const [removeLinkedConversion] = useMutation(
      DELETE_SACHET_ITEM_UNIT_CONVERSION,
      {
         onCompleted: () => {
            toast.success('Conversion removed!')
         },
         onError: error => {
            logger(error)
            toast.error('Something went wrong!')
         },
      }
   )

   const checkValues = () => {
      if (!par.value || (!par.meta.isValid && par.meta.isTouched))
         return 'invalid par level value'
      if (
         !maxInventoryLevel.value ||
         (!maxInventoryLevel.meta.isValid && maxInventoryLevel.meta.isTouched)
      )
         return 'invalid max inventory level value'
      if (
         !quantity.value ||
         (!quantity.meta.isValid && quantity.meta.isTouched)
      )
         return 'invalid quantity'
      return true
   }

   const handleNext = () => {
      const checkIsValid = checkValues()
      if (!checkIsValid.length)
         creatSachetItem({
            variables: {
               unitSize: quantity.value,
               bulkItemId: procId,
               unit,
               par: par.value,
               maxLevel: maxInventoryLevel.value,
            },
         })
      else toast.error(checkIsValid)
   }

   return (
      <>
         <TunnelHeader
            title={t(address.concat('add sachet'))}
            close={() => close(1)}
            right={{
               title: loading ? 'Saving...' : 'Save',
               action: handleNext,
            }}
            description="add sachet items"
            tooltip={
               <Tooltip identifier="supplier_item_form_add_sachet_items_tunnel" />
            }
         />
         <TunnelContainer>
            <StyledInputGroup>
               <Form.Group>
                  <Form.Label htmlFor="quantity" title="sachetQuantity">
                     <Flex container alignItems="center">
                        Sachet Quantity (in {unit})*
                        <Tooltip identifier="supplier_form_add_sachet_quantity_formfield" />
                     </Flex>
                  </Form.Label>
                  <Form.Number
                     id="quantity"
                     name="quantity"
                     value={quantity.value}
                     placeholder={`Sachet Quantity (in ${unit})`}
                     onChange={e =>
                        setQuantity({
                           value: e.target.value,
                           meta: { ...quantity.meta },
                        })
                     }
                     onBlur={e => {
                        const { isValid, errors } = validators.quantity(
                           e.target.value
                        )

                        setQuantity({
                           value: e.target.value,
                           meta: { isValid, errors, isTouched: true },
                        })
                     }}
                  />
                  {quantity.meta.isTouched && !quantity.meta.isValid && (
                     <Form.Error>{quantity.meta.errors[0]}</Form.Error>
                  )}
               </Form.Group>
            </StyledInputGroup>

            <Spacer size="16px" />
            <Select
               options={selectedConversions || []}
               addOption={() => openLinkConversionTunnel(1)}
               placeholder="Link Conversions"
               removeOption={option =>
                  removeLinkedConversion({
                     variables: { id: option.id },
                  })
               }
            />
            <Spacer size="16px" />

            <StyledInputGroup>
               <Form.Group>
                  <Form.Label title="parLevel" htmlFor="par">
                     <Flex container alignItems="center">
                        {t(address.concat('set par level'))} (packets)*
                        <Tooltip identifier="supplier_form_add_sachet_parLevel_formfield" />
                     </Flex>
                  </Form.Label>

                  <Form.Number
                     id="par"
                     name="par"
                     value={par.value}
                     placeholder={t(address.concat('set par level'))}
                     onChange={e =>
                        setPar({ value: e.target.value, meta: { ...par.meta } })
                     }
                     onBlur={e => {
                        const { errors, isValid } = validators.quantity(
                           e.target.value
                        )
                        setPar({
                           value: e.target.value,
                           meta: { isValid, errors, isTouched: true },
                        })
                     }}
                  />
                  {par.meta.isTouched && !par.meta.isValid && (
                     <Form.Error>{par.meta.errors[0]}</Form.Error>
                  )}
               </Form.Group>
               <Form.Group>
                  <Form.Label title="maxLevel" htmlFor="maxLevel">
                     <Flex container alignItems="center">
                        {t(address.concat('max inventory level'))}*
                        <Tooltip identifie="supplier_form_add_sachet_maxLevel_formfield" />
                     </Flex>
                  </Form.Label>
                  <Form.Number
                     id="maxLevel"
                     name="maxLevel"
                     placeholder={t(address.concat('max inventory level'))}
                     value={maxInventoryLevel.value}
                     onChange={e =>
                        setMaxInventoryLevel({
                           value: e.target.value,
                           meta: { ...maxInventoryLevel.meta },
                        })
                     }
                     onBlur={e => {
                        const { isValid, errors } = validators.quantity(
                           e.target.value
                        )
                        setMaxInventoryLevel({
                           value: e.target.value,
                           meta: { isValid, errors, isTouched: true },
                        })
                     }}
                  />
                  {maxInventoryLevel.meta.isTouched &&
                     !maxInventoryLevel.meta.isValid && (
                        <Form.Error>
                           {maxInventoryLevel.meta.errors[0]}
                        </Form.Error>
                     )}
               </Form.Group>
            </StyledInputGroup>
         </TunnelContainer>
      </>
   )
}
