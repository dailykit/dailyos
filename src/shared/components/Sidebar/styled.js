import styled, { css } from 'styled-components'

const Styles = {
   Sidebar: styled.aside(
      ({ visible }) => css`
         color: #fff;
         background: rgb(0, 60, 73);
         @media screen and (max-width: 767px) {
            width: ${visible ? '100%' : null};
         }
      `
   ),
   Heading: styled.h3`
      color: #76acc7;
      font-size: 16px;
      font-weight: 500;
      padding: 18px 12px 8px 12px;
      letter-spacing: 0.4px;
      text-transform: uppercase;
   `,
   Pages: styled.ul``,
   PageItem: styled.li`
      height: 40px;
      display: flex;
      cursor: pointer;
      padding: 0 12px;
      align-items: center;
      :hover {
         background-color: rgb(1, 67, 82);
      }
   `,
   Apps: styled.ul``,
   AppItem: styled.li`
      height: 40px;
      display: flex;
      cursor: pointer;
      padding: 0 12px;
      align-items: center;
      :hover {
         background-color: rgb(1, 67, 82);
      }
      img {
         width: 28px;
         margin-right: 14px;
      }
   `,
   Tabs: styled.ul`
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-around;
   `,
   Tab: styled.li`
      width: 100%;
      height: 100%;
      display: flex;
      cursor: pointer;
      font-size: 14px;
      list-style: none;
      font-weight: 400;
      align-items: center;
      letter-spacing: 0.5px;
      justify-content: center;
      color: rgb(123, 153, 167);
      text-transform: uppercase;
      border-bottom: 2px solid transparent;
      &.active {
         color: #fff;
         border-bottom: 2px solid #fff;
      }
   `,
   Footer: styled.footer`
      padding: 12px;
      margin-top: auto;
      button {
         color: #fff;
         width: 100%;
         height: 40px;
         border: none;
         font-size: 16px;
         margin-top: 14px;
         border-radius: 2px;
         background-color: rgb(245, 101, 101);
      }
   `,
}

export default Styles
