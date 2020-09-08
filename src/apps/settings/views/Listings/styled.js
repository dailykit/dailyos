import styled from 'styled-components'

export const StyledWrapper = styled.div`
   margin: 0 auto;
   padding: 0 20px;
   overflow-y: auto;
   max-width: 980px;
   width: calc(100vw - 40px);
   height: calc(100vh - 40px);
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
