import styled from 'styled-components'

export const Wrapper = styled.main`
   padding: 0 16px;
   section {
      padding-top: 16px;
      border-top: 1px solid #e3e3e3;
   }
`

export const StyledList = styled.ul`
   margin-top: 14px;
   li {
      height: 56px;
      display: flex;
      cursor: pointer;
      list-style: none;
      padding: 12px;
      align-items: center;
      border: 1px solid #e3e3e3;
      justify-content: space-between;
      :hover {
         background: rgba(220, 220, 220, 0.25);
      }
      + li {
         border-top: none;
      }
   }
`
