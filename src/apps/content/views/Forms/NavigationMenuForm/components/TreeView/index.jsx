import React from 'react'
import { Flex } from '@dailykit/ui'
import MenuItem from '../MenuItem'

import { Parent, Node, Children } from './styles'

const TreeView = ({
   data,
   onSelection,
   onToggle,
   showContextMenu,
   createMenuItem,
   updateMenuItem,
   deleteMenuItem,
   menuId,
}) => {
   if (data.length === 0) {
      return <div>No Folders!</div>
   }
   console.log('data', data)
   return data.map((node, nodeIndex) => {
      return (
         node.id && (
            <Parent key={node.id}>
               <MenuItem
                  createMenuItem={createMenuItem}
                  updateMenuItem={updateMenuItem}
                  deleteMenuItem={deleteMenuItem}
                  menuId={menuId}
                  menuItem={node}
               />
               {/* </Node> */}
               {/* </Flex> */}
               {/* {node.isOpen && ( */}
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
                        menuId={menuId}
                     />
                  )}
               </Children>
               {/* )} */}
            </Parent>
         )
      )
   })
}

export default TreeView
