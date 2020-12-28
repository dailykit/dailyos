import React from 'react'

import { ArrowUp, ArrowDown } from '../../assets/Icons'

import { Parent, Node, Children, Icon } from './styles'

const TreeView = ({ data, onSelection, onToggle, showContextMenu }) => {
   if (data.length === 0) {
      return <div>No Folders!</div>
   }
   return data.map((node, nodeIndex) => {
      return (
         node.name && (
            <Parent key={node.name}>
               <Node
                  isOpen={node.isOpen}
                  onClick={() => {
                     onSelection(node, nodeIndex)
                  }}
                  onContextMenu={e => showContextMenu(e, node)}
               >
                  <span>{node.name}</span>
                  {node.children && node.children.length > 0 && (
                     <Icon
                        isOpen={node.isOpen}
                        onClick={e => {
                           e.stopPropagation()
                           onToggle(node.name)
                        }}
                     >
                        {node.isOpen ? <ArrowUp /> : <ArrowDown />}
                     </Icon>
                  )}
               </Node>
               {node.isOpen && (
                  <Children>
                     {node.children.length > 0 && (
                        <TreeView
                           data={node.children}
                           onSelection={onSelection}
                           onToggle={onToggle}
                           showContextMenu={showContextMenu}
                        />
                     )}
                  </Children>
               )}
            </Parent>
         )
      )
   })
}

export default TreeView
