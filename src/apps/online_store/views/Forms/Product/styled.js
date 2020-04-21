import styled from 'styled-components'

export const Content = styled.div`
   display: flex;
`

export const Flexible = styled.div`
   flex: ${({ width }) => width};
`

export const ItemTab = styled.div`
   border-bottom: ${({ active }) => (active ? `3px solid #00a7e1` : 0)};
   margin: 0px 15px;
   min-width: 58px;
   text-align: center;
   cursor: pointer;
`

export const RecipeButton = styled.button`
   border: 0;
   outline: 0;
   width: 100%;
   display: flex;
   padding: 10px;
   justify-content: flex-start;
   align-items: center;
   background-color: ${props => (props.active ? '#555b6e' : '#e5e5e5')};
   color: ${props => (props.active ? '#fff' : '#555b6e')};
`

export const TabContainer = styled.div`
   display: flex;
   border-bottom: 1px solid rgba(136, 141, 157, 0.3);
   margin: 10px 0;
`

export const CustomCrossButton = styled.button`
   border: 0;
   outline: 0;
   font-size: 1rem;
   background-color: #f2f1f3;
   margin-left: 10px;
   color: #555b6e;
   &:hover {
      color: rgb(255, 90, 82);
      cursor: pointer;
   }
`
