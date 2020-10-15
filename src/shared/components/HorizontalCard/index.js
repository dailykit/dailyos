import React from 'react'
import { Text, ComboButton, Card, Flex } from '@dailykit/ui'
import { StyledCard, StyledInfo } from './styled'
import { EditIcon } from '../../assets/icons'
import { Tooltip } from '../Tooltip'

const HorizontalStyledCard = ({ data, open, altMessage, identifier }) => {
   return (
      <StyledCard>
         <Flex container justifyContent="space-between">
            <Flex container alignItems="flex-start">
               <Card.Title>Basic Information</Card.Title>
               <Tooltip identifier={identifier} />
            </Flex>
            <ComboButton type="outline" onClick={() => open(1)}>
               <EditIcon color="#00a7e1" />
               Edit
            </ComboButton>
         </Flex>
         <Flex container>
            <Card.Img src={data.image} alt={altMessage} />
            <StyledInfo>
               <Card>
                  <Card.Body>
                     <Card.Text>
                        <Card.Stat>
                           <Text as="title">Title :</Text>
                           <Text as="subtitle">{data.title}</Text>
                        </Card.Stat>
                        <Card.Stat>
                           <Text as="title">Description :</Text>
                           <Text as="subtitle">{data.description}</Text>
                        </Card.Stat>
                     </Card.Text>
                  </Card.Body>
               </Card>
            </StyledInfo>
         </Flex>
      </StyledCard>
   )
}

export default HorizontalStyledCard
