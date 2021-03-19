import React, { useContext } from 'react'
import { Flex } from '@dailykit/ui'
import MenuItem from '../MenuItem'
import NavMenuContext from '../../../../../context/NavMenu'

import { Parent, Children } from './styles'

const TreeView = ({
   data = [],
   onSelection,
   onToggle,
   showContextMenu,
   createMenuItem,
   updateMenuItem,
   deleteMenuItem,
}) => {
   const [navMenuContext, setNavMenuContext] = useContext(NavMenuContext)
   const { menuItems } = navMenuContext
   let treeData = []
   console.log('treeview', data, navMenuContext)
   if (data.length) {
      treeData = data
   } else {
      treeData = menuItems
   }
   if (treeData.length === 0) {
      return <div>No Folders!</div>
   }
   console.log('treeData', treeData)
   return treeData.map(node => {
      return (
         node.id && (
            <Parent key={node.id}>
               <MenuItem
                  createMenuItem={createMenuItem}
                  updateMenuItem={updateMenuItem}
                  deleteMenuItem={deleteMenuItem}
                  menuItem={node}
               />
               <Children>
                  {node.childNodes.length > 0 && (
                     <TreeView
                        data={node.childNodes}
                        onSelection={onSelection}
                        onToggle={onToggle}
                        showContextMenu={showContextMenu}
                        createMenuItem={createMenuItem}
                        updateMenuItem={updateMenuItem}
                        deleteMenuItem={deleteMenuItem}
                     />
                  )}
               </Children>
            </Parent>
         )
      )
   })
}

export default TreeView
