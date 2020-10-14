import React from 'react'
import styled from 'styled-components'
import { Text } from '@dailykit/ui'

import { FlexContainer } from '../../views/Forms/styled'

export default function ContactCard({ name }) {
   return (
      <StyledCard>
         <FlexContainer style={{ alignItems: 'center' }}>
            {/* <StyledImage src={image} alt="person" /> */}
            <Text as="subtitle">{name}</Text>
         </FlexContainer>
         {/* <FlexContainer style={{ alignItems: 'center' }}>
            <MessageBlue size='24' color='#D9E9F1' />
            <span style={{ width: '10px' }} />
            <Call size='24' color='#D9E9F1' />
         </FlexContainer> */}
      </StyledCard>
   )
}

const StyledCard = styled.div`
   width: 80%;
   margin: 0 auto;
   margin-top: 20px;
   display: flex;
   justify-content: space-between;
   padding: 10px;
   background-color: #f3f3f3;
`
// const StyledImage = styled.img`
//    border-radius: 50%;
//    width: 32px;
//    height: 32px;
//    margin-right: 10px;
// `
