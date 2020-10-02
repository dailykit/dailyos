import styled from 'styled-components'

export const Wrapper = styled.div`
   padding-top: 12px;
   [data-reach-tab-panels] {
      overflow-y: auto;
      height: calc(100vh - 124px);
   }
   [data-reach-tab-panel] {
      padding: 16px;
   }
`
