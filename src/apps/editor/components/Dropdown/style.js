import styled from 'styled-components'

export const Row = styled.div`
   .span4 {
      float: left;
      min-height: 1px;
      margin-left: 20px;
   }
   .control-label {
      display: inline-block;
      position: relative;
      top: -4px;
      margin-right: 4px;
   }
   label {
      margin: 5px;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #555;
   }
   select {
      color: #080808;
      width: 220px;
      background-color: #fff;
      border: 1px solid #bbb;
      height: 30px;
      display: inline-block;
      padding: 4px 6px;
      font-size: 14px;
      line-height: 20px;
      vertical-align: middle;
      -webkit-border-radius: 0;
      -moz-border-radius: 0;
      border-radius: 0;
   }
`
