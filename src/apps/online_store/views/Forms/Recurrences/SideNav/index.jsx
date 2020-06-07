import React from 'react'
import { Link, animateScroll as scroll } from 'react-scroll'

import { Container } from '../styled'
import { StyledContainer, List } from './styled'

const SideNav = ({ recurrences }) => {
   return (
      <StyledContainer>
         <Container paddingY="32" paddingX="32">
            <List>
               <Link
                  to="brand"
                  activeClass="active"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
               >
                  Brand
               </Link>
               <Link
                  to="visual"
                  activeClass="active"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
               >
                  Visual
               </Link>
               <Link
                  to="availability"
                  activeClass="active"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
               >
                  Availability
               </Link>
            </List>
         </Container>
      </StyledContainer>
   )
}

export default SideNav
