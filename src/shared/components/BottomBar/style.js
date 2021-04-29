import styled from 'styled-components'

const Styles = {
   Wrapper: styled.div`
      width: 100%;
      /* height: 78px; */
      position: fixed;
      z-index: 4;
      bottom: 0;
      left: 0;
      /* > button {
         height: 34px;
      }
      > div {
         display: flex;
         width: 100%;
         background: #ffffff;
         box-shadow: -5px 5px 10px rgba(201, 201, 201, 0.2),
            5px -5px 10px rgba(201, 201, 201, 0.2),
            -5px -5px 10px rgba(255, 255, 255, 0.9),
            5px 5px 13px rgba(201, 201, 201, 0.9),
            inset 1px 1px 2px rgba(255, 255, 255, 0.3),
            inset -1px -1px 2px rgba(201, 201, 201, 0.5);
      } */

      .option {
         display: flex;
         align-items: center;
         img {
            width: 24px;
            height: 24px;
            background: #fff;
            object-fit: contain;
            border-radius: 50%;
            margin-right: 4px;
         }
      }
   `,
   BottomBarMenu: styled.div`
      display: flex;
      justify-content: center;
   `,
   BottomBar: styled.div`
      display: flex;
      width: 100vw;
      padding: 0 32px;
   `,
   Bar: styled.div`
      height: 8px;
      width: 90px;
      border-radius: 90px 90px 0 0;
      display: flex;
      justify-content: center;
   `,
   BottomBarWrapper: styled.div`
      background: #ffffff;
      box-shadow: -5px 5px 10px rgba(201, 201, 201, 0.2),
         5px -5px 10px rgba(201, 201, 201, 0.2),
         -5px -5px 10px rgba(255, 255, 255, 0.9),
         5px 5px 13px rgba(201, 201, 201, 0.9),
         inset 1px 1px 2px rgba(255, 255, 255, 0.3),
         inset -1px -1px 2px rgba(201, 201, 201, 0.5);
   `,
   Option: styled.p`
      font-family: Roboto;
      font-style: normal;
      font-weight: bold;
      font-size: 12px;
      line-height: 14px;
      text-transform: uppercase;
      color: ${({ active }) => (active ? `#fff` : `#373B48`)};
      cursor: pointer;
      padding: 10px 16px;
      background-color: ${({ active }) => (active ? `#320E3B` : `#fff`)};
   `,
}
export default Styles
