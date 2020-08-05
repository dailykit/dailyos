/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { Text } from '@dailykit/ui'
import {
   ContactCard,
   CustomerAddress,
   ContactInfo,
   StyledHeading,
} from './styled'
import { MailIcon, PhoneIcon } from '../../../../shared/assets/icons'

const contactInfoCard = props => (
   <ContactCard>
      <StyledHeading>
<Text as="subtitle">Contact Details{props.defaultTag}</Text>
      </StyledHeading>
      <ContactInfo>
         <Text as="title">{props.email}</Text>
         <MailIcon color="#00a7e1" />
      </ContactInfo>
      <ContactInfo>
         <Text as="title">{props.phone}</Text>
         <PhoneIcon color="#00a7e1" />
      </ContactInfo>
      <CustomerAddress>
         <Text as="subtitle">Delivery Address</Text>
         <Text as="title">{props.address}</Text>
      </CustomerAddress>
   </ContactCard>
)
export default contactInfoCard
