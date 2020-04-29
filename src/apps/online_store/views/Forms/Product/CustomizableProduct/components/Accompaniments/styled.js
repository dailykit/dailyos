import styled from 'styled-components'

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
`
