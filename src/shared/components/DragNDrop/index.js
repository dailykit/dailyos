import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Flex } from '@dailykit/ui'
import { set } from 'lodash'
export default function DragNDrop({ list, droppableId, children }) {
   const [data, setData] = useState(list)

   const onDragEnd = result => {
      //return if item was dropped outside
      if (!result.destination) return
      // return if item was dropped to the same place
      if (
         result.source.droppableId === result.destination.droppableId &&
         result.source.index === result.destination.index
      )
         return
      //get the items array
      const newItems = [...data]
      //get the draggedItems
      const draggedItems = newItems[result.source.index]
      //delete the item from the source position and insert it to the destination position
      newItems.splice(result.source.index, 1)
      newItems.splice(result.destination.index, 0, draggedItems)
      //create a new data
      //update state
      setData(newItems)
   }
   return (
      <DragDropContext onDragEnd={onDragEnd}>
         <Droppable droppableId={droppableId}>
            {provided => (
               <div {...provided.droppableProps} ref={provided.innerRef}>
                  {children.map((item, index) => (
                     <Draggable
                        key={index}
                        draggableId={'' + index}
                        index={index}
                     >
                        {/* <div
                           ref={provided.innerRef}
                           {...provided.draggableProps}
                           {...provided.dragHandleProps}
                        >
                           {item}
                        </div> */}
                        {provided => (
                           <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                           >
                              {item}
                           </div>
                        )}
                     </Draggable>
                  ))}
                  {provided.placeholder}
               </div>
            )}
         </Droppable>
      </DragDropContext>
   )
}
