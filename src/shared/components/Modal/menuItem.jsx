import React, { useState } from 'react'
import styled from 'styled-components'
import { ChevronDown, ChevronUp } from '../../assets/icons'
import { toggleNode } from './utils.js'
import { useBottomBar } from '../../providers'
import ChildNode from './ChildNode'

export default function MenuItem({ menuItem = {}, clickHandler, ...props }) {
   const { state, addClickedOptionMenuInfo } = useBottomBar()
   const [toggleMenu, setToggleMenu] = useState(menuItem?.isChildOpen || true)

   const handleClick = async () => {
      setToggleMenu(prev => !prev)
      const mutated = await toggleNode(
         state?.clickedOptionMenu?.navigationMenuItems,
         menuItem.id
      )
      addClickedOptionMenuInfo({
         ...state?.clickedOptionMenu,
         navigationMenuItems: mutated,
      })
   }
   return (
      <StyledWrapper
         isChildOpen={menuItem?.isChildOpen}
         {...props}
         hasChild={menuItem?.childNodes?.length > 0}
      >
         <ButtonWrapper>
            <p onClick={() => clickHandler(menuItem)}>{menuItem?.label}</p>

            {menuItem?.childNodes?.length > 0 && toggleMenu && (
               <button onClick={handleClick}>
                  <ChevronUp size="16px" color="#fff" />
               </button>
            )}
            {menuItem?.childNodes?.length > 0 && !toggleMenu && (
               <button onClick={handleClick}>
                  <ChevronDown size="16px" color="#fff" />
               </button>
            )}
         </ButtonWrapper>
         {menuItem?.childNodes?.length > 0 && menuItem?.isChildOpen && (
            <StyledChildren>
               {menuItem?.childNodes?.map(child => (
                  <ChildNode
                     key={child.id}
                     child={child}
                     clickHandler={clickHandler}
                  />
               ))}
            </StyledChildren>
         )}
      </StyledWrapper>
   )
}

export const StyledWrapper = styled.div`
   width: 100%;
   cursor: pointer;
   padding: 12px;
   margin-bottom: 4px;
   font-family: Roboto;
   font-style: normal;
   font-weight: 500;
   font-size: 14px;
   line-height: 16px;
   background: ${({ isChildOpen }) => (isChildOpen ? '#3c1845' : '#320E3B')};
   &:hover {
      background: #3c1845;
      border-radius: 2px;
   }
   > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 40px;
   }
`
const ButtonWrapper = styled.div`
   display: flex;
   align-items: center;
   justify-content: space-between;
   margin-right: 0px !important;
   > button {
      border: none;
      height: 24px;
      width: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #320e3b;
      box-shadow: -4px 4px 8px rgba(31, 9, 36, 0.2),
         4px -4px 8px rgba(31, 9, 36, 0.2), -4px -4px 8px rgba(70, 19, 82, 0.9),
         4px 4px 10px rgba(31, 9, 36, 0.9),
         inset 1px 1px 2px rgba(70, 19, 82, 0.3),
         inset -1px -1px 2px rgba(31, 9, 36, 0.5);
      border-radius: 18.6691px;
   }
`
const StyledChildren = styled.div`
   display: flex;
   align-items: center;
   flex-direction: column;
   justify-content: space-between;
   margin-top: 16px;
   border-radius: 4px;
   border: 1px solid #320e3b;
`
