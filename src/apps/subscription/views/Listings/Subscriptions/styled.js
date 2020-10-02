import styled from 'styled-components'

export const Wrapper = styled.div`
   width: 100%;
   height: calc(100vh - 40px);
   > div {
      width: 100%;
      margin: 0 auto;
      max-width: 980px;
   }
`

export const Header = styled.header`
   display: flex;
   align-items: center;
   justify-content: space-between;
`
