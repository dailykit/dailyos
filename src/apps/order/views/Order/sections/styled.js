import styled from 'styled-components'

export const StyledButton = styled.button`
   color: #fff;
   height: 32px;
   border: none;
   padding: 0 12px;
   cursor: pointer;
   border-radius: 6px;
   background: #53c22b;
`

export const StyledLabelPreview = styled.section`
   margin-top: 16px;
   header {
      display: flex;
      align-items: center;
      justify-content: space-between;
   }
   h3 {
      font-size: 18px;
      font-weight: 400;
      color: #555b6e;
   }
   div {
      width: 100%;
      margin-top: 8px;
      background: #fff;
      overflow: hidden;
      border-radius: 6px;
   }
`
