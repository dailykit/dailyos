import styled, { css } from 'styled-components'

export const Wrapper = styled.main`
   padding: 0 16px;
   > section,
   main {
      padding-top: 16px;
      border-top: 1px solid #e3e3e3;
   }
   > main > section {
      margin-top: 16px;
   }
`

export const StyledList = styled.ul`
   margin-top: 14px;
   li {
      height: 56px;
      display: flex;
      cursor: pointer;
      list-style: none;
      padding: 12px;
      align-items: center;
      border: 1px solid #e3e3e3;
      justify-content: space-between;
      :hover {
         background: rgba(220, 220, 220, 0.25);
      }
      + li {
         border-top: none;
      }
      section {
         display: flex;
         align-items: center;
         input {
            margin-right: 16px;
         }
      }
   }
`

const progress = ({ request, assignment, pickup, dropoff }) => {
   if (request !== 'SUCCEEDED') {
      if (request === 'WAITING') return '0'
      if (request === 'IN_PROGRESS') return '48px'
      if (request === 'SUCCEEDED') return '97px'
   }

   if (assignment !== 'SUCCEEDED') {
      if (assignment === 'WAITING') return '97px'
      if (assignment === 'IN_PROGRESS') return '137px'
      if (assignment === 'SUCCEEDED') return '184px'
   }

   if (pickup !== 'SUCCEEDED') {
      if (pickup === 'WAITING') return '184px'
      if (pickup === 'IN_PROGRESS') return '225px'
      if (pickup === 'SUCCEEDED') return '273px'
   }

   if (dropoff === 'WAITING') return '273px'
   if (dropoff === 'IN_PROGRESS') return '316px'
   if (dropoff === 'SUCCEEDED') return '360px'

   return '0'
}

export const DeliveryStates = styled.ul(
   ({ status }) => css`
      margin-top: 14px;
      position: relative;
      :before {
         top: 40px;
         width: 6px;
         left: 6.3px;
         content: '';
         position: absolute;
         border-radius: 6px;
         background: #34bc17;
         height: ${progress(status)};
      }
   `
)

export const StyledDeliveryCard = styled.li`
   padding: 14px;
   display: flex;
   list-style: none;
   background: #fff;
   margin-left: 28px;
   position: relative;
   flex-direction: column;
   border: 1px solid #e3e3e3;
   + li {
      margin-top: 16px;
   }
   :before {
      width: 12px;
      content: '';
      left: -28px;
      height: 12px;
      background: #fff;
      position: absolute;
      border-radius: 50%;
      top: calc(50% - 6px);
      border: 2px solid #34bc17;
   }
   span:first-child {
      color: #a0aec0;
      font-size: 14px;
      font-weight: 500;
      padding-bottom: 6px;
      text-transform: uppercase;
   }
`
