import React, { useState, useContext } from 'react'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
} from '@dailykit/ui'

import { SachetOrderContext } from '../../../../context/sachetOrder'

import { TunnelContainer, TunnelHeader, Spacer } from '../../../../components'

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.views.forms.sachetworkorder.tunnels.'

export default function SelectSupplierTunnel({ close }) {
   const { t } = useTranslation()
   const { sachetOrderDispatch } = useContext(SachetOrderContext)

   const [search, setSearch] = useState('')

   const [list, current, selectOption] = useSingleList([
      {
         id: 1,
         title: 'Potato-001',
         shippedProcessing: [
            {
               id: 1,
               title: 'raw',
               shelfLife: 20,
               onHand: 2000,
               yield: 85,
               sachets: [
                  {
                     id: 1,
                     title: '200gm',
                     quantity: '200',
                     unit: 'gram',
                     available: 12,
                     total: 40,
                     par: 2,
                  },
                  {
                     id: 2,
                     title: '200gm',
                     quantity: '100',
                     unit: 'gram',
                     available: 9,
                     total: 20,
                     par: 2,
                  },
               ],
            },
            {
               id: 2,
               title: 'sliced',
               shelfLife: 20,
               onHand: 2000,
               yield: 82,
               sachets: [
                  {
                     id: 3,
                     title: '200gm',
                     quantity: '200',
                     unit: 'gram',
                     available: 12,
                     total: 40,
                     par: 2,
                  },
                  {
                     id: 4,
                     title: '200gm',
                     quantity: '100',
                     unit: 'gram',
                     available: 9,
                     total: 20,
                     par: 2,
                  },
               ],
            },
         ],
      },

      {
         id: 3,
         title: 'Lettuce-001',
         shippedProcessing: [
            {
               id: 3,
               title: 'raw',
               shelfLife: 20,
               onHand: 2000,
               yield: 92,
               sachets: [
                  {
                     id: 5,
                     title: '200gm',
                     title: '200gm',
                     quantity: '200',
                     unit: 'gram',
                     available: 12,
                     total: 40,
                     par: 2,
                  },
                  {
                     id: 5,
                     title: '200gm',
                     quantity: '100',
                     unit: 'gram',
                     available: 9,
                     total: 20,
                     par: 2,
                  },
               ],
            },
            {
               id: 4,
               title: 'Boiled',
               shelfLife: 20,
               onHand: 2000,
               yield: 88,
               sachets: [
                  {
                     id: 6,
                     title: '200gm',
                     quantity: '200',
                     unit: 'gram',
                     available: 12,
                     total: 40,
                     par: 2,
                  },
                  {
                     id: 7,
                     title: '200gm',
                     quantity: '100',
                     unit: 'gram',
                     available: 9,
                     total: 20,
                     par: 2,
                  },
               ],
            },
         ],
      },
   ])

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat("select supplier item"))}
            next={() => {
               sachetOrderDispatch({
                  type: 'ADD_SUPPLIER_ITEM',
                  payload: current,
               })
               close(1)
            }}
            close={() => close(1)}
            nextAction="Save"
         />

         <Spacer />

         <List>
            {Object.keys(current).length > 0 ? (
               <ListItem
                  type="SSL2"
                  content={{
                     title: current.title,
                     description: `Processings as shipped: ${current.shippedProcessing
                        .map(proc => proc.title)
                        .join(', ')}`,
                  }}
               />
            ) : (
                  <ListSearch
                     onChange={value => setSearch(value)}
                     placeholder={t(address.concat("type what you’re looking for"))}
                  />
               )}
            <ListOptions>
               {list
                  .filter(option => option.title.toLowerCase().includes(search))
                  .map(option => (
                     <ListItem
                        type="SSL2"
                        key={option.id}
                        isActive={option.id === current.id}
                        onClick={() => selectOption('id', option.id)}
                        content={{
                           title: option.title,
                           description: `Processings as shipped: ${option.shippedProcessing
                              .map(proc => proc.title)
                              .join(', ')}`,
                        }}
                     />
                  ))}
            </ListOptions>
         </List>
      </TunnelContainer>
   )
}
