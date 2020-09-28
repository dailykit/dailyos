import styled from 'styled-components'

export const Wrapper = styled.div`
   width: 100%;
   background: #e3e3e3;
   height: calc(100vh - 40px);
`

export const Header = styled.header`
   padding: 24px;
   display: flex;
   background: #fff;
   align-items: center;
   justify-content: space-between;
   > div {
      flex: 0;
   }
   input[type='text'] {
      width: 340px;
   }
`

export const Section = styled.section`
   padding: 16px;
   height: calc(100vh - 128px);

   [data-reach-tab] {
      height: 56px;
      flex-shrink: 0;
      padding: 0 16px;
      text-align: left;
   }
   [data-selected] {
      span {
         color: #fff;
      }
   }
   [data-reach-tab-panel] {
      padding: 0 16px 16px 16px;
   }
`

export const ItemCountsSection = styled.section`
   height: calc(100vh - 282px);
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

export const ItemCountSection = styled.section`
   padding: 16px;
   background: #e3e3e3;
   height: calc(100vh - 394px);
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
   padding: 0 16px;
   [data-reach-tab] {
      padding: 0;
      height: 48px;
   }
   [data-selected] {
      span {
         color: #05abe4;
      }
   }
   [data-reach-tab-panel] {
      padding-top: 16px;
   }
`
