import React, { useEffect, useContext } from 'react'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useMultiList,
   TagGroup,
   Tag,
} from '@dailykit/ui'

import { SachetOrderContext } from '../../../../context/sachetOrder'

import { TunnelContainer, TunnelHeader, Spacer } from '../../../../components'

<<<<<<< HEAD:src/apps/online_store/views/Forms/Product/InventoryProduct/Tunnels/AccompanimentTypeTunnel.jsx
import { useTranslation } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.inventoryproduct.tunnels.'

export default function AccompanimentType({ close }) {
   const { t } = useTranslation()
   const { inventoryProductState, inventoryProductDispatch } = useContext(
      InventoryProductContext
=======
export default function SelectLabelTemplateTunnel({ close }) {
   const { sachetOrderState, sachetOrderDispatch } = useContext(
      SachetOrderContext
>>>>>>> 9ddf6699a763d989cd56e66611d8ac668ec40f59:src/apps/inventory/views/Forms/SachetWorkOrder/Tunnels/SelectLabelTemplateTunnel.jsx
   )

   const [search, setSearch] = React.useState('')

   const [list, selected, selectOption] = useMultiList([
      {
         id: 1,
         title: 'Slip Name',
      },
      { id: 2, title: 'Bar Code' },
      {
         id: 3,
         title: 'Sachet Quantity',
      },
      { id: 4, title: 'Supplier Name' },
      { id: 4, title: 'Packaging date' },
   ])

   useEffect(() => {
      sachetOrderState.labelTemplates.forEach(temp => {
         selectOption('id', temp.id)
      })
   }, [])

   return (
      <TunnelContainer>
         <TunnelHeader
            title="Select Label Templates"
            next={() => {
               sachetOrderDispatch({
                  type: 'SELECT_TEMPLATE_OPTIONS',
                  payload: selected,
               })
               close(7)
            }}
            close={() => close(7)}
            nextAction="Save"
         />

         <Spacer />

         <List>
<<<<<<< HEAD:src/apps/online_store/views/Forms/Product/InventoryProduct/Tunnels/AccompanimentTypeTunnel.jsx
            <Content>
               <ListSearch
                  onChange={value => setSearch(value)}
                  placeholder={t(address.concat("type what you’re looking for").concat('...'))}
               />
               <ComboButton type="ghost" onClick={() => { }}>
                  <AddIcon />
                  {t(address.concat('new'))}
               </ComboButton>
            </Content>
=======
            <ListSearch
               onChange={value => setSearch(value)}
               placeholder="type what you’re looking for..."
            />
>>>>>>> 9ddf6699a763d989cd56e66611d8ac668ec40f59:src/apps/inventory/views/Forms/SachetWorkOrder/Tunnels/SelectLabelTemplateTunnel.jsx
            {selected.length > 0 && (
               <TagGroup style={{ margin: '8px 0' }}>
                  {selected.map(option => (
                     <Tag
                        key={option.id}
                        title={option.title}
                        onClick={() => selectOption('id', option.id)}
                     >
                        {option.title}
                     </Tag>
                  ))}
               </TagGroup>
            )}
            <ListOptions>
               {list
                  .filter(option => option.title.toLowerCase().includes(search))
                  .map(option => (
                     <ListItem
                        type="MSL1"
                        key={option.id}
                        title={option.title}
                        onClick={() => selectOption('id', option.id)}
                        isActive={selected.find(item => item.id === option.id)}
                     />
                  ))}
            </ListOptions>
         </List>
      </TunnelContainer>
   )
}
