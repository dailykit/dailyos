import { Input, Text, Loader } from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

import { Camera } from '../../../../assets/icons'
import { Spacer, TunnelContainer, TunnelHeader } from '../../../../components'
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
   const [countryCode, setCountryCode] = useState(
      formState.contactPerson?.countryCode || '+91'
   )

   const [updateSupplier, { loading }] = useMutation(UPDATE_SUPPLIER, {
      onCompleted: () => {
         toast.info('Contact information added!')
         close(2)
      },
      onError: error => {
         console.log(error)
         toast.error('Error, Please try again')
         close(2)
      },
   })

   if (loading) return <Loader />

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat('add person of contact'))}
            next={() => {
               updateSupplier({
                  variables: {
                     id: formState.id,
                     object: {
                        contactPerson: {
                           firstName,
                           lastName,
                           email,
                           countryCode,
                           phoneNumber,
                        },
                     },
                  },
               })
            }}
            close={() => close(2)}
            nextAction="Save"
         />

         <Spacer />

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
               <FlexContainer style={{ marginTop: '5px' }}>
                  <select
                     name="countryCodes"
                     onChange={e => {
                        setCountryCode(e.target.value)
                     }}
                  >
                     <option value="+91">+91</option>
                     <option value="+1">+1</option>
                     <option value="+97">+97</option>
                     <option value="+8">+8</option>
                  </select>
                  <div style={{ width: '10px' }} />
                  <Input
                     type="text"
                     placeholder={t(address.concat('10 digit phone number'))}
                     name="phoneNumber"
                     value={phoneNumber}
                     onChange={e => setPhoneNumber(e.target.value)}
                  />
               </FlexContainer>
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
   )
}
