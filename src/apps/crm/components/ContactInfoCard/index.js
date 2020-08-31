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
import { ConcatAddress } from '../../Utils'

const contactInfoCard = ({
   defaultTag1,
   onClick,
   defaultTag2,
   customerData,
}) => (
   <ContactCard>
      <StyledHeading>
         <Text as="subtitle">Contact Details{defaultTag1}</Text>
         <SmallText onClick={onClick}>view all address</SmallText>
      </StyledHeading>
      <ContactInfo>
         <Text as="title">{customerData?.email || 'N/A'}</Text>
         <MailIcon color="#00a7e1" />
      </ContactInfo>
      <ContactInfo>
         <Text as="title">{customerData?.phoneNumber || 'N/A'}</Text>
         <PhoneIcon color="#00a7e1" />
      </ContactInfo>
      <CustomerAddress>
         <Text as="subtitle">Delivery Address{defaultTag2}</Text>
         <Text as="title">
            {ConcatAddress(customerData?.defaultCustomerAddress || 'N/A')}
         </Text>
      </CustomerAddress>
   </ContactCard>
)
export default contactInfoCard
