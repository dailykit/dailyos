import React from 'react'
import { Link, animateScroll as scroll } from 'react-scroll'

import { Container } from '../styled'
import { StyledContainer, List } from './styled'

const SideNav = () => {
   return (
      <StyledContainer>
         <Container paddingY="32" paddingX="32">
            <List>
               <Link
                  to="order"
                  activeClass="active"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
               >
                  Order App
               </Link>
               <Link
                  to="setting"
                  activeClass="active"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
               >
                  Settings App
               </Link>
               <Link
                  to="recipe"
                  activeClass="active"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
               >
                  Recipe App
               </Link>
            </List>
         </Container>
      </StyledContainer>
   )
}

export default SideNav
