import styled from 'styled-components'

export const StyledHeading = styled.h1`
   font-weight: 500;
   font-size: 20px;
   color: #555b6e;
   margin-bottom: 40px;
`
export const StyledCalendar = styled.div`
   max-width: 500px;
`
export const StyledSection = styled.div`
   font-weight: 500;
   font-size: 16px;
   color: #555b6e;
   border-bottom: 1px solid #f3f3f3;
`

export const StyledHead = styled.div`
   display: flex;
   height: 80px;
   justify-content: space-between;
   align-items: center;

   span {
      &:nth-child(2) {
         cursor: pointer;
      }
   }
`

export const StyledBody = styled.div`
   height: ${props => (props.active ? 'auto' : '0px')};
   transition: height 0.2s ease;
   overflow: hidden;
   padding: ${props => (props.active ? '8px 0px' : '0px')};
   box-sizing: border-box;

   h3 {
      font-size: 14px;
      color: #555b6e;
      margin-bottom: 16px;
   }

   > div {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
   }
`

export const StyledTimePicker = styled.span`
   margin-right: 40px;
   display: flex;

   .react-time-picker {
      margin-left: 16px;
   }

   .react-time-picker__wrapper {
      border: none;
   }

   input {
      border: none;
      border-bottom: 1px solid #888d9d;
   }
`

export const StyledContainer = styled.div`
   display: flex;
`

export const StyledForm = styled.div`
   flex: 2;
   > div {
      margin-bottom: 16px;

      label {
         margin-right: 28px;
         white-space: nowrap;
         background: #f3f3f3;
         padding: 4px;
         line-height: 2rem;
      }
   }
`

export const StyledDisplay = styled.div`
   flex: 1;
`
