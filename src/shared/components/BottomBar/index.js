import React from 'react'
import MenuIcon from './MenuIcon'
import { useBottomBar } from '../../providers'
import { getTreeViewArray } from '../../utils'
import Modal from '../Modal'
import Styles from './style'
import { useWindowSize } from '../../hooks/useWindowSize'
import { useLocation } from 'react-router'
import qs from 'query-string'

const BottomBar = () => {
   const [isModalOpen, setIsModalOpen] = React.useState(false)
   const [isOpen, setIsOpen] = React.useState(false)
   const bottomBarRef = React.useRef()
   const { width } = useWindowSize()
   const { search } = useLocation()
   const [isContentOpen, setIsContentOpen] = React.useState(false)
   const [hasAction, setHasAction] = React.useState(false)
   const [filePaths, setfilePaths] = React.useState([])
   const [cssPaths, setCssPaths] = React.useState([])
   const [jsPaths, setJsPaths] = React.useState([])

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
      setIsOpen(true)
   }

   const handleMenuItemClick = menuItem => {
      if (menuItem?.action?.actionTypeTitle === 'infoOverlay') {
         const { path, linkedCssFiles, linkedJsFiles } = menuItem?.action?.file
         const linkedCssPaths = linkedCssFiles.map(file => {
            return file.cssFile.path
         })
         const linkedJsPaths = linkedJsFiles.map(file => {
            return file.jsFile.path
         })
         setfilePaths([path])
         setCssPaths(linkedCssPaths)
         setJsPaths(linkedJsPaths)
         setIsContentOpen(true)
      } else {
         document.getElementById('content_area').innerHTML = ''
      }
   }

   React.useEffect(() => {
      const searchedValue = qs.parse(search)
      const optionId = Number(searchedValue?.optionId)
      const navigationMenuItemId = Number(searchedValue?.navigationMenuItemId)

      if (optionId) {
         const [filtered] = state?.bottomBarOptions.filter(
            option => option.id === optionId
         )
         if (filtered) {
            handleBottomBarOptionClick(filtered)
            const [
               filteredNavMenuItem,
            ] = filtered?.navigationMenu?.navigationMenuItems.filter(
               item => item.id === navigationMenuItemId
            )
            if (filteredNavMenuItem?.actionId && filteredNavMenuItem) {
               setHasAction(true)
               handleMenuItemClick(filteredNavMenuItem)
            }
         }
      }
   }, [])

   return (
      <>
         <Styles.Wrapper
            id="wrapper"
            onMouseOver={() => {
               if (width > 565) {
                  setIsOpen(true)
               }
            }}
            onMouseLeave={() => {
               if (!isModalOpen) {
                  setIsOpen(false)
               }
            }}
            onClick={() => {
               setIsModalOpen(false)
               setIsOpen(!isOpen)
            }}
         >
            <Styles.BottomBarMenu>
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
               handleMenuItemClick={handleMenuItemClick}
               isContentOpen={isContentOpen}
               setIsContentOpen={setIsContentOpen}
               filePaths={filePaths}
               cssPaths={cssPaths}
               jsPaths={jsPaths}
               setJsPaths={setJsPaths}
               setCssPaths={setCssPaths}
               setfilePaths={setfilePaths}
               hasAction={hasAction}
            />
         )}
      </>
   )
}

export default BottomBar
