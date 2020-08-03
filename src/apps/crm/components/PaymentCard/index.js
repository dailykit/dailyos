/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { Text } from '@dailykit/ui'
import { PaymentCard, BillingAddress, CardInfo, CardInfo2 } from './styled'
import {
   MailIcon,
   PhoneIcon,
   MaestroIcon,
} from '../../../../shared/assets/icons'

const contactInfoCard = props => (
   <PaymentCard bgColor={props.bgColor} margin={props.margin}>
      <CardInfo>
         <Text as="subtitle">Payment Card</Text>
      </CardInfo>
      <CardInfo>
         <MaestroIcon size="25" />
         <Text as="subtitle">&nbsp;&nbsp;maestro</Text>
      </CardInfo>
      <CardInfo>
         <Text as="p">{props.cardNumber}</Text>
      </CardInfo>

      <CardInfo2>
         <Text as="p" className="date">
            {props.cardDate}
         </Text>
         <Text as="p">{props.cardCVV}</Text>
      </CardInfo2>
      <BillingAddress>
         <Text as="subtitle">Billing Address</Text>
         <Text as="title">{props.address}</Text>
      </BillingAddress>
   </PaymentCard>
)
export default contactInfoCard
