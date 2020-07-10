import React from 'react'
import styled, { css } from 'styled-components'

export default function ProductPrice({ product }) {
   const { packagingPurchaseOptions } = product

   return (
      <Wrapper>
         <h3>Available Packages</h3>
         <PriceTable>
            <Head>
               <Row>
                  <Cel />
                  <Cel>Quantity</Cel>
                  <Cel>Price Per Unit</Cel>
                  <Cel>No. of Units</Cel>
                  <Cel align="right">Total Price</Cel>
               </Row>
            </Head>
            <Body>
               {packagingPurchaseOptions.map(opt => (
                  <Row key={opt.id}>
                     <Cel>check</Cel>
                     <Cel>
                        {opt.quantity} {opt.unit}
                     </Cel>
                     <Cel>$ {opt.salesPrice}</Cel>
                     <Cel>unit inc</Cel>
                     <Cel align="right">price $</Cel>
                  </Row>
               ))}
            </Body>
         </PriceTable>
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
`
const Cel = styled.td(
   ({ align }) => css`
      padding: 0 12px;
      display: table-cell;
      text-align: ${align === 'right' ? align : 'left'};
      > div {
         float: ${align === 'right' ? align : 'left'};
      }
   `
)
