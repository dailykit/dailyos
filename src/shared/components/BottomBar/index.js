import React from 'react'
import MenuIcon from './MenuIcon'
import { useBottomBar } from '../../providers'
import { getTreeViewArray } from '../../utils'
import Modal from '../Modal'
import Styles from './style'

const BottomBar = () => {
   const [isModalOpen, setIsModalOpen] = React.useState(false)
   const [isOpen, setIsOpen] = React.useState(false)

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

   React.useEffect(() => {
      const timeId = setTimeout(() => {
         if (!isModalOpen) {
            setIsOpen(false)
         } else {
            setIsOpen(true)
         }
      }, 2000)
      return () => {
         clearTimeout(timeId)
      }
   }, [isOpen, isModalOpen])

   return (
      <>
         <Styles.Wrapper>
            <Styles.BottomBarMenu
               onClick={() => {
                  setIsModalOpen(false)
                  setIsOpen(!isOpen)
               }}
               onMouseEnter={() => setIsOpen(true)}
            >
               <MenuIcon isOpen={isOpen} />
            </Styles.BottomBarMenu>
            {isOpen && (
               <Styles.BottomBarWrapper>
                  <Styles.BottomBar>
                     {state?.bottomBarOptions.map(option => {
                        return (
                           <div className="option" key={option.id}>
                              <Styles.Option
                                 active={
                                    isModalOpen &&
                                    state?.clickedOption?.navigationMenu?.id ===
                                       option?.navigationMenuId
                                 }
                                 onClick={() =>
                                    handleBottomBarOptionClick(option)
                                 }
                              >
                                 {option?.title || ''}
                              </Styles.Option>
                           </div>
                        )
                     })}
                  </Styles.BottomBar>
               </Styles.BottomBarWrapper>
            )}
         </Styles.Wrapper>
         {state?.clickedOption && (
            <Modal isOpen={isModalOpen} close={() => setIsModalOpen(false)} />
         )}
      </>
   )
}

export default BottomBar
