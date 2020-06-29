import PhoneInput from 'react-phone-input-2'
import { Input, Text, Loader, TunnelHeader } from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import 'react-phone-input-2/lib/style.css'

import { Camera } from '../../../../assets/icons'
import { TunnelContainer } from '../../../../components'
import { FlexContainer } from '../../styled'
import { CircleButton } from '../styled'
import { UPDATE_SUPPLIER } from '../../../../graphql'

const address = 'apps.inventory.views.forms.supplier.tunnels.'

export default function PersonContactTunnel({ close, formState }) {
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
         toast.info('Contact information added!')
         close(1)
      },
      onError: error => {
         console.log(error)
         toast.error('Error, Please try again')
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
                  firstName,
                  lastName,
                  email,
                  phoneNumber,
               },
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('add person of contact'))}
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
            <FlexContainer
               style={{ width: '100%', justifyContent: 'space-between' }}
            >
               <div>
                  <FlexContainer>
                     <Input
                        name="firstName"
                        placeholder={t(address.concat('first name'))}
                        type="text"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                     />
                     <div style={{ width: '15px' }} />
                     <Input
                        name="lastName"
                        placeholder={t(address.concat('last name'))}
                        type="text"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                     />
                  </FlexContainer>

                  <br />

                  <Input
                     name="email"
                     label={t(address.concat('email'))}
                     type="text"
                     value={email}
                     onChange={e => setEmail(e.target.value)}
                  />

                  <br />

                  <Text as="subtitle">{t(address.concat('phone number'))}</Text>

                  <PhoneInput
                     country="us"
                     value={phoneNumber}
                     onChange={phone => setPhoneNumber(phone)}
                  />
               </div>

               <FlexContainer
                  style={{
                     marginLeft: '20px',
                     width: '70%',
                     justifyContent: 'center',
                  }}
               >
                  <CircleButton>
                     <Camera color="#555B6E" size="44" />
                  </CircleButton>
               </FlexContainer>
            </FlexContainer>
         </TunnelContainer>
      </>
   )
}
