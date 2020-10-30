import { useMutation } from '@apollo/react-hooks'
import {
   Flex,
   Form,
   Text,
   Tunnel,
   TunnelHeader,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { toast } from 'react-toastify'
import { InlineLoader } from '../../../../../../shared/components'
import { logger } from '../../../../../../shared/utils'
import { Camera } from '../../../../assets/icons'
import { TunnelContainer } from '../../../../components'
import { GENERAL_ERROR_MESSAGE } from '../../../../constants/errorMessages'
import { SUPPLIER_CONTACT_INFO_ADDED } from '../../../../constants/successMessages'
import { UPDATE_SUPPLIER } from '../../../../graphql'
import { CircleButton } from '../styled'
import PhotoTunnel from './PhotoTunnel'

const address = 'apps.inventory.views.forms.supplier.tunnels.'

export default function PersonContactTunnel({ close, formState }) {
   const [photoTunnel, openPhotoTunnel, closePhotoTunnel] = useTunnel(1)

   const { t } = useTranslation()

   const [firstName, setFirstName] = useState(
      formState.contactPerson?.firstName || ''
   )
   const [lastName, setLastName] = useState(
      formState.contactPerson?.lastName || ''
   )
   const [email, setEmail] = useState(formState.contactPerson?.email || '')
   const [phoneNumber, setPhoneNumber] = useState(
      formState.contactPerson?.phoneNumber || ''
   )

   const [updateSupplier, { loading }] = useMutation(UPDATE_SUPPLIER, {
      onCompleted: () => {
         toast.info(SUPPLIER_CONTACT_INFO_ADDED)
         close(1)
      },
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
         close(1)
      },
   })

   const handleNext = () => {
      if (!firstName || !lastName) return toast.error('Fill the form properly')

      updateSupplier({
         variables: {
            id: formState.id,
            object: {
               contactPerson: {
                  ...formState.contactPerson,
                  firstName,
                  lastName,
                  email,
                  phoneNumber,
               },
            },
         },
      })
   }

   if (loading) return <InlineLoader />

   return (
      <>
         <Tunnels tunnels={photoTunnel}>
            <Tunnel layer={1}>
               <PhotoTunnel close={closePhotoTunnel} formState={formState} />
            </Tunnel>
         </Tunnels>
         <TunnelHeader
            title={t(address.concat('add person of contact'))}
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
            <Flex container justifyContent="space-between" width="100%">
               <div>
                  <Flex container>
                     <Form.Group>
                        <Form.Label htmlFor="firstName" title="firstName">
                           {t(address.concat('first name'))}
                        </Form.Label>
                        <Form.Text
                           name="firstName"
                           id="firstName"
                           value={firstName}
                           onChange={e => setFirstName(e.target.value)}
                        />
                     </Form.Group>
                     <span style={{ width: '8px' }} />
                     <Form.Group>
                        <Form.Label htmlFor="lastName" title="lastName">
                           {t(address.concat('last name'))}
                        </Form.Label>
                        <Form.Text
                           id="lastName"
                           name="lastName"
                           value={lastName}
                           onChange={e => setLastName(e.target.value)}
                        />
                     </Form.Group>
                  </Flex>

                  <br />

                  <Form.Group>
                     <Form.Label htmlFor="email" title="email">
                        {t(address.concat('email'))}
                     </Form.Label>
                     <Form.Text
                        id="email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                     />
                  </Form.Group>

                  <br />

                  <Text as="subtitle">{t(address.concat('phone number'))}</Text>

                  <PhoneInput
                     country="us"
                     value={phoneNumber}
                     onChange={phone => setPhoneNumber(phone)}
                  />
               </div>

               <Flex
                  container
                  margin="0 0 0 20px"
                  width="70%"
                  justifyContent="center"
               >
                  <CircleButton onClick={() => openPhotoTunnel(1)}>
                     {formState.contactPerson?.imageUrl ? (
                        <img
                           src={formState.contactPerson.imageUrl}
                           alt="profile"
                        />
                     ) : (
                        <Camera color="#555B6E" size="44" />
                     )}
                  </CircleButton>
               </Flex>
            </Flex>
         </TunnelContainer>
      </>
   )
}
