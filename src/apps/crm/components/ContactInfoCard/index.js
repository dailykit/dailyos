/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { Text } from '@dailykit/ui'
import {
   ContactCard,
   CustomerAddress,
   ContactInfo,
   StyledHeading,
   SmallText,
} from './styled'
import { MailIcon, PhoneIcon } from '../../../../shared/assets/icons'
import { ConcatAddress } from '../../views/Forms/Utils'

const contactInfoCard = props => (
   <ContactCard>
      <StyledHeading>
         <Text as="subtitle">Contact Details{props.defaultTag1}</Text>
         <SmallText onClick={props.onClick}>view all address</SmallText>
      </StyledHeading>
      <ContactInfo>
         <Text as="title">{props?.customerData?.email || 'N/A'}</Text>
         <MailIcon color="#00a7e1" />
      </ContactInfo>
      <ContactInfo>
         <Text as="title">{props?.customerData?.phoneNumber || 'N/A'}</Text>
         <PhoneIcon color="#00a7e1" />
      </ContactInfo>
      <CustomerAddress>
         <Text as="subtitle">Delivery Address{props.defaultTag2}</Text>
         <Text as="title">
            {ConcatAddress(
               props?.customerData?.defaultCustomerAddress || 'N/A'
            )}
         </Text>
      </CustomerAddress>
   </ContactCard>
)
export default contactInfoCard
