import React, { useState } from 'react'

import styled from 'styled-components'

const StyledStatusSwitch = styled.select`
   padding: 10px 20px;
   color: #fff;
   background-color: #e6c02a;
   border: none;

   &:hover {
      cursor: pointer;
   }
`

export default function StatusSwitch({ currentStatus, onSave }) {
   const [status, setStatus] = useState(currentStatus)

   return (
      <StyledStatusSwitch
         value={status}
         onChange={e => {
            setStatus(e.target.value)
            onSave(e.target.value)
         }}
      >
         <option value={status} disabled>
            {status}
         </option>
         {status !== 'PENDING' && <option value="PENDING">PENDING</option>}
         {status !== 'COMPLETED' && (
            <option value="COMPLETED">COMPLETED</option>
         )}
         {status !== 'CANCELLED' && (
            <option value="CANCELLED">CANCELLED</option>
         )}
      </StyledStatusSwitch>
   )
}
