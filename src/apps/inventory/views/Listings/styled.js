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
`

export const StyledHeader = styled.div`
   height: 80px;
   display: flex;
   align-items: center;
   justify-content: space-between;
`

export const StyledIconGroup = styled.div`
   display: flex;
   > div {
      margin-right: 4px;
   }
`

export const StyledIcon = styled.div`
   width: 32px;
   height: 32px;
   border-radius: 4px;
   background: rgba(40, 193, 247, 0.48);
`

export const StyledTableHeader = styled.div`
   height: 40px;
   display: flex;
   align-items: center;
   justify-content: space-between;
`

export const StyledTableActions = styled.div`
   display: grid;
   grid-auto-flow: column;
   grid-gap: 16px;
`
export const StyledContent = styled.div`
   margin-top: 32px;
`

export const StyledPagination = styled.div`
   color: 555b6e;
   font-size: 14px;
   span {
      margin-left: 8px;
      cursor: pointer;
   }
`

export const CellColumnContainer = styled.div`
   width: 100%;
   display: flex;
   flex-direction: column;
`

export const OnHandData = styled.span`
   color: ${({ alert, alertAndSuccess }) => {
      if (alert) return '#FF5A52'
      if (alertAndSuccess) return '#53C22B'
      return '#888D9D'
   }};
`
