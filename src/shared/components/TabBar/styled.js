import styled from 'styled-components'

const Styles = {
   Header: styled.header`
      background: #d9e9f1;
      display: flex;
   `,
   Menu: styled.button`
      width: 40px;
      height: 40px;
      border: none;
      display: flex;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      :hover,
      :focus {
         background: #fff;
      }
   `,
}

export default Styles
