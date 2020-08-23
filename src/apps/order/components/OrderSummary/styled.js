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

export const Fieldset = styled.fieldset`
   position: relative;
   border-radius: 2px;
   margin-bottom: 16px;
   padding: 0 8px 8px 8px;
   border: 1px solid #d8d8d8;
   legend {
      padding: 0 8px;
   }
   section {
      display: flex;
      align-items: center;
   }
   input[type='text'] {
      width: 144px;
      height: 32px;
      border: none;
      border-bottom: 1px solid #d8d8d8;
      :focus {
         outline: none;
      }
      :first-child {
         margin-right: 8px;
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
      top: -22px;
      right: 11px;
      width: 24px;
      height: 24px;
      cursor: pointer;
      background: #fff;
      border-radius: 50%;
      position: absolute;
      border: 1px solid #a2a0a0;
      svg {
         stroke: #000;
      }
   }
`
