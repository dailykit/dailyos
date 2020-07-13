import React, { useState, useCallback } from 'react'
import { Checkbox } from '@dailykit/ui'
import styled from 'styled-components'

import { FlexContainer } from '../../views/Forms/styled'
import { PriceTable, TableHead, TableBody, TableRow, TableCell } from './styled'

export default function ProductPrice({ product }) {
   const { packagingPurchaseOptions } = product

   const [purchaseOptions, setPurchaseOptions] = useState(
      packagingPurchaseOptions.map(x => ({
         ...x,
         isSelected: false,
         multiplier: 0,
      })) || []
   )

   const registerOrder = useCallback(() => {}, [])

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
            <TableHead>
               <TableRow>
                  <TableCell />
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price Per Unit</TableCell>
                  <TableCell>No. of Units</TableCell>
                  <TableCell align="right">Total Price</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {purchaseOptions.map((opt, index) => (
                  <TableRow
                     key={opt.id}
                     onClick={() => selectOption(index)}
                     isSelected={opt.isSelected}
                  >
                     <TableCell>
                        <Checkbox
                           id="label"
                           checked={opt.isSelected}
                           onChange={() => selectOption(index)}
                        />
                     </TableCell>
                     <TableCell>
                        {opt.quantity} {opt.unit}
                     </TableCell>
                     <TableCell>$ {opt.salesPrice}</TableCell>
                     <TableCell>
                        {opt.isSelected ? (
                           <Multiplier
                              onInc={e => incrementMultiplier(index, e)}
                              onDec={e => decrementMultiplier(index, e)}
                              value={opt.multiplier}
                           />
                        ) : null}
                     </TableCell>
                     <TableCell align="right">
                        {opt.isSelected ? (
                           <span>
                              {`${opt.multiplier * opt.salesPrice}`.slice(0, 5)}{' '}
                              $
                           </span>
                        ) : null}
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </PriceTable>

         <ActionButton onClick={registerOrder}>
            ADD TO CART
            <span style={{ marginLeft: '16px' }}>
               (
               {purchaseOptions
                  .reduce((acc, curr) => {
                     const price = curr.isSelected
                        ? curr.salesPrice * curr.multiplier
                        : 0
                     return acc + price
                  }, 0)
                  .toString()
                  .slice(0, 5)}{' '}
               $)
            </span>
         </ActionButton>
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

const ActionButton = styled.button`
   margin-top: 16px;
   width: 100%;
   height: 48px;
   cursor: pointer;
   border: 0;

   background: linear-gradient(180deg, #28c1f7 -4.17%, #00a7e1 100%);
   color: #fff;
`

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
