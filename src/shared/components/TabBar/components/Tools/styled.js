import styled from 'styled-components'
export const OutsideWrapper = styled.div`
   display: flex;
   align-items: center;
   margin-left: auto;
   background: ${props => (props.active ? '#fefdfc' : null)};
   box-shadow: ${props =>
      props.active
         ? `1px 1px 2px rgba(255, 255, 255, 0.3),
      -1px -1px 2px rgba(206, 205, 204, 0.5),
      inset -3px 3px 6px rgba(206, 205, 204, 0.2),
      inset 3px -3px 6px rgba(206, 205, 204, 0.2),
      inset -3px -3px 6px rgba(255, 255, 255, 0.9),
      inset 3px 3px 8px rgba(206, 205, 204, 0.9)`
         : null};
`
export const Wrapper = styled.div`
   display: flex;
   align-items: center;
   height: 42px;
   padding: 0px 14px 0px 20px;
   background: linear-gradient(135deg, #ffffff 0%, #f1f0ef 100%);
   box-shadow: -8px 8px 16px rgba(191, 191, 190, 0.2),
      8px -8px 16px rgba(191, 191, 190, 0.2),
      -8px -8px 16px rgba(255, 255, 255, 0.9),
      8px 8px 20px rgba(191, 191, 190, 0.9),
      inset 1px 1px 2px rgba(255, 255, 255, 0.3),
      inset -1px -1px 2px rgba(191, 191, 190, 0.5);
   border-radius: 0px 0px 0px 24px;
   > button {
      border: none;
      outline: none;
      :first-child {
         border-radius: 0px 0px 0px 24px;
      }
      :last-child {
         padding-left: 20px;
         > img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid #e3e3e3;
         }
      }
   }
`
export const AddItem = styled.div`
   position: fixed;
   top: 46px;
   right: 56px;
   width: 210px;
   background: rgba(255, 255, 255, 0.13);
   border: 1px solid #f2f3f3;
   backdrop-filter: blur(44.37px);
   border-radius: 10px;
   > span {
      font-style: normal;
      font-weight: bold;
      font-size: 10px;
      line-height: 16px;
      letter-spacing: 0.44px;
      text-transform: uppercase;
      color: #919699;
      display: inline-block;
      padding: 8px 0px 0px 12px;
   }
   > div {
      display: flex;
      flex-direction: column;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0.44px;
      color: #202020;
      padding: 8px 0px 6px 12px;
   }
`
export const Profile = styled.div`
   position: fixed;
   width: 207px;
   right: 16px;
   top: 46px;
   background: rgba(255, 255, 255, 0.13);
   border: 1px solid #f2f3f3;
   backdrop-filter: blur(44.37px);
   border-radius: 10px;
   color: #919699;
   z-index: 10;
   > div:nth-child(1) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 8px 0px 12px;
      > span {
         font-style: normal;
         font-weight: bold;
         font-size: 10px;
         line-height: 16px;
         letter-spacing: 0.44px;
         text-transform: uppercase;
      }
   }
   > div:nth-child(2) {
      display: flex;
      align-items: center;
      > img {
         height: 60px;
         width: 60px;
         border-radius: 50%;
         margin: 12px;
      }
      > div {
         display: flex;
         flex-direction: column;
         color: #64696f;
         font-style: normal;
         font-weight: 500;
         > span:nth-child(1) {
            font-size: 10px;
            text-transform: uppercase;
            background-color: #e3e3e3;
            width: 40px;
            padding: 2px 4px;
         }
         > span:nth-child(2) {
            font-size: 18px;
            padding: 2px 0px;
         }
         > span:nth-child(3) {
            font-size: 12px;
         }
      }
   }
   > div:nth-child(3) {
      display: flex;
      align-items: center;
      padding: 4px;
      > span {
         font-size: 12px;
         padding: 0 4px;
      }
   }
   > div:nth-child(4) {
      display: flex;
      align-items: center;
      padding: 4px;
      margin-bottom: 4px;
      > span {
         font-size: 12px;
         padding: 0 4px;
      }
   }
   > div:nth-child(5) {
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      border-top: 1px solid #e0e0e0;
      > button {
         display: flex;
         align-items: center;
         justify-content: center;
         border: none;
         outline: none;
         cursor: pointer;
         padding: 10px;
         background: rgba(255, 255, 255, 0.13);
         backdrop-filter: blur(44.37px);
         > span {
            color: #ff5a52;
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
            padding: 0px 6px;
         }
      }
   }
`
