import { useMutation } from '@apollo/react-hooks'
import { Flex, Form, Loader, TunnelHeader } from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { InlineLoader, Tooltip } from '../../../../../../../shared/components'
import { TunnelContainer } from '../../../../../components'
import { CREATE_SACHET_ITEM } from '../../../../../graphql'
import { StyledInputGroup } from '../styled'

const address = 'apps.inventory.views.forms.item.tunnels.configuresachettunnel.'

export default function ConfigureSachetTunnel({ close, procId, unit }) {
   const { t } = useTranslation()

   const [quantity, setQuantity] = useState('')
   const [par, setPar] = useState('')
   const [maxInventoryLevel, setMaxInventoryLevel] = useState('')

   const [creatSachetItem, { loading }] = useMutation(CREATE_SACHET_ITEM, {
      onCompleted: () => {
         close(1)
         toast.info('Sachet added!')
      },
      onError: error => {
         close(1)
         console.log(error)
         toast.error('Err! creating sachets. Please try again')
      },
   })
   const handleNext = () => {
      creatSachetItem({
         variables: {
            unitSize: quantity,
            bulkItemId: procId,
            unit,
            par,
            maxLevel: maxInventoryLevel,
         },
      })
   }

   if (loading) return <InlineLoader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('add sachet'))}
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
            <StyledInputGroup>
               <Form.Group>
                  <Form.Label htmlFor="quantity" title="sachetQuantity">
                     <Flex container alignItems="center">
                        Sachet Quantity (in {unit})
                        <Tooltip identifier="supplier_form_add_sachet_quantity_formfield" />
                     </Flex>
                  </Form.Label>
                  <Form.Number
                     id="quantity"
                     name="quantity"
                     value={quantity}
                     placeholder={`Sachet Quantity (in ${unit})`}
                     onChange={e => setQuantity(e.target.value)}
                  />
               </Form.Group>
            </StyledInputGroup>

            <br />
            <StyledInputGroup>
               <Form.Group>
                  <Form.Label title="parLevel" htmlFor="par">
                     <Flex container alignItems="center">
                        {t(address.concat('set par level'))} (packets)
                        <Tooltip identifier="supplier_form_add_sachet_parLevel_formfield" />
                     </Flex>
                  </Form.Label>

                  <Form.Number
                     id="par"
                     name="par"
                     value={par}
                     placeholder={t(address.concat('set par level'))}
                     onChange={e => setPar(e.target.value)}
                  />
               </Form.Group>
               <Form.Group>
                  <Form.Label title="maxLevel" htmlFor="maxLevel">
                     <Flex container alignItems="center">
                        {t(address.concat('max inventory level'))}
                        <Tooltip identifie="supplier_form_add_sachet_maxLevel_formfield" />
                     </Flex>
                  </Form.Label>
                  <Form.Number
                     id="maxLevel"
                     name="maxLevel"
                     placeholder={t(address.concat('max inventory level'))}
                     value={maxInventoryLevel}
                     onChange={e => setMaxInventoryLevel(e.target.value)}
                  />
               </Form.Group>
            </StyledInputGroup>
         </TunnelContainer>
      </>
   )
}
