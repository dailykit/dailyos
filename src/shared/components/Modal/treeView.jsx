import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import MenuItem from './menuItem'

const TreeView = ({ data = [], onToggle, clickHandler }) => {
   let treeData = data
   //    if (data.length) {
   //       treeData = data
   //    } else {
   //       treeData = menuItems
   //    }
   if (treeData.length === 0) {
      return <EmptyMsg>No Menu Item! Try adding one!</EmptyMsg>
   }
   return (
      <>
         {treeData.map(node => {
            return (
               node.id && (
                  <Parent key={node.id}>
                     <MenuItem clickHandler={clickHandler} menuItem={node} />

                     {node.isChildOpen && (
                        <Children>
                           {node.childNodes.length > 0 && (
                              <TreeView
                                 data={node.childNodes}
                                 onToggle={onToggle}
                                 clickHandler={clickHandler}
                              />
                           )}
                        </Children>
                     )}
                  </Parent>
               )
            )
         })}
      </>
   )
}

export default TreeView

export const Parent = styled.div`
   height: auto;
   display: flex;
   flex-direction: column;
   padding: 2px;
   align-items: flex-start;
`

export const Children = styled.div`
   padding-left: 24px;
`
export const EmptyMsg = styled.div`
   margin: 16px;
   font-size: 20px;
`
