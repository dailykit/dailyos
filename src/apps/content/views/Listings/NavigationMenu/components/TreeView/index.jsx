import React, { useContext } from 'react'
import { Flex } from '@dailykit/ui'
import MenuItem from '../MenuItem'
import NavMenuContext from '../../../../../context/NavMenu'

import { Parent, Children, EmptyMsg } from './styles'

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
      return <EmptyMsg>No Menu Item! Try adding one!</EmptyMsg>
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
