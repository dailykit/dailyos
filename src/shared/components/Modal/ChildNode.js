import React from 'react'
import styled from 'styled-components'
import { ChevronDown, ChevronRight, ChevronUp } from '../../assets/icons'

const ChildNode = ({ child, toggleMenu, clickHandler }) => {
   const [toggleParent, setToggleParent] = React.useState(false)
   const [toggleChild, setToggleChild] = React.useState(false)

   return (
      <StyledChild>
         <div>
            <p onClick={() => clickHandler(child)}>{child.label}</p>

            {child?.childNodes?.length > 0 && toggleParent && (
               <StyledButton
                  hasChild={child?.childNodes?.length > 0}
                  onClick={() => setToggleParent(!toggleParent)}
               >
                  <ChevronUp size="16px" color="#fff" />
               </StyledButton>
            )}
            {child?.childNodes?.length > 0 && !toggleParent && (
               <StyledButton
                  hasChild={child?.childNodes?.length > 0}
                  onClick={() => setToggleParent(!toggleParent)}
               >
                  <ChevronDown size="16px" color="#fff" />
               </StyledButton>
            )}
         </div>
         {toggleParent &&
            child?.childNodes?.map(c => {
               return (
                  <div>
                     <p onClick={() => clickHandler(c)}>{c.label}</p>

                     {c?.childNodes?.length > 0 && toggleChild && (
                        <StyledButton
                           hasChild={c?.childNodes?.length > 0}
                           onClick={() => setToggleChild(!toggleChild)}
                        >
                           <ChevronUp size="16px" color="#fff" />
                        </StyledButton>
                     )}
                     {c?.childNodes?.length > 0 && !toggleChild && (
                        <StyledButton
                           hasChild={c?.childNodes?.length > 0}
                           onClick={() => setToggleChild(!toggleChild)}
                        >
                           <ChevronDown size="16px" color="#fff" />
                        </StyledButton>
                     )}
                  </div>
               )
            })}
      </StyledChild>
   )
}

export default ChildNode

const StyledButton = styled.button`
   border: none;
   height: 18px;
   width: 18px;
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
const StyledChild = styled.div`
   width: 100%;
   font-style: normal;
   font-weight: 500;
   font-size: 12px;
   line-height: 14px;
   padding: 8px;
   background: #3c1845;
   > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px;
      text-transform: capitalize;
   }
`
