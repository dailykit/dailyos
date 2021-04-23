import React, { useState } from 'react'
import styled from 'styled-components'
import { ChevronRight, ChevronDown } from '../../assets/icons'
import { toggleNode } from './utils.js'
import { useBottomBar } from '../../providers'

export default function MenuItem({ menuItem = {}, clickHandler, ...props }) {
   const { state, addClickedOptionMenuInfo } = useBottomBar()
   const [toggleMenu, setToggleMenu] = useState(menuItem?.isChildOpen || true)

   const handleClick = async () => {
      setToggleMenu(prev => !prev)
      const mutated = await toggleNode(
         state?.clickedOptionMenu?.navigationMenuItems,
         menuItem.id
      )
      console.log('mutationllll', mutated)
      addClickedOptionMenuInfo({
         ...state?.clickedOptionMenu,
         navigationMenuItems: mutated,
      })
      clickHandler(menuItem)
   }

   return (
      <StyledWrapper onClick={handleClick} {...props}>
         <span>
            {toggleMenu ? (
               <ChevronDown size="16px" color="#fff" />
            ) : (
               <ChevronRight size="16px" color="#fff" />
            )}
         </span>
         <p>{menuItem?.label}</p>
      </StyledWrapper>
   )
}

export const StyledWrapper = styled.div`
   width: 100%;
   display: flex;
   align-items: center;
   cursor: pointer;
`
