import styled, { css } from 'styled-components'

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
   ({ isActive }) => css`
      padding: 8px;
      list-style: none;
      ${isActive && `color: #fff`};
      background: ${isActive ? '#353244' : '#f3f3f3'};
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
      > div > span:first-child {
         color: #888d9d;
         font-size: 14px;
         font-weight: 400;
         padding-left: 14px;
      }
   `
)

export const ListBody = styled.div(() => css``)

const selectBg = (isPacked, isAssembled) => {
   if (isPacked && isAssembled) {
      return '#79df54' // green
   }
   if (!isPacked && !isAssembled) {
      return '#f9daa8' //pending
   }
   if (isPacked && !isAssembled) {
      return '#65c6ff' // processing
   }
   return ''
}

export const ListBodyItem = styled.div(
   ({ isOpen, variant: { isPacked, isAssembled } }) => css`
      overflow: hidden;
      margin-bottom: 4px;
      header {
         height: 48px;
         display: grid;
         grid-gap: 16px;
         line-height: 48px;
         border-radius: 2px 2px 0 0;
         grid-template-columns: repeat(4, 1fr) 48px;
         background: ${selectBg(isPacked, isAssembled)};
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
            :focus {
               outline: none;
               background: rgba(0, 0, 0, 0.1);
            }
         }
      }
      main {
         padding: 16px;
         grid-gap: 24px;
         border-radius: 0 0 2px 2px;
         border-left: 1px solid #e9e9e9;
         border-right: 1px solid #e9e9e9;
         border-bottom: 1px solid #e9e9e9;
         display: ${isOpen ? 'grid' : 'none'};
         grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      }
   `
)

export const Legend = styled.div`
   display: flex;
   margin: 16px 0;
   align-items: center;
   h2 {
      font-size: 18px;
      font-weight: 400;
      margin-right: 24px;
   }
   section {
      margin-right: 24px;
      align-items: center;
      display: inline-flex;
      span:first-child {
         height: 8px;
         width: 20px;
         margin-right: 8px;
         border-radius: 8px;
         display: inline-block;
      }
   }
   section {
      :nth-of-type(1) {
         span:first-child {
            background: #f9daa8;
         }
      }
      :nth-of-type(2) {
         span:first-child {
            background: #65c6ff;
         }
      }
      :nth-of-type(3) {
         span:first-child {
            background: #79df54;
         }
      }
   }
`
