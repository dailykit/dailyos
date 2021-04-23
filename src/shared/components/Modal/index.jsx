import React, { useEffect, useState } from 'react'
import { ComboButton, ClearIcon } from '@dailykit/ui'
import { webRenderer } from '@dailykit/web-renderer'
import { ModalWrapper } from './styles'
import { useBottomBar } from '../../providers'

export default function Modal({ isOpen, close }) {
   console.log('ENVV', process.env.REACT_EXPRESS_URL)
   const { state = {} } = useBottomBar()
   const [filePaths, setfilePaths] = useState([])
   const [cssPaths, setCssPaths] = useState([])
   const [jsPaths, setJsPaths] = useState([])
   console.log(state)
   const { clickedOption = {} } = state
   const { navigationMenu = {} } = clickedOption
   const { navigationMenuItems = [] } = navigationMenu

   const handleMenuItemClick = menuItem => {
      console.log(menuItem, 'kkk')
      if (menuItem?.action?.actionTypeTitle === 'infoOverlay') {
         console.log(menuItem)
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
            <ComboButton type="ghost" size="sm" onClick={close}>
               <ClearIcon color="#367BF5" />
               Close
            </ComboButton>
         </div>
         <div className="modal_body">
            <div className="menu_area">
               <h1>{navigationMenu?.title || 'Title'}</h1>
               <ul>
                  {navigationMenuItems.map(menuItem => {
                     return (
                        <li
                           key={menuItem?.id}
                           onClick={() => handleMenuItemClick(menuItem)}
                        >
                           {menuItem?.label}
                        </li>
                     )
                  })}
               </ul>
            </div>
            <div className="content_area" id="content_area"></div>
         </div>
      </ModalWrapper>
   )
}
