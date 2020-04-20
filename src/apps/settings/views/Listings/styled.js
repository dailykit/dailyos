import styled from 'styled-components'

export const StyledWrapper = styled.div`
   margin: 0 auto;
   max-width: 1280px;
   h1 {
      color: #555b6e;
      font-size: 20px;
      font-weight: 500;
      line-height: 23px;
   }
   table {
      width: 980px;
      margin: 0 auto;
   }
`

export const StyledHeader = styled.div`
   height: 80px;
   display: flex;
   align-items: center;
   justify-content: space-between;
`

export const StyledBadge = styled.span`
   border: 1px solid #555b6e;
   height: 24px;
   border-radius: 24px;
   padding: 0 6px;
   font-size: 14px;
`
