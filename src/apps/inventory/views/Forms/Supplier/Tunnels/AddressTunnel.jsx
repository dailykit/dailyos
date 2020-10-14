import { useMutation } from '@apollo/react-hooks'
import { Flex, Form, Loader, TunnelHeader } from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { logger } from '../../../../../../shared/utils'
import { TunnelContainer } from '../../../../components'
import { GENERAL_ERROR_MESSAGE } from '../../../../constants/errorMessages'
import { SUPPLIER_ADDRESS_UPDATED } from '../../../../constants/successMessages'
import { UPDATE_SUPPLIER } from '../../../../graphql'

const address = 'apps.inventory.views.forms.supplier.tunnels.'

export default function AddressTunnel({ close, formState }) {
   const { t } = useTranslation()

   const [address1, setAddress1] = useState(formState.address?.address1 || '')
   const [address2, setAddress2] = useState(formState.address?.address2 || '')
   const [city, setCity] = useState(formState.address?.city || '')
   const [zip, setZip] = useState(formState.address?.zip || '')
   const [instructions, setInstructions] = useState(
      formState.address?.instructions || ''
   )

   const [updateSupplier, { loading }] = useMutation(UPDATE_SUPPLIER, {
      onCompleted: () => {
         toast.info(SUPPLIER_ADDRESS_UPDATED)
         close(1)
      },
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
         close(1)
      },
   })

   const handleNext = () => {
      if (!address1 || !city) return toast.error('Fill the form properly')

      const pushableAddress = {
         address1: address1.trim(),
         address2: address2.trim(),
         city: city.trim(),
         zip: zip.trim(),
         instructions: instructions.trim(),
      }

      updateSupplier({
         variables: {
            id: formState.id,
            object: {
               address: pushableAddress,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('add address'))}
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />

         <TunnelContainer>
            <div>
               <>
                  <br />
                  <Form.Group>
                     <Form.Label htmlFor="address1" title="address1">
                        {t(address.concat('address line 1'))}
                     </Form.Label>
                     <Form.Text
                        id="address1"
                        name="address1"
                        value={address1}
                        onChange={e => {
                           setAddress1(e.target.value)
                        }}
                     />
                  </Form.Group>
                  <br />
                  <Form.Group>
                     <Form.Label htmlFor="address2" title="address2">
                        {t(address.concat('address line 2'))}
                     </Form.Label>
                     <Form.Text
                        id="address2"
                        name="address2"
                        value={address2}
                        onChange={e => {
                           setAddress2(e.target.value)
                        }}
                     />
                  </Form.Group>
                  <br />
                  <Flex container>
                     <Form.Group>
                        <Form.Label htmlFor="city" title="city">
                           {t(address.concat('city'))}
                        </Form.Label>

                        <Form.Text
                           id="city"
                           name="city"
                           value={city}
                           onChange={e => setCity(e.target.value)}
                        />
                     </Form.Group>
                     <span style={{ width: '8px' }} />
                     <Form.Group>
                        <Form.Label htmlFor="zip" title="zip">
                           {t(address.concat('zip code'))}
                        </Form.Label>

                        <Form.Number
                           id="zip"
                           name="zip"
                           value={zip}
                           onChange={e => setZip(e.target.value)}
                        />
                     </Form.Group>
                  </Flex>
                  <br />
                  <Form.Group>
                     <Form.Label htmlFor="instructions" title="instructions">
                        {t(address.concat('special instructions'))}
                     </Form.Label>
                     <Form.TextArea
                        id="instructions"
                        name="instructions"
                        value={instructions}
                        onChange={e => setInstructions(e.target.value)}
                     />
                  </Form.Group>
               </>
            </div>
         </TunnelContainer>
      </>
   )
}
