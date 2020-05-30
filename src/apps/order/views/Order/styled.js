import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
   margin: 0 auto;
   padding: 24px;
   > section {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
   }
`

export const Header = styled.header(
   () => css`
      margin-bottom: 24px;

      h3 {
         font-size: 18px;
         font-weight: 400;
         margin-bottom: 24px;
      }
      > section {
         display: grid;
         grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
         section {
            display: flex;
            flex-direction: column;
            span:first-child {
               color: #9aa5ab;
               font-size: 14px;
               font-weight: 500;
               padding-bottom: 4px;
               letter-spacing: 0.6px;
               text-transform: uppercase;
            }
            span:last-child {
               font-size: 24px;
            }
         }
      }
   `
)

export const OrderItems = styled.ul(
   () => css`
      display: grid;
      grid-gap: 16px;
      margin-top: 8px;
      margin-bottom: 24px;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
   `
)

export const OrderItem = styled.li(
   () => css`
      padding: 8px;
      list-style: none;
      background: #f3f3f3;
      h3 {
         font-size: 14px;
         font-weight: 500;
         line-height: 14px;
      }
      > section {
         display: flex;
         margin-top: 8px;
         align-items: center;
         justify-content: space-between;
      }
   `
)

export const StyledCount = styled.span`
   color: #555b6e;
   font-weight: 500;
`

export const StyledProductTitle = styled.span`
   font-weight: 500;
   font-size: 16px;
   line-height: 14px;
`

export const StyledServings = styled.div`
   width: auto;
   height: 32px;
   display: flex;
   font-weight: 400;
   align-items: center;
   span {
      display: flex;
      align-items: center;
      :first-child {
         margin-right: 6px;
      }
   }
`

export const List = styled.div(() => css``)

export const ListHead = styled.header(
   () => css`
      height: 32px;
      display: grid;
      grid-gap: 16px;
      line-height: 32px;
      grid-template-columns: repeat(4, 1fr) 48px;
      span {
         color: #888d9d;
         padding: 0 14px;
         font-size: 14px;
         font-weight: 400;
      }
   `
)

export const ListBody = styled.div(() => css``)

const selectBg = (arg1, arg2) => {
   const args = [arg1, arg2]
   if (args.every(item => item === true)) {
      return '#53C22B'
   }
   if (args.every(item => item === false)) {
      return '#3C91E6'
   }
   if (args.some(item => item === false)) {
      return '#FBB13C'
   }
   return ''
}

export const ListBodyItem = styled.div(
   ({ isOpen, variant: { isLabelled, isPortioned } }) => css`
      background: ${selectBg(isLabelled, isPortioned)};
      header {
         height: 48px;
         display: grid;
         grid-gap: 16px;
         line-height: 48px;
         grid-template-columns: repeat(4, 1fr) 48px;
         span {
            padding: 0 14px;
         }
         button {
            border: none;
            display: flex;
            cursor: pointer;
            align-items: center;
            background: transparent;
            justify-content: center;
            :hover {
               background: rgba(0, 0, 0, 0.05);
            }
         }
      }
      main {
         padding: 16px;
         border-top: 1px solid #dddada;
         display: ${isOpen ? 'block' : 'none'};
      }
   `
)
