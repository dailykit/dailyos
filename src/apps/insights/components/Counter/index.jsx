import React from 'react'
import styled from 'styled-components'
import { fromMixed } from '../../utils/textTransform'

import { flattenObject } from '../../utils/transformer'

/**
 *
 * @param {{aggregates: any}} props
 */
export const Counter = ({
   aggregates,
   colors = ['#FF7A00', '#6F52ED', '#FFB800'],
}) => {
   const flattenedAggregates = flattenObject(aggregates)
   const regex = new RegExp(/amount|price/i)

   return (
      <div
         style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #EEF0F7',
            marginBottom: '8px',
         }}
      >
         {Object.keys(flattenedAggregates).map((counter, i) => {
            if (flattenedAggregates[counter]) {
               const count = flattenedAggregates[counter]
                  .toString()
                  .includes('.')
                  ? flattenedAggregates[counter].toFixed(2)
                  : flattenedAggregates[counter]
               return (
                  <StyledCounterElement key={i} color={colors[i % 2]}>
                     <span>{fromMixed(counter)}</span>
                     <h5>
                        {regex.test(counter) ? '$' : null} {count}
                     </h5>
                  </StyledCounterElement>
               )
            }
         })}
      </div>
   )
}

const StyledCounterElement = styled.div`
   border-left: 5px solid ${({ color }) => color};
   padding-left: 12px;
   margin-right: 3rem;
   span {
      font-weight: 500;
      font-size: 14px;
      letter-spacing: 0.01em;
      color: #555b6e;
      margin-bottom: 8px;
   }

   h5 {
      font-weight: 500;
      font-size: 24px;
      letter-spacing: 0.01em;
      color: #555b6e;
   }
`
