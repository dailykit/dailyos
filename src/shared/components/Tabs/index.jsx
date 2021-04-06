import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTabs } from '../../providers'
import { useWindowSize } from '../../hooks'
import { StyledTabs, HomeButton, StyledButton } from './styled'
import { DoubleArrowIcon, HomeIcon } from '../../assets/icons'
import Tab from './Tab'
import ThreeDots from '../../assets/icons/ThreeDots'
import TabOption from '../TabBar/components/Tools/TabOption'
import { useOnClickOutside } from '@dailykit/ui'

const Tabs = () => {
   const { pathname } = useLocation()
   const view = useWindowSize()
   const { tabs } = useTabs()
   const [firstIndex, setFirstIndex] = useState(0)
   const [lastIndex, setLastIndex] = useState(4)
   const [open, setOpen] = useState(false)
   const buttonRef = useRef()

   useOnClickOutside(buttonRef, () => setOpen(false))

   useEffect(() => {
      if (view.width) setLastIndex(numTabsToShow)
      if (tabs.length <= numTabsToShow) {
         setFirstIndex(0)
         setLastIndex(tabs.length)
      }
   }, [view, tabs.length])

   const widthForTabs = Math.floor(view.width - 470)
   const tabWidth = 122
   let numTabsToShow = Math.floor(widthForTabs / tabWidth)
   const tabsToShow = tabs.slice(firstIndex, lastIndex)

   const handleTabForward = () => {
      if (lastIndex + numTabsToShow > tabs.length) {
         let tabsRemain = tabs.length - lastIndex
         setFirstIndex(lastIndex - (numTabsToShow - tabsRemain))
         setLastIndex(tabs.length)
      } else {
         setFirstIndex(lastIndex)
         setLastIndex(lastIndex + numTabsToShow)
      }
   }
   const handleTabPrev = () => {
      if (firstIndex <= numTabsToShow) {
         setFirstIndex(0)
         setLastIndex(numTabsToShow)
      } else {
         setFirstIndex(firstIndex - numTabsToShow)
         setLastIndex(lastIndex - numTabsToShow)
      }
   }

   return (
      <>
         <StyledTabs>
            <HomeButton active={pathname === '/'} to="/">
               <HomeIcon color={pathname === '/' ? '#367BF5' : '#919699'} />
            </HomeButton>
            {tabs.length > 0 && (
               <>
                  {firstIndex !== 0 && (
                     <button onClick={() => handleTabPrev()}>
                        <DoubleArrowIcon direction="left" />
                     </button>
                  )}
               </>
            )}
            {tabsToShow.map((tab, index) => (
               <Tab tab={tab} key={tab.path} index={index} />
            ))}
            {tabs.length > 0 && (
               <>
                  {numTabsToShow < tabs.length && tabs.length !== lastIndex && (
                     <button onClick={() => handleTabForward()}>
                        <DoubleArrowIcon />
                     </button>
                  )}
               </>
            )}
            {tabs.length > 0 && (
               <div ref={buttonRef}>
                  <StyledButton
                     open={open}
                     size="sm"
                     type="ghost"
                     style={{ outline: 'none' }}
                     onClick={() => setOpen(!open)}
                  >
                     <ThreeDots color={open ? '#367BF5' : '#45484C'} />
                  </StyledButton>
               </div>
            )}
         </StyledTabs>
         {open && <TabOption />}
      </>
   )
}

export default Tabs
