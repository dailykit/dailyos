import styled from 'styled-components'

export const StyledLoader = styled.div`
   background: #fff;
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   display: flex;
   align-items: center;
   justify-content: center;
   img {
      width: 48px;
   }
`

export const StyledWrapper = styled.div`
   display: grid;
   height: 100vh;
   grid-template-columns: 1fr;
   grid-template-rows: 40px 1fr;
`
