import React, { useState } from 'react'
import { StyledWrapper } from './styles'
import {
   ChevronRight,
   ChevronDown,
   DeleteIcon,
} from '../../../../../../../shared/assets/icons'
import { randomSuffix } from '../../../../../../../shared/utils'

export default function MenuItem({
   createMenuItem,
   updateMenuItem,
   deleteMenuItem,
   menuId,
   menuItem,
}) {
   const [isPopupActive, setIsPopupActive] = useState(false)
   const [isChildVisible, setIsChildVisible] = useState(false)
   const [label, setLabel] = useState(menuItem?.label || '')
   const [url, setUrl] = useState(menuItem?.url || '')
   const showPopup = () => {
      setIsPopupActive(prev => !prev)
   }
   const showChild = () => {
      setIsChildVisible(prev => !prev)
   }

   // create menu item handler
   const createMenuItemHandler = type => {
      createMenuItem({
         variables: {
            label: `label-${randomSuffix()}`,
            navigationMenuId: menuId,
            parentNavigationMenuItemId:
               type === 'childItem' ? menuItem.id : null,
         },
      })
   }

   // update menu item handler

   const onBlurHandler = e => {
      const { name, value } = e.target
      updateMenuItem({
         variables: {
            menuItemId: menuItem.id,
            _set: {
               [name]: value,
            },
         },
      })
   }

   // delete menu item handler
   const deleteMenuItemHandler = () => {
      deleteMenuItem({
         variables: {
            menuItemId: menuItem.id,
         },
      })
   }

   return (
      <StyledWrapper isPopupActive={isPopupActive}>
         <div className="menuItemDiv">
            <div className="menuContent-left">
               <span className="chevronIcon" onClick={showChild}>
                  {isChildVisible ? (
                     <ChevronDown size="24px" color="#0091ae" />
                  ) : (
                     <ChevronRight size="24px" color="#0091ae" />
                  )}
               </span>
               <input
                  className="menu-item-label-input"
                  name="label"
                  type="text"
                  placeholder="Menu item label"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  onBlur={onBlurHandler}
               />
            </div>
            <div className="menuContent-right">
               <div className="menuContent-right-item">
                  <div className="menu-right-option">
                     <input
                        type="text"
                        name="url"
                        className="menu-item-label-input"
                        placeholder="URL"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        onBlur={onBlurHandler}
                     />
                  </div>
                  <div className="action" id="actionOption">
                     <button
                        type="button"
                        onClick={showPopup}
                        className="action-button-option"
                     >
                        Action
                        <span>
                           <ChevronDown size="24px" color="#0091ae" />
                        </span>
                     </button>
                     <button
                        type="button"
                        className="delete-button-option action-button-option"
                     >
                        <span onClick={deleteMenuItemHandler}>
                           <DeleteIcon size="24px" color="#0091ae" />
                        </span>
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* popup modal for action */}
         <div className="modal">
            <div className="pointer" />
            <div className="modal-content">
               <ul className="action-list">
                  <li className="action-list-item">
                     <button
                        type="button"
                        className="list-btn"
                        onClick={() => createMenuItemHandler('childItem')}
                     >
                        Add child item below
                     </button>
                  </li>
                  <li className="action-list-item">
                     <button
                        type="button"
                        className="list-btn"
                        onClick={() => createMenuItemHandler('rootItem')}
                     >
                        Add item below
                     </button>
                  </li>
               </ul>
            </div>
         </div>
      </StyledWrapper>
   )
}
