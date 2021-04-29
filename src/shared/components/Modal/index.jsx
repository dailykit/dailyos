import React, { useEffect, useState } from 'react'
import { ComboButton, ClearIcon } from '@dailykit/ui'
import { webRenderer } from '@dailykit/web-renderer'
import { ModalWrapper } from './styles'
import TreeView from './treeView'
import { useBottomBar } from '../../providers'
import { getTreeViewArray } from '../../utils'

export default function Modal({ isOpen, close }) {
   const { state = {} } = useBottomBar()
   const [optionMenu, setOptionMenu] = useState({})
   const [filePaths, setfilePaths] = useState([])
   const [cssPaths, setCssPaths] = useState([])
   const [jsPaths, setJsPaths] = useState([])
   console.log(state)

   useEffect(() => {
      if (state?.clickedOptionMenu) {
         setOptionMenu(state?.clickedOptionMenu)
      }
   }, [state?.clickedOptionMenu])

   const handleMenuItemClick = menuItem => {
      console.log('MENU ITEM', menuItem)
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
      } else {
         document.getElementById('content_area').innerHTML = ''
      }
   }

   useEffect(() => {
      document.getElementById('content_area').innerHTML = ''
   }, [state])

   useEffect(() => {
      if (filePaths.length) {
         document.getElementById('content_area').innerHTML = ''
         webRenderer({
            type: 'file',
            config: {
               uri: process.env.REACT_APP_DATA_HUB_URI,
               adminSecret: process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET,
               expressUrl: process.env.REACT_APP_EXPRESS_URL,
            },
            fileDetails: [
               {
                  elementId: 'content_area',
                  filePath: filePaths,
                  csspath: cssPaths,
                  jsId: jsPaths,
               },
            ],
         })
      }
      return () => {
         document.getElementById('content_area').innerHTML = ''
      }
   }, [filePaths])
   return (
      <ModalWrapper show={isOpen}>
         <div className="modal_header">
            <ComboButton type="ghost" onClick={close}>
               <ClearIcon color="#45484C" />
               CLOSE
            </ComboButton>
         </div>
         <div className="modal_body">
            <div className="menu_area">
               <div className="menu_area_header">
                  <h2>{optionMenu?.title || 'Title'}</h2>
                  <p>{optionMenu?.description || 'Description'}</p>
               </div>
               <TreeView
                  data={optionMenu?.navigationMenuItems}
                  clickHandler={handleMenuItemClick}
               />
            </div>
            <div className="content_area">
               <h1 className="heading_h1">Content Area</h1>
               <div id="content_area" />
            </div>
         </div>
      </ModalWrapper>
   )
}
