import React from 'react'
import styled from 'styled-components'
import { Text } from '@dailykit/ui'

import { FlexContainer } from '../../views/Forms/styled'

export default function AddressCard({ city, zip, address, image }) {
   return (
      <StyledCard>
         <FlexContainer style={{ alignItems: 'center' }}>
            {image && <StyledImage src={image} alt="person" />}
            {address && <Text as="subtitle">{address}.</Text>}
            {city && zip && <Text as="subtitle">{`${city}, ${zip}`}</Text>}
         </FlexContainer>
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
const StyledImage = styled.img`
   width: 80px;
   height: 50px;
   margin-right: 10px;
`
