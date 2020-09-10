import React from 'react'
import { Text, IconButton, Card } from '@dailykit/ui'
import { StyledWrapper, StyledCard, StyledInfo, HorizontalCard } from './styled'
import { EditIcon } from '../../assets/icons'

const HorizontalStyledCard = ({ data, open }) => {
   return (
      <StyledCard>
         <StyledWrapper>
            <Text as="title">Basic Information</Text>
            <IconButton type="outline" onClick={() => open(1)}>
               <EditIcon />
            </IconButton>
         </StyledWrapper>
         <HorizontalCard>
            <img src={data.image} alt="CardImage" />
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
         </HorizontalCard>
      </StyledCard>
   )
}

export default HorizontalStyledCard
