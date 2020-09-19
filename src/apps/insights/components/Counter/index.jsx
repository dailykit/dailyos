import React from 'react'
import styled from 'styled-components'

/**
 *
 * @param {{counters: Array<{title: string, count: number, type?: 'price' }>, colors: string[]}} props
 */
export const Counter = ({
   counters,
   colors = ['#FF7A00', '#6F52ED', '#FFB800'],
}) => {
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
         {counters.map((counter, i) => (
            <StyledCounterElement color={colors[i % 2]}>
               <span>{counter.title}</span>
               <h5>
                  {counter.type === 'price' ? '$' : null} {counter.count}
               </h5>
            </StyledCounterElement>
         ))}
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
