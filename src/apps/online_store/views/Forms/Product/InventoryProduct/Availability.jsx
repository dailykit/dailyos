import React from 'react'
import { Text, IconButton, TagGroup, Tag, ButtonTile } from '@dailykit/ui'

import { Content, Flexible } from '../styled'
import { InventoryProductContext } from '../../../../context/product/inventoryProduct'
import EditIcon from '../../../../assets/icons/Edit'

export default function Availability({ open }) {
   const { inventoryProductState } = React.useContext(InventoryProductContext)

   return (
      <Content>
         <Flexible width="2">
            {inventoryProductState.description.length > 0 ? (
               <>
                  <div style={{ display: 'flex' }}>
                     <Text as="title">{inventoryProductState.description}</Text>
                     <span style={{ marginLeft: '10px' }}>
                        <IconButton type="solid" onClick={() => open(3)}>
                           <EditIcon />
                        </IconButton>
                     </span>
                  </div>
                  <br />
                  {inventoryProductState.tags.length > 0 && (
                     <TagGroup>
                        {inventoryProductState.tags.map(tag => (
                           <Tag key={tag}>{tag}</Tag>
                        ))}
                     </TagGroup>
                  )}
                  <br />
               </>
            ) : (
               <ButtonTile
                  type="primary"
                  size="sm"
                  text="Add Product Description"
                  onClick={e => open(3)}
                  style={{ margin: '20px 0' }}
               />
            )}
         </Flexible>
         <Flexible width="1">
            <div
               style={{
                  width: '70%',
                  margin: 'auto',
                  height: '100%',
               }}
            >
               <Content style={{ alignItems: 'center' }}>
                  <Text as="h2">Availability</Text>
                  <div style={{ marginLeft: '5px' }}>
                     <IconButton type="ghost" onClick={() => open(5)}>
                        <EditIcon />
                     </IconButton>
                  </div>
               </Content>

               <div
                  style={{
                     display: 'flex',
                     margin: '10px 0',
                  }}
               >
                  {inventoryProductState.realtime && (
                     <div>
                        <Text as="title">Realtime</Text>
                     </div>
                  )}
                  {inventoryProductState.preOrder.isActive && (
                     <div style={{ marginLeft: '60px' }}>
                        <div>
                           <Text as="title">Pre-order</Text>
                        </div>
                        <div>
                           <Text as="title">
                              {inventoryProductState.preOrder.days} Days
                           </Text>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </Flexible>
      </Content>
   )
}
