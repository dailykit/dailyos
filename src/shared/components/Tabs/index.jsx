import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTabs } from '../../providers'
import { useWindowSize } from '../../hooks'
import { StyledTabs, HomeButton, StyledButton, TabsWrapper } from './styled'
import { DoubleArrowIcon, HomeIcon } from '../../assets/icons'
import ThreeDots from '../../assets/icons/ThreeDots'
import TabOption from './components/TabOption'
import { useOnClickOutside } from '@dailykit/ui'
import Tab from './components/Tab'

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
      if (view.width) {
         setFirstIndex(0)
         setLastIndex(numTabsToShow)
      }
      if (tabs.length <= numTabsToShow) {
         setFirstIndex(0)
         setLastIndex(tabs.length)
      }
   }, [view.width, tabs.length])

   const toolBarWidth = view.width > 767 ? 470 : 270
   const widthForTabs = Math.floor(view.width - toolBarWidth)
   const tabWidth = 120
   let numTabsToShow = Math.floor(widthForTabs / tabWidth) + 1
   const tabsToShow = tabs.slice(firstIndex, lastIndex)

   const rightArrowOpen =
      numTabsToShow < tabs.length && tabs.length !== lastIndex
   const leftArrowOpen = firstIndex !== 0

   const getLastTabWidth = () => {
      let lastTabWidth = numTabsToShow * tabWidth - widthForTabs
      if (leftArrowOpen && rightArrowOpen) {
         lastTabWidth = numTabsToShow * tabWidth - widthForTabs
      } else if (!leftArrowOpen && !rightArrowOpen) {
         lastTabWidth -= 70
      } else {
         lastTabWidth -= 35
      }
      return lastTabWidth
   }

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
      <TabsWrapper>
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
         <StyledTabs lastTabWidth={getLastTabWidth()}>
            {tabsToShow.map((tab, index) => (
               <Tab tab={tab} key={tab.path} index={index} />
            ))}
         </StyledTabs>
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
            <div ref={buttonRef} style={{ position: 'relative' }}>
               <StyledButton
                  open={open}
                  size="sm"
                  type="ghost"
                  style={{ outline: 'none' }}
                  onClick={() => setOpen(!open)}
               >
                  <ThreeDots color={open ? '#367BF5' : '#45484C'} />
               </StyledButton>
               {open && <TabOption />}
            </div>
         )}
      </TabsWrapper>
   )
}

export default Tabs
