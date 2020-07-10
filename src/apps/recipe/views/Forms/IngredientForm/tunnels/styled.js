import styled from 'styled-components'

export const TunnelBody = styled.div`
   padding: 16px 32px;
   height: calc(100% - 106px);
   overflow: auto;
`

export const StyledRow = styled.div`
   margin-bottom: 32px;
`

export const SolidTile = styled.button`
   width: 70%;
   display: block;
   margin: 0 auto;
   border: 1px solid #cecece;
   padding: 10px 20px;
   border-radius: 2px;
   background-color: #fff;

   &:hover {
      background-color: #f3f3f3;
      cursor: pointer;
   }
`

export const StyledInputWrapper = styled.div`
   width: ${props => props.width}px;
   display: flex;
   align-items: center;
`

export const Grid = styled.div`
   display: grid;
   grid-template-columns: repeat(${props => props.cols || 2}, 1fr);
   grid-gap: ${props => props.gap || 8}px;
`

export const Container = styled.div`
   margin-top: ${props => props.top || 0}px;
   margin-bottom: ${props => props.bottom || 0}px;
   margin-left: ${props => props.left || 0}px;
   margin-right: ${props => props.right || 0}px;
   padding-left: ${props => props.paddingX || 0}px;
   padding-right: ${props => props.paddingX || 0}px;
   padding-top: ${props => props.paddingY || 0}px;
   padding-bottom: ${props => props.paddingY || 0}px;
   position: relative;
`

export const Flex = styled.div`
   display: flex;
   direction: ${props => props.direction || 'column'};
   justify-content: ${props => props.justify || 'space-between'};
   align-items: ${props => props.align || 'flex-start'};
`

export const InputWrapper = styled.div`
   display: flex;
   width: 100%;
   align-items: baseline;
   justify-content: space-between;
   input {
      max-width: 240px;
   }
   span {
      cursor: pointer;
   }
   > div {
      display: flex;
      span:last-child {
         margin-left: 8px;
      }
   }
`

export const StyledSelect = styled.select`
   padding: 8px;
   border: none;
   font-weight: 500;
   color: #555b6e;
   outline: none;
   font-size: 14px;
`
