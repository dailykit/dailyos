import styled from 'styled-components'

export const Wrapper = styled.div`
   width: 100%;
   background: #e3e3e3;
   height: calc(100vh - 40px);
`

export const Header = styled.header`
   padding: 24px;
   background: #fff;
   input[type='text'] {
      width: 340px;
   }
`

export const Section = styled.section`
   padding: 24px;
   height: calc(100vh - 128px);

   [data-reach-tab] {
      height: 48px;
      flex-shrink: 0;
      padding: 0 16px;
      text-align: left;
   }
   [data-selected] {
      span {
         color: #fff;
      }
   }
`

export const ItemCountsSection = styled.section`
   height: calc(100vh - 254px);
   [data-reach-tab-panel] {
      padding: 0;
   }
   [data-reach-tab-panels] {
      height: calc(100% - 48px);
   }
   [data-selected] {
      span {
         color: #05abe4;
      }
   }
`

export const ServingHeader = styled.header`
   height: 48px;
   display: flex;
   align-items: center;
`

export const ItemCountHeader = styled.header`
   height: 48px;
   display: flex;
   align-items: center;
`

export const ItemCountSection = styled.section`
   padding: 16px;
   background: #e3e3e3;
   height: calc(100vh - 366px);
   [data-reach-tab-panels] {
      height: unset;
   }
   [data-selected] {
      span {
         color: #fff;
      }
   }
`

export const DeliveryDaySection = styled.section`
   [data-selected] {
      span {
         color: #05abe4;
      }
   }
   [data-reach-tab-panel] {
      padding: 16px;
   }
`
