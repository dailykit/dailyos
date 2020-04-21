import React, { useContext, useEffect } from 'react'
import {
   List,
   ListSearch,
   ListOptions,
   ListItem,
   TagGroup,
   Tag,
   useMultiList,
} from '@dailykit/ui'

import { ProductContext } from '../../../../../context/product'

import {
   TunnelContainer,
   TunnelHeader,
   Spacer,
} from '../../../../../components'

export default function SelectAccompaniments({ close }) {
   const { productState, productDispatch } = useContext(ProductContext)
   const [search, setSearch] = React.useState('')

   useEffect(() => {
      productState.itemView.recipes.forEach(recipe => {
         selectOption('id', recipe.id)
      })
   }, [])

   const [list, selected, selectOption] = useMultiList([
      {
         id: 1,
         items: [
            {
               defaultRecipe: {
                  img: 'https://picsum.photos/98/68',
                  title: 'Ketto Pizza',
               },
            },
            {
               defaultRecipe: {
                  img: 'https://picsum.photos/98/68',
                  title: 'Lasagna',
               },
            },
         ],
         img: 'https://picsum.photos/98/68',
         title: 'Ketto Pizza',
         servings: [1, 2, 6, 8],
         cost: { amount: 1, currency: '$', unit: 'serving' },
      },
      {
         id: 2,
         img: 'https://picsum.photos/98/68',
         title: 'Pasta',
         servings: [1, 2, 6],
         cost: { amount: 1.56, currency: '$', unit: 'serving' },
      },
      {
         id: 3,
         img: 'https://picsum.photos/98/68',
         title: 'Chowmein',
         servings: [1, 2, 4],
         cost: { amount: 0.78, currency: '$', unit: 'serving' },
      },
   ])

   return (
      <TunnelContainer>
         <TunnelHeader
            title={`Select Accompaniments for ${productState.itemView.itemName}`}
            close={() => {
               close(7)
            }}
            next={() => {
               productDispatch({
                  type: 'ADD_ACCOMPANIMENTS',
                  payload: selected,
               })
               close(7)
            }}
            nextAction="Save"
         />
         <Spacer />

         <List>
            <ListSearch
               onChange={value => setSearch(value)}
               placeholder="type what you’re looking for..."
            />
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
                        key={option.id}
                        type="MSL31"
                        content={{
                           img: option.img,
                           title: option.title,
                           servings: option.servings,
                           cost: option.cost,
                        }}
                        onClick={() => selectOption('id', option.id)}
                        isActive={selected.find(item => item.id === option.id)}
                     />
                  ))}
            </ListOptions>
         </List>
      </TunnelContainer>
   )
}
