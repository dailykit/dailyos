import React from 'react'
import MenuIcon from './MenuIcon'
import { useBottomBar } from '../../providers'
import { getTreeViewArray } from '../../utils'
import Modal from '../Modal'
import Styles from './style'

const BottomBar = () => {
   const [isModalOpen, setIsModalOpen] = React.useState(false)
   const [isOpen, setIsOpen] = React.useState(false)
   const bottomBarRef = React.useRef()
   const {
      state,
      addClickedOptionInfo,
      addClickedOptionMenuInfo,
   } = useBottomBar()

   const handleBottomBarOptionClick = async option => {
      await addClickedOptionInfo(option)
      const treeData = await getTreeViewArray({
         dataset: option?.navigationMenu?.navigationMenuItems,
         rootIdKeyName: 'id',
         parentIdKeyName: 'parentNavigationMenuItemId',
      })
      await addClickedOptionMenuInfo({
         ...option?.navigationMenu,
         navigationMenuItems: treeData,
      })
      setIsModalOpen(true)
   }

   return (
      <>
         <Styles.Wrapper
            id="wrapper"
            onMouseOver={() => setIsOpen(true)}
            onMouseLeave={() => {
               if (!isModalOpen) {
                  setIsOpen(false)
               }
            }}
         >
            <Styles.BottomBarMenu
               onClick={() => {
                  setIsModalOpen(false)
                  setIsOpen(!isOpen)
               }}
            >
               <MenuIcon isOpen={isOpen} />
            </Styles.BottomBarMenu>
            {isOpen && (
               <Styles.OptionsWrapper ref={bottomBarRef}>
                  {state?.bottomBarOptions.map(option => {
                     return (
                        <Styles.Option
                           key={option.id}
                           active={
                              isModalOpen &&
                              state?.clickedOption?.navigationMenu?.id ===
                                 option?.navigationMenuId
                           }
                           onClick={() => handleBottomBarOptionClick(option)}
                        >
                           {option?.title || ''}
                        </Styles.Option>
                     )
                  })}
               </Styles.OptionsWrapper>
            )}
         </Styles.Wrapper>
         {state?.clickedOption && (
            <Modal
               isOpen={isModalOpen}
               setIsOpen={setIsOpen}
               setIsModalOpen={setIsModalOpen}
               bottomBarRef={bottomBarRef}
            />
         )}
      </>
   )
}

export default BottomBar
