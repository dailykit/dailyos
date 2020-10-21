import styled from 'styled-components'

export const ItemInfo = styled.div`
   height: 4rem;
   padding: 0.5rem;
   display: flex;
   align-items: center;
   position: relative;

   img {
      height: 2.8rem;
      width: 2.8rem;
      object-fit: cover;
      border-radius: 2px;
      margin-right: 0.5rem;
   }

   h3 {
      font-weight: normal;
      text-align: left;
      width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
   }

   button {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: none;
      border: none;
      cursor: pointer;
   }

   label {
      position: absolute;
      bottom: 0.5rem;
      right: 0.5rem;
      color: #00a7e1;
      text-transform: uppercase;
      font-size: 12px;
   }
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
   position: relative;

   h2 {
      font-weight: 500;
      font-size: 24px;
      line-height: 28px;
      color: #555b6e;
      margin-bottom: 16px;
   }
`

export const StyledLink = styled.span`
   margin-left: 8px;
   cursor: pointer;
`

export const StyledListing = styled.div`
   display: flex;
   flex-direction: column;
`

export const StyledListingTile = styled.div`
   background: ${props => (props.active ? '#555B6E' : '#fff')};
   padding: 16px;
   margin-bottom: 12px;
   color: ${props => (props.active ? '#fff' : '#555B6E')};
   display: flex;
   align-items: center;
   cursor: pointer;
   height: 80px;
   position: relative;

   h3 {
      font-weight: 500;
      font-size: 16px;
      line-height: 14px;
      margin-bottom: 8px;
   }

   span {
      position: absolute;
      top: 8px;
      right: 8px;
   }
`

export const StyledDefault = styled.div`
   padding: 2px;
   color: #fff;
   background: #00a7e1;
   position: absolute;
   bottom: 8px;
   right: 8px;
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
`

export const StyledTable = styled.table`
   width: ${props => (props.full ? '100%' : 'auto')};

   thead {
      font-weight: 500;
      font-size: 12px;
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
            min-width: 100px;
            font-weight: 500;
            font-size: 14px;
            line-height: 14px;
            color: #555b6e;
            padding: 8px;

            &:first-child {
               font-weight: 500;
               font-size: 16px;
               line-height: 14px;
               color: #555b6e;
               display: flex;

               span {
                  margin-left: 8px;
               }
            }
         }
      }
   }
`
