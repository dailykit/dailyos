import styled from 'styled-components'

export const Wrapper = styled.div`
   height: 100%;
   padding: 0 12px 12px 12px;
   border-right: 1px solid #e7e7e7;
   border-left: 1px solid #e7e7e7;
   > h2 {
      text-transform: uppercase;
      font-size: 14px;
      font-weight: 500;
      color: #787474;
      margin: 16px 0;
   }
`

export const Fieldset = styled.section`
   position: relative;
   border-radius: 2px;
   margin-bottom: 16px;
   legend {
      color: rgb(136, 141, 157);
      font-size: 14px;
      display: flex;
      align-items: center;
      ~ div {
         height: 32px;
         margin-top: 8px;
      }
   }

   section {
      display: flex;
      align-items: center;
      > div {
         margin-right: 8px;
      }
   }
   input[type='text'] {
      width: 100%;
      height: 32px;
      border: none;
      border-bottom: 1px solid #d8d8d8;
      :focus {
         outline: none;
      }
   }
   select {
      width: 100%;
      height: 32px;
      border: none;
      border-bottom: 1px solid #d8d8d8;
      :focus {
         outline: none;
      }
   }
   button {
      width: 20px;
      height: 20px;
      cursor: pointer;
      margin-left: 8px;
      background: #fff;
      border-radius: 50%;
      border: 1px solid #a2a0a0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      svg {
         stroke: #000;
      }
   }
`
