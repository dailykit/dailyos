import styled from 'styled-components'

export const TunnelHeader = styled.div`
   height: 76px;
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 0 16px;
   border-bottom: 1px solid #e4e4e4;

   div {
      display: flex;
      align-items: inherit;

      span {
         font-weight: 500;
         font-size: 18px;
         line-height: 21px;
         color: #555b6e;

         &:nth-child(1) {
            margin-right: 8px;
            cursor: pointer;
         }
      }
   }
`

export const TunnelBody = styled.div`
   padding: 32px;
   overflow: auto;
`

export const StyledRow = styled.div`
   margin-bottom: 32px;
`

export const StyledInputGroup = styled.div`
   display: grid;
   grid-template-columns: repeat(2, 1fr);
   grid-gap: 32px;
`

export const InputWrapper = styled.div`
   display: grid;
   grid-template-columns: 75% 25%;
   grid-gap: 8px;
`

export const Highlight = styled.div`
   border: 1px solid #ededed;
   padding: 16px;
   cursor: ${props => (props.pointer ? 'pointer' : 'default')};
`

export const StyledLabel = styled.div`
   font-weight: 500;
   font-size: 14px;
   line-height: 14px;
   color: #888d9d;
   margin-bottom: 8px;
`
