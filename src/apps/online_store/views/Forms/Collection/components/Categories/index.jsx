import React from 'react'
import {
   ButtonTile,
   Input,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import DeleteIcon from '../../../../../assets/icons/Delete'
import { CollectionContext } from '../../../../../context/collection'
import { Category, Product, Products, Title } from './styled'
import { ProductTypeTunnel, ProductsTunnel } from '../../tunnels'

const address =
   'apps.online_store.views.forms.collection.components.categories.'

const Categories = () => {
   const { t } = useTranslation()
   const { collectionState, collectionDispatch } = React.useContext(
      CollectionContext
   )
   const [title, setTitle] = React.useState('')

   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)

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
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <ProductTypeTunnel close={closeTunnel} open={openTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <ProductsTunnel
                  close={closeTunnel}
                  // products={products[collectionState.meta.productType]}
               />
            </Tunnel>
         </Tunnels>
         <>
            {collectionState.categories.map((category, index) => (
               // eslint-disable-next-line react/no-array-index-key
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
                        role="button"
                        tabIndex="0"
                        onKeyDown={e =>
                           e.charCode === 13 &&
                           collectionDispatch({
                              type: 'DELETE_CATEGORY',
                              payload: { title: category.title },
                           })
                        }
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
                              role="button"
                              tabIndex="0"
                              onKeyDown={e =>
                                 e.charCode === 13 &&
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
         </>
      </>
   )
}

export default Categories
