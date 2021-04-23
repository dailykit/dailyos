import styled from 'styled-components'

export const ModalWrapper = styled.div`
   width: 100%;
   height: 100%;
   position: absolute;
   top: 0;
   left: 0;
   background: #fff;
   display: ${({ show }) => (show ? 'block' : 'none')};
   .modal_header {
      padding: 1rem;
   }
   .modal_body {
      display: flex;
      padding: 1rem;
      .menu_area {
         width: 30%;
         height: 560px;
         background: #111;
         border-radius: 4px;
         color: #fff;
         margin-right: 1rem;
         padding: 1rem;
         h1 {
            color: #fff;
            text-align: center;
            text-transform: uppercase;
         }
         ul {
            list-style: none;
            margin-left: 8px;
            margin-top: 1rem;
            height: calc(100% - 40px);
            overflow: auto;
         }
         li {
            cursor: pointer;
         }
      }
      .content_area {
         width: 70%;
         flex: 1;
         background: #fff;
         color: #111;
      }
   }
`
