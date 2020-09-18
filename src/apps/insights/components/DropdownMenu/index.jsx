import React, { useState } from 'react'
import styled from 'styled-components'

import { ChevronDown } from '../../../../shared/assets/icons'

/**
 *
 * @param {{title: string, withIcon: boolean}} param0
 */
export const Dropdown = ({ title, children, withIcon, show, setShow }) => {
   return (
      <div style={{ position: 'relative' }}>
         <DropdownButton onClick={() => setShow(!show)}>
            <p>{title}</p>

            {withIcon && <ChevronDown color="#888d9d" />}
         </DropdownButton>

         {show && <Box>{children}</Box>}
      </div>
   )
}

export const DropdownItem = ({ leftIcon, rightIcon, onClick, children }) => {
   return (
      <StyledItem onClick={onClick}>
         {leftIcon}
         <div style={{ margin: '0 8px' }} onClick={() => {}}>
            {children}
         </div>
         {rightIcon}
      </StyledItem>
   )
}

const DropdownButton = styled.button`
   padding: 8px 16px;
   color: #00a7e1;
   background-color: #fff;
   border: 1px solid #f3f3f3;
   border-radius: 2px;
   width: 10vw;

   font-size: 18px;
   font-weight: 500;

   display: flex;
   justify-content: space-between;
   align-items: center;
   cursor: pointer;

   margin-bottom: 12px;
`
const Box = styled.div`
   background-color: #fff;
   padding: 8px;
   border-radius: 2px;

   box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
   border: 1px solid #f3f3f3;

   position: absolute;
   top: 90%;

   z-index: 12;
`

const StyledItem = styled.div`
   display: flex;
   align-items: center;
   border-radius: 2px;

   color: #888d9d;
   padding: 12px;
   min-width: 10vw;
   cursor: pointer;

   &:hover {
      background-color: #f3f3f3;
   }
`
