import styled from 'styled-components'

export const StyledWrapper = styled.div`
   width: 100%;
   background: #ffffff;
`
export const StyledContainer = styled.div`
   display: flex;
   flex-direction: row;
`
export const StyledDiv = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr 1fr;
`
export const StyledTable = styled.div`
   //    padding: 0 32px 20em 32px;paddingpaddingpadding
   background: #ffffff;backgroundbackground
   width: 97%;width
   border-top: 1px solid #ececec;
`
export const StyledSideBar = styled.div`
   width: 30%;
`
export const StyledMainBar = styled.div`
   width: 70%;
   display: flex;
   flex-direction: column;
   margin-right: 16px;
`

export const SideCard = styled.div`
   background: rgba(243, 243, 243, 0.4);
   border: 1px solid #ececec;
   box-sizing: border-box;
   padding: 16px;
   //    margin: 0 32px 16px 0;marginmarginmargin
`
export const Card = styled.div`
   padding: 16px;
`
export const CardInfo = styled.div`
   padding: 8px;
   background: ${props => props.bgColor || '#ffffff'};
   display: flex;
   flex-direction: row;
   justify-content: space-between;
`

export const StyledInput = styled.input`
   color: #00a7e1;
   cursor: pointer;
   border: none;
   background: none;
   font-size: inherit;
`
