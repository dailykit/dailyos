import React from 'react'
import { Text, IconButton, TagGroup, Tag, ButtonTile } from '@dailykit/ui'

import { Content, Flexible } from './styled'
import { ProductContext } from '../../../context/product'
import EditIcon from '../../../assets/icons/Edit'

import { useTranslation } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.'

export default function Availability({ open }) {
   const { t } = useTranslation()
   const { productState } = React.useContext(ProductContext)

   return (
      <Content>
         <Flexible width="2">
            {productState.description.length > 0 ? (
               <>
                  <div style={{ display: 'flex' }}>
                     <Text as="title">{productState.description}</Text>
                     <span style={{ marginLeft: '10px' }}>
                        <IconButton type="solid" onClick={() => open(3)}>
                           <EditIcon />
                        </IconButton>
                     </span>
                  </div>
                  <br />
                  {productState.tags.length > 0 && (
                     <TagGroup>
                        {productState.tags.map(tag => (
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
                     text={t(address.concat("add product description"))}
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
                  <Text as="h2">{t(address.concat('availability'))}</Text>
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
                  {productState.realtime && (
                     <div>
                        <Text as="title">{t(address.concat('realtime'))}</Text>
                     </div>
                  )}
                  {productState.preOrder.isActive && (
                     <div style={{ marginLeft: '60px' }}>
                        <div>
                           <Text as="title">{t(address.concat('pre-order'))}</Text>
                        </div>
                        <div>
                           <Text as="title">
                              {productState.preOrder.days} {t(address.concat('days'))}
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
