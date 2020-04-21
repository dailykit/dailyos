import styled from 'styled-components'

export const FormHeader = styled.div`
   height: 90px;
   align-items: center;
   justify-content: space-between;
   padding: 0 40px;
   display: flex;
   border-bottom: 1px solid #d8d8d8;
`

export const FormHeaderInputs = styled.div`
   width: 500px;
`

export const Breadcrumbs = styled.div`
   font-size: 14px;
   color: #888d9d;
   height: 16px;
   display: flex;
   align-items: baseline;

   .active {
      color: #00a7e1;
   }
`

export const FormHeaderActions = styled.div`
   > button {
      margin: 0 20px;
   }
`

export const FormBody = styled.div`
   padding: 32px 40px;
`
