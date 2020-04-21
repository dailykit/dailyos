import React, { useState, useContext } from 'react'
import { Input, Text } from '@dailykit/ui'

import { SupplierContext } from '../../../../context/supplier'

import { TunnelContainer, TunnelHeader, Spacer } from '../../../../components'
import { FlexContainer } from '../../styled'
import { CircleButton } from '../styled'
import { Camera } from '../../../../assets/icons'

export default function PersonContactTunnel({ close }) {
   const {
      supplierState: {
         contact: {
            firstName: oldFirstName,
            lastName: oldLastName,
            email: oldEmail,
            phoneNumber: oldPhoneNumber,
            countryCode: oldCountryCode,
         },
      },
      supplierDispatch,
   } = useContext(SupplierContext)

   const [firstName, setFirstName] = useState(oldFirstName || '')
   const [lastName, setLastName] = useState(oldLastName || '')
   const [email, setEmail] = useState(oldEmail || '')
   const [phoneNumber, setPhoneNumber] = useState(oldPhoneNumber || '')
   const [countryCode, setCountryCode] = useState(oldCountryCode || '')

   return (
      <TunnelContainer>
         <TunnelHeader
            title="Add Person of Contact"
            next={() => {
               supplierDispatch({
                  type: 'ADD_CONTACT',
                  payload: {
                     firstName,
                     lastName,
                     email,
                     countryCode,
                     phoneNumber,
                  },
               })
               close(2)
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
                     placeholder="First name"
                     type="text"
                     value={firstName}
                     onChange={e => setFirstName(e.target.value)}
                  />
                  <div style={{ width: '15px' }} />
                  <Input
                     name="lastName"
                     placeholder="Last name"
                     type="text"
                     value={lastName}
                     onChange={e => setLastName(e.target.value)}
                  />
               </FlexContainer>

               <br />

               <Input
                  name="email"
                  label="email"
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
               />

               <br />

               <Text as="subtitle">Phone number</Text>
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
                     placeholder="10 digit phone number"
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
