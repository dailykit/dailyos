import React, { useState } from 'react'
import { Checkbox } from '@dailykit/ui'
import styled, { css } from 'styled-components'

import { FlexContainer } from '../../views/Forms/styled'

export default function ProductPrice({ product }) {
   const { packagingPurchaseOptions } = product

   const [purchaseOptions, setPurchaseOptions] = useState(
      packagingPurchaseOptions.map(x => ({
         ...x,
         isSelected: false,
         multiplier: 0,
      })) || []
   )

   const selectOption = index => {
      setPurchaseOptions(curr => {
         const newOptions = [...curr]
         newOptions[index].isSelected = !newOptions[index].isSelected

         if (newOptions[index].isSelected) {
            newOptions[index].multiplier += 1
         } else {
            newOptions[index].multiplier -= 1
         }

         return newOptions
      })
   }

   const incrementMultiplier = (index, e) => {
      e.stopPropagation()
      setPurchaseOptions(curr => {
         const newOptions = [...curr]

         if (!newOptions[index].isSelected) return

         newOptions[index].multiplier += 1

         return newOptions
      })
   }

   const decrementMultiplier = (index, e) => {
      e.stopPropagation()

      setPurchaseOptions(curr => {
         const newOptions = [...curr]

         if (!newOptions[index].isSelected) return
         if (newOptions[index].multiplier === 0) {
            newOptions[index].isSelected = false
            return newOptions
         }

         newOptions[index].multiplier -= 1

         return newOptions
      })
   }

   return (
      <Wrapper>
         <h3>Available Packages</h3>
         <PriceTable>
            <Head>
               <Row>
                  <Cell />
                  <Cell>Quantity</Cell>
                  <Cell>Price Per Unit</Cell>
                  <Cell>No. of Units</Cell>
                  <Cell align="right">Total Price</Cell>
               </Row>
            </Head>
            <Body>
               {purchaseOptions.map((opt, index) => (
                  <Row
                     key={opt.id}
                     onClick={() => selectOption(index)}
                     isSelected={opt.isSelected}
                  >
                     <Cell>
                        <Checkbox
                           id="label"
                           checked={opt.isSelected}
                           onChange={() => selectOption(index)}
                        />
                     </Cell>
                     <Cell>
                        {opt.quantity} {opt.unit}
                     </Cell>
                     <Cell>$ {opt.salesPrice}</Cell>
                     <Cell>
                        {opt.isSelected ? (
                           <Multiplier
                              onInc={e => incrementMultiplier(index, e)}
                              onDec={e => decrementMultiplier(index, e)}
                              value={opt.multiplier}
                           />
                        ) : null}
                     </Cell>
                     <Cell align="right">
                        {opt.isSelected
                           ? `${opt.multiplier * opt.salesPrice}`.slice(0, 5)
                           : null}
                     </Cell>
                  </Row>
               ))}
            </Body>
         </PriceTable>
      </Wrapper>
   )
}

const Multiplier = ({ value, onInc, onDec }) => {
   const Wrapper = styled(FlexContainer)`
      width: 95%;
      align-items: flex-end;
      justify-content: space-between;
      margin: 0 auto;

      button {
         border: 0;
         cursor: pointer;
         margin-bottom: 4px;
         background: transparent;
      }

      span {
         width: 100%;

         border-bottom: 1px solid #888d9d;
         text-align: center;
         padding-bottom: 4px;
      }
   `

   return (
      <Wrapper>
         <button style={{ marginBottom: '6px' }} type="button" onClick={onDec}>
            <DecIcon />
         </button>

         <span>{value}</span>

         <button type="button" onClick={onInc}>
            <IncIcon />
         </button>
      </Wrapper>
   )
}

const Wrapper = styled.div`
   margin-top: 39px;
   h3 {
      font-size: 16px;
      line-height: 19px;
      color: #555b6e;
   }
`

const PriceTable = styled.table`
   width: 100%;
   display: table;
   border-collapse: separate;
   border-spacing: 0 2px;
`
const Head = styled.thead`
   width: 100%;
   display: table-header-group;
   td {
      height: 4rem;
      color: #888d9d;
      font-size: 14px;
   }
`
const Body = styled.tbody`
   display: table-row-group;

   tr {
      background: #f3f3f3;
      cursor: pointer;

      &:hover {
         background: #ececec;
      }
   }

   td {
      border-bottom: 1px solid #ececec;
      border-top: 1px solid #ececec;
      height: 48px;
      color: #555b6e;
      font-size: 14px;

      &:first-child {
         border-left: 1px solid #ececec;
      }

      &:last-child {
         border: 0;
         background: #fff;
      }

      &:nth-last-child(2) {
         border-right: 1px solid #ececec;
      }
   }
`
const Row = styled.tr`
   display: table-row;
   background: ${({ isSelected }) => (isSelected ? '#fff !important' : null)};
   box-shadow: ${({ isSelected }) =>
      isSelected ? '2px 4px 14px rgba(0, 0, 0, 0.07)' : null};
`
const Cell = styled.td(
   ({ align }) => css`
      padding: 0 12px;
      display: table-cell;
      text-align: ${align === 'right' ? align : 'left'};
      > div {
         float: ${align === 'right' ? align : 'left'};
      }
   `
)

const DecIcon = () => (
   <svg
      width="9"
      height="3"
      viewBox="0 0 9 3"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
   >
      <path
         d="M1.5 1.5H8"
         stroke="#00A7E1"
         strokeWidth="2"
         strokeLinecap="round"
      />
   </svg>
)

const IncIcon = () => (
   <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
   >
      <path
         d="M1 4.5H7.5"
         stroke="#00A7E1"
         strokeWidth="2"
         strokeLinecap="round"
      />
      <path
         d="M4.25 7.75L4.25 1.25"
         stroke="#00A7E1"
         strokeWidth="2"
         strokeLinecap="round"
      />
   </svg>
)
