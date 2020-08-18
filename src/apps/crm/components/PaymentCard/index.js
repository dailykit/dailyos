import React from 'react'
import { Text } from '@dailykit/ui'
import {
   PaymentCard,
   BillingAddress,
   CardInfo,
   CardInfo2,
   SmallText,
} from './styled'
import { MaestroIcon } from '../../../../shared/assets/icons'
import { capitalizeString } from '../../Utils'

const ContactInfoCard = ({
   bgColor,
   margin,
   defaultTag,
   onClick,
   linkedTo,
   smallText,
   cardData,
   billingAddDisplay,
}) => (
   <PaymentCard bgColor={bgColor} margin={margin}>
      <CardInfo2>
         <Text as="subtitle">Payment Card{defaultTag}</Text>
         <SmallText onClick={onClick}>{linkedTo}</SmallText>
      </CardInfo2>
      <CardInfo>
         <MaestroIcon size="25" />
         <Text as="subtitle">
            &nbsp;&nbsp;{capitalizeString(cardData?.brand || 'N/A')}
         </Text>
      </CardInfo>
      <CardInfo>
         <Text as="p">{`XXXX XXXX XXXX ${cardData?.last4 || 'N/A'}`}</Text>
      </CardInfo>

      <CardInfo2>
         <Text as="p" className="date">
            {`${cardData?.expMonth || 'N'}/${cardData?.expYear || 'A'}`}
         </Text>
         <SmallText onClick={onClick}>{smallText}</SmallText>
      </CardInfo2>
      <BillingAddress display={billingAddDisplay}>
         <Text as="subtitle">Billing Address</Text>
         <Text as="title">N/A</Text>
      </BillingAddress>
   </PaymentCard>
)
export default ContactInfoCard
