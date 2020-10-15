import React from 'react'
import { Text, IconButton, Card, Flex } from '@dailykit/ui'
import { StyledCard, StyledInfo } from './styled'
import { EditIcon } from '../../assets/icons'

const HorizontalStyledCard = ({ data, open, altMessage }) => {
   return (
      <StyledCard>
         <Flex container justifyContent="space-between">
            <Card.Title>Basic Information</Card.Title>
            <IconButton type="ghost" onClick={() => open(1)}>
               <EditIcon color="#00a7e1" />
            </IconButton>
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
