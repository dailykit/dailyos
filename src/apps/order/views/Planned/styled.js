import styled from 'styled-components'

export const Wrapper = styled.div`
   height: 100%;
   [data-reach-tab-list] {
      height: 40px;
      display: flex;
      align-items: flex-end;
   }
   [data-reach-tab-panels] {
      overflow-y: auto;
      height: calc(100% - 40px);
   }
   [data-reach-tab-panel] {
      padding: 16px;
   }
   @media only screen and (max-width: 1439px) and (orientation: landscape) {
      width: calc(100vw - 340px);
   }
   @media only screen and (max-width: 767px) and (orientation: landscape) {
      width: calc(100vw - 240px);
   }
`
