import styled from 'styled-components'

export const StyledWrapper = styled.div`
   padding: 16px;
`

export const StyledLayout = styled.div`
   display: grid;
   grid-template-columns: 270px 1fr;
   grid-gap: 16px;
   padding: 12px;
`

export const StyledPanel = styled.div`
   background: #fff;
   padding: 24px;

   h2 {
      font-weight: 500;
      font-size: 24px;
      line-height: 28px;
      color: #555b6e;
      margin-bottom: 8px;
   }

   h5 {
      color: #555b6e;
      font-weight: 500;
      font-size: 16px;
      line-height: 14px;
      margin-bottom: 16px;
   }
`

export const StyledListing = styled.div`
   display: flex;
   flex-direction: column;
`

export const StyledListingTile = styled.div`
   background: ${props => (props.active ? '#555B6E' : '#fff')};
   padding: 8px;
   margin-bottom: 12px;
   color: ${props => (props.active ? '#fff' : '#555B6E')};

   h3 {
      font-weight: 500;
      font-size: 16px;
      line-height: 14px;
   }
`

export const StyledTabs = styled.div`
   display: flex;
   margin: 8px 0;
   border-bottom: 1px solid rgba(136, 141, 157, 0.3);
`

export const StyledTab = styled.div`
   padding: 12px 8px;
   margin-right: 16px;
   font-weight: 500;
   font-size: 16px;
   line-height: 14px;
   color: ${props => (props.active ? '#00A7E1' : '#888D9D')};
   border-bottom: ${props => (props.active ? '3px solid #00A7E1' : 'none')};
   cursor: pointer;
`

export const StyledTabView = styled.div`
   padding: 16px;
   position: relative;
`

export const StyledAction = styled.div`
   position: absolute;
   right: 16px;
   top: 16px;
   text-align: center;
`

export const StyledTable = styled.table`
   width: ${props => (props.full ? '100%' : 'auto')};

   thead {
      font-weight: 500;
      font-size: 14px;
      line-height: 14px;
      color: #888d9d;

      th {
         padding: 16px 8px;
         min-width: 100px;
         text-align: left;
      }
   }

   tbody {
      border: 1px solid #ececec;

      tr {
         td {
            min-width: 60px;
            font-weight: 500;
            font-size: 14px;
            line-height: 14px;
            color: #555b6e;
            padding: 8px;
         }
      }
   }
`

export const StyledDefault = styled.span`
   padding: 2px;
   background: linear-gradient(180deg, #28c1f7 -4.17%, #00a7e1 100%);
   color: #fff;
   text-transform: uppercase;
   font-size: 12px;
   font-weight: normal;
`

export const StyledInputWrapper = styled.div`
   width: ${props => props.width}px;
   display: flex;
   align-items: center;
   text-align: center;

   span {
      cursor: pointer;
   }
`

export const Grid = styled.div`
   display: grid;
   grid-template-columns: repeat(${props => props.cols || 2}, 1fr);
   grid-gap: ${props => props.gap || 8}px;
`
