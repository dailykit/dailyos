import React from 'react'
import { Link, animateScroll as scroll } from 'react-scroll'
import { ArrowDownIcon, ArrowRightIcon, Text } from '@dailykit/ui'
import { Container } from '../styled'
import { StyledContainer, List, Icon, Accordion } from './styled'
import { NOTIFICATION_TYPES } from '../../../../graphql/subscriptions'
import { useSubscription } from '@apollo/react-hooks'
import { Loader } from '../../../../components'

const SideNav = () => {
   const { loading, error, data } = useSubscription(NOTIFICATION_TYPES)
   if (loading)
      return (
         <StyledContainer>
            <Loader />
         </StyledContainer>
      )
   if (error) return <StyledContainer>{error.message}</StyledContainer>
   const apps = [...new Set(data.notificationTypes.map(row => row.app))]

   return (
      <StyledContainer>
         <Container paddingY="32">
            <List>
               {apps.map(app => {
                  const content = data.notificationTypes.filter(
                     row => row.app == app
                  )
                  return (
                     <>
                        <Link
                           to={app}
                           activeClass="active"
                           spy={true}
                           smooth={true}
                           offset={-70}
                           duration={500}
                        >
                           {app} App
                           <Icon>
                              <ArrowDownIcon />
                           </Icon>
                        </Link>
                        <Accordion>
                           {content.map(row => (
                              <List>
                                 <Link
                                    to={row.template.title}
                                    activeClass="active"
                                    spy={true}
                                    smooth={true}
                                    offset={-70}
                                    duration={500}
                                 >
                                    <Text as="subtitle">
                                       {row.template.title}
                                    </Text>
                                 </Link>
                              </List>
                           ))}
                        </Accordion>
                     </>
                  )
               })}
            </List>
         </Container>
      </StyledContainer>
   )
}

export default SideNav
