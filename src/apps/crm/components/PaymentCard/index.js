/* eslint-disable react/destructuring-assignment */
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
import { Capitalize } from '../../views/Forms/Utils'

const contactInfoCard = props => (
   <PaymentCard bgColor={props.bgColor} margin={props.margin}>
      <CardInfo2>
         <Text as="subtitle">Payment Card{props.defaultTag}</Text>
         <SmallText onClick={props.onClick}>{props.linkedTo}</SmallText>
      </CardInfo2>
      <CardInfo>
         <MaestroIcon size="25" />
         <Text as="subtitle">
            &nbsp;&nbsp;{Capitalize(props?.cardData?.brand || 'N/A')}
         </Text>
      </CardInfo>
      <CardInfo>
         <Text as="p">{`XXXX XXXX XXXX ${
            props?.cardData?.last4 || 'N/A'
         }`}</Text>
      </CardInfo>

      <CardInfo>
         <Text as="p" className="date">
            {`${props?.cardData?.expMonth || 'N'}/${
               props?.cardData?.expYear || 'A'
            }`}
         </Text>
      </CardInfo>
      <BillingAddress display={props.billingAddDisplay}>
         <Text as="subtitle">Billing Address</Text>
         <Text as="title">{props?.address || 'N/A'}</Text>
      </BillingAddress>
   </PaymentCard>
)
export default contactInfoCard
