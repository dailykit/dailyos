import styled from 'styled-components'

export const StyledLayout = styled.div`
   display: grid;
   grid-template-columns: 20vw 1fr;
`

export const Grid = styled.div`
   display: grid;
   grid-template-columns: repeat(${props => props.cols || 2}, 1fr);
   grid-gap: ${props => props.gap}em;
`

export const Container = styled.div`
   margin-top: ${props => props.top || 0}vh;
   margin-bottom: ${props => props.bottom || 0}px;
   margin-left: ${props => props.left || 0}px;
   margin-right: ${props => props.right || 0}px;
   padding-left: ${props => props.paddingX || 0}px;
   padding-right: ${props => props.paddingX || 0}px;
   padding-top: ${props => props.paddingY || 0}px;
   padding-bottom: ${props => props.paddingY || 0}px;
   width: ${props => (props.width ? props.width + 'px' : 'auto')};
   height: ${props => (props.height ? props.height + 'vh' : 'auto')};
   max-width: ${props => (props.maxWidth ? props.maxWidth + 'px' : '100%')};
   background-color: ${props => (props.color ? props.color : 'white')};
   flex: 4;
`

export const Flex = styled.div`
   display: flex;
   flex-direction: ${props => props.direction || 'column'};
   justify-content: ${props => props.justify || 'flex-start'};
   align-items: ${props => props.align || 'flex-start'};
   flex: ${props => props.flex || '1'};
`

export const TunnelBody = styled.div`
   padding: 32px;
   height: calc(100% - 106px);
   overflow: auto;
`

export const Link = styled.a`
   color: black;
   text-decoration: none;
   padding: 30px;
`
