import styled from 'styled-components'

export const ModalWrapper = styled.div`
   width: ${({ hasContent }) => (hasContent ? '100vw' : '100%')};
   background: ${({ hasContent }) =>
      hasContent ? 'rgba(255, 255, 255, 0.13)' : 'none'};
   backdrop-filter: ${({ hasContent }) =>
      hasContent ? 'blur(11.37px)' : 'none'};
   bottom: 0;
   position: absolute;
   top: 42px;
   left: 0;

   display: ${({ show }) => (show ? 'block' : 'none')};

   .modal_header {
      position: absolute;
      right: 40px;
      > button {
         color: #45484c;
         > span > svg {
            stroke: #45484c;
         }
      }
   }
   .modal_body {
      display: flex;
      padding: 32px;
      height: calc(100% - 20px);
      width: 100%;
      .menu_area {
         width: 330px;
         background: #320e3b;
         border-radius: 30px;
         color: #fff;
         padding: 16px;
         .menu_area_header {
            color: #fff;
            margin: 20px 16px 10px 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            h2 {
               text-align: center;
               font-weight: 500;
               font-size: 19px;
               line-height: 20px;
               text-transform: capitalize;
            }
            p {
               color: #fff;
               font-size: 12px;
               font-weight: normal;
               line-height: 17px;
               text-align: center;
               letter-spacing: 0.02em;
               padding: 10px;
            }
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
         text-align: center;
      }
   }
`
