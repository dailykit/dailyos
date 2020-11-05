import React from 'react'
import { Text, Flex } from '@dailykit/ui'
import { StyleContainer, StyledDiv, StyledHeading } from './styled'
import { UserIcon, CalendarIcon } from '../../../../shared/assets/icons'
import { rruleToText } from '../../Utils'
import { Tooltip } from '../../../../shared/components'

const SubscriptionCard = ({ planData }) => (
   <StyleContainer>
      <StyledHeading>
         <Flex container alignItems="center">
            <Text as="p">Subscriber</Text>
            <Tooltip identifier="subscriber_info" />
         </Flex>
      </StyledHeading>
      {planData.isSubscriber ? (
         <>
            <StyledDiv>
               <Text as="p">
                  {planData?.subscription?.subscriptionItemCount?.plan
                     ?.subscriptionTitle?.title || 'N/A'}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <UserIcon size="16" /> 1
               </Text>
            </StyledDiv>
            <StyledDiv>
               <Text as="p">
                  {`${
                     planData?.subscription?.subscriptionItemCount?.count ||
                     'N/A'
                  } Item Count`}
               </Text>
            </StyledDiv>
            <StyledDiv>
               <Text as="p">
                  <CalendarIcon size="14" /> &nbsp;
                  {rruleToText(planData?.subscription?.rrule)}
               </Text>
            </StyledDiv>
            <StyledDiv>
               <Text as="p">
                  {`${planData.isSubscriber ? 'Active' : 'Inactive'} Status`}
               </Text>
            </StyledDiv>
         </>
      ) : (
         <Text as="p">
            <em style={{ color: '#C4C4C4' }}>Not a subscriber yet!</em>
         </Text>
      )}
   </StyleContainer>
)
export default SubscriptionCard
