import React from 'react'
import { Link, animateScroll as scroll } from 'react-scroll'
import { ArrowDownIcon, ArrowRightIcon, Text } from '@dailykit/ui'
import { Container } from '../styled'
import { StyledContainer, List, Icon, Accordion } from './styled'
import { NOTIFICATIONS } from '../../../../graphql/subscriptions'
import { useSubscription } from '@apollo/react-hooks'
import { Loader } from '../../../../components'

const SideNav = () => {
   const { loading, error, data } = useSubscription(NOTIFICATIONS)
   if (loading)
      return (
         <StyledContainer>
            <Loader />
         </StyledContainer>
      )
   if (error) return <StyledContainer>{error.message}</StyledContainer>
   const orders = data.notificationTypes.filter(row => {
      return row.app == 'Order'
   })
   const recipes = data.notificationTypes.filter(row => {
      return row.app == 'Recipe'
   })
   const settings = data.notificationTypes.filter(row => {
      return row.app == 'Setting'
   })

   return (
      <StyledContainer>
         <Container paddingY="32">
            <List>
               <Link
                  to="order"
                  activeClass="active"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
               >
                  Order App{' '}
                  <Icon>
                     <ArrowDownIcon />
                  </Icon>
               </Link>
               <Accordion>
                  {orders.map(row => (
                     <List>
                        <Link
                           to={row.template.title}
                           activeClass="active"
                           spy={true}
                           smooth={true}
                           offset={-70}
                           duration={500}
                        >
                           <Text as="subtitle">{row.template.title}</Text>
                        </Link>
                     </List>
                  ))}
               </Accordion>

               <Link
                  to="setting"
                  activeClass="active"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
               >
                  Settings App
                  <Icon>
                     <ArrowDownIcon />
                  </Icon>
               </Link>
               {settings.map(row => (
                  <Link
                     to={row.template.title}
                     activeClass="active"
                     spy={true}
                     smooth={true}
                     offset={-70}
                     duration={500}
                  >
                     <Text as="p">{row.template.title}</Text>
                  </Link>
               ))}
               <Link
                  to="recipe"
                  activeClass="active"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
               >
                  Recipe App
                  <Icon>
                     <ArrowDownIcon />
                  </Icon>
               </Link>
               <Accordion>
                  {recipes.map(row => (
                     <Link
                        to={row.template.title}
                        activeClass="active"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                     >
                        <Text as="subtitle">{row.template.title}</Text>
                     </Link>
                  ))}
               </Accordion>
            </List>
         </Container>
      </StyledContainer>
   )
}

export default SideNav
