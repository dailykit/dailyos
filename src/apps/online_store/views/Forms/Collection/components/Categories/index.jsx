import React from 'react'
import { Input, ButtonTile, Text } from '@dailykit/ui'

import { Category, Title, Products, Product } from './styled'
import { CollectionContext } from '../../../../../context/collection'
import DeleteIcon from '../../../../../assets/icons/Delete'

import { useTranslation } from 'react-i18next'

const address =
   'apps.online_store.views.forms.collection.components.categories.'

const Categories = ({ openTunnel }) => {
   const { t } = useTranslation()
   const { collectionState, collectionDispatch } = React.useContext(
      CollectionContext
   )
   const [title, setTitle] = React.useState('')

   const create_category = () => {
      if (title) {
         collectionDispatch({
            type: 'CREATE_CATEGORY',
            payload: {
               title,
            },
         })
         setTitle('')
      }
   }

   const add_product = index => {
      collectionDispatch({
         type: 'CURRENT_CATEGORY',
         payload: { index },
      })
      openTunnel(1)
   }

   return (
      <React.Fragment>
         {collectionState.categories.map((category, index) => (
            <Category key={index}>
               <Title>
                  <Input
                     type="text"
                     placeholder={t(address.concat('category name'))}
                     value={category.title}
                     onChange={e =>
                        collectionDispatch({
                           type: 'CATEGORY_TITLE',
                           payload: {
                              index,
                              title: e.target.value,
                           },
                        })
                     }
                  />
                  <span
                     onClick={() =>
                        collectionDispatch({
                           type: 'DELETE_CATEGORY',
                           payload: { title: category.title },
                        })
                     }
                  >
                     <DeleteIcon color="#FF6B5E" />
                  </span>
               </Title>
               {/* Sub categories will come here */}
               <Products>
                  {category.products.map(product => (
                     <Product key={product.id}>
                        <Text as="p">{product.title}</Text>
                        <span
                           onClick={() =>
                              collectionDispatch({
                                 type: 'DELETE_PRODUCT',
                                 payload: {
                                    product,
                                    category: {
                                       title: category.title,
                                    },
                                 },
                              })
                           }
                        >
                           <DeleteIcon color="#FF6B5E" />
                        </span>
                     </Product>
                  ))}
                  <ButtonTile
                     type="secondary"
                     text={t(address.concat('add product'))}
                     onClick={() => add_product(index)}
                  />
               </Products>
            </Category>
         ))}
         <Input
            type="text"
            placeholder={t(address.concat('add category'))}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={create_category}
         />
      </React.Fragment>
   )
}

export default Categories
