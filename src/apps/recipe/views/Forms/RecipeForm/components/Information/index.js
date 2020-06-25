import React from 'react'
import {
   ButtonTile,
   IconButton,
   Tag,
   Text,
   Tunnels,
   Tunnel,
   useTunnel,
} from '@dailykit/ui'
import { EditIcon } from '../../../../../assets/icons'
import { Container, ContainerAction, Flex } from '../styled'
import { InformationTunnel } from '../../tunnels'

const Information = ({ state }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <InformationTunnel state={state} closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <>
            {state.type ||
            state.cuisine ||
            state.author ||
            state.cookingTime ||
            state.utensils?.length ||
            state.description ? (
               <Container>
                  <ContainerAction>
                     <IconButton onClick={() => openTunnel(1)}>
                        <EditIcon color="#00A7E1" />
                     </IconButton>
                  </ContainerAction>
                  <Container top="32" paddingX="32">
                     <Flex justify="space-between">
                        <div>
                           <Text as="subtitle">Type</Text>
                           <Text as="title">{state.type}</Text>
                        </div>
                        <div>
                           <Text as="subtitle">Cuisine</Text>
                           <Text as="title">{state.cuisine}</Text>
                        </div>
                        <div>
                           <Text as="subtitle">Author</Text>
                           <Text as="title">{state.author}</Text>
                        </div>
                        <div>
                           <Text as="subtitle">Cooking Time</Text>
                           <Text as="title">
                              {state.cookingTime
                                 ? `${state.cookingTime} mins.`
                                 : 'NA'}
                           </Text>
                        </div>
                     </Flex>
                  </Container>
                  <Container top="16" paddingX="32">
                     <Text as="subtitle">Utensils</Text>
                     {state.utensils?.length &&
                        state.utensils.map(utensil => (
                           <Tag key={utensil}>{utensil}</Tag>
                        ))}
                  </Container>
                  <Container top="16" paddingX="32">
                     <Text as="subtitle">Description</Text>
                     <Text as="p">{state.description}</Text>
                  </Container>
               </Container>
            ) : (
               <Container top="32" paddingX="32">
                  <ButtonTile
                     type="secondary"
                     text="Add Basic Information"
                     onClick={() => openTunnel(1)}
                  />
               </Container>
            )}
         </>
      </>
   )
}

export default Information
