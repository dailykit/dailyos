import React, { useState } from 'react'
import styled from 'styled-components'
import { ChevronRight, ChevronDown, ChevronUp } from '../../assets/icons'
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
         <div>
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
            {menuItem?.childNodes?.length <= 0 && (
               <button>
                  <ChevronRight size="16px" color="#fff" />
               </button>
            )}
         </div>
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
   padding: 16px 12px 16px 24px;
   background-color: #3c1845;
   margin-bottom: 4px;
   font-family: Roboto;
   font-style: normal;
   font-weight: 500;
   font-size: 14px;
   line-height: 16px;
   > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      > button {
         border: none;
         height: 24px;
         width: 24px;
         display: flex;
         align-items: center;
         justify-content: center;
         background: #3c1845;
         box-shadow: ${({ hasChild }) =>
            hasChild
               ? `-5px 5px 10px rgba(37, 15, 43, 0.2),
            5px -5px 10px rgba(37, 15, 43, 0.2),
            -5px -5px 10px rgba(83, 33, 95, 0.9),
            5px 5px 13px rgba(37, 15, 43, 0.9),
            inset 1px 1px 2px rgba(83, 33, 95, 0.3),
            inset -1px -1px 2px rgba(37, 15, 43, 0.5)`
               : 'none'};
         border-radius: 18.6691px;
      }
   }
`
const StyledChildren = styled.div`
   display: flex;
   align-items: center;
   flex-direction: column;
   justify-content: space-between;
   border: 1px solid #320e3b;
   margin-top: 16px;
   border-radius: 4px;
`
