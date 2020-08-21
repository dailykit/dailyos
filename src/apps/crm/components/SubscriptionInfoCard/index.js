import React from 'react'
import { Text } from '@dailykit/ui'
import { StyleContainer, StyledDiv, StyledHeading } from './styled'
import { UserIcon, CalendarIcon } from '../../../../shared/assets/icons'
import { rruleToText } from '../../Utils'

const SubscriptionCard = ({ planData }) => (
   <StyleContainer>
      <StyledHeading>
         <Text as="subtitle">Subscriber</Text>
      </StyledHeading>
      {planData.isSubscriber ? (
         <>
            <StyledDiv>
               <Text as="title">
                  {planData?.subscription?.subscriptionItemCount?.plan
                     ?.subscriptionTitle?.title || 'N/A'}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <UserIcon size="16" /> 1
               </Text>
            </StyledDiv>
            <StyledDiv>
               <Text as="title">
                  {`${
                     planData?.subscription?.subscriptionItemCount?.count ||
                     'N/A'
                  } Item Count`}
               </Text>
            </StyledDiv>
            <StyledDiv>
               <Text as="title">
                  <CalendarIcon size="14" /> &nbsp;
                  {rruleToText(planData?.subscription?.rrule)}
               </Text>
            </StyledDiv>
            <StyledDiv>
               <Text as="title">
                  {`${planData.isSubscriber ? 'Active' : 'Inactive'} Status`}
               </Text>
            </StyledDiv>
         </>
      ) : (
         <Text as="title">
            <em style={{ color: '#C4C4C4' }}>Not a subscriber yet!</em>
         </Text>
      )}
   </StyleContainer>
)
export default SubscriptionCard
