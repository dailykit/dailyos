import React from 'react'
import { Input, ButtonTile } from '@dailykit/ui'

import { Category, Title, Products, Product } from './styled'
import { CollectionContext } from '../../../../../context/collection'
import DeleteIcon from '../../../../../assets/icons/Delete'

const Categories = ({ openTunnel }) => {
   const { state, dispatch } = React.useContext(CollectionContext)
   const [title, setTitle] = React.useState('')

   const create_category = () => {
      if (title) {
         dispatch({
            type: 'CREATE_CATEGORY',
            payload: {
               title,
            },
         })
         setTitle('')
      }
   }

   const add_product = title => {
      dispatch({
         type: 'CURRENT_CATEGORY',
         payload: { category: { title } },
      })
      openTunnel(1)
   }

   return (
      <React.Fragment>
         {state.categories.map(category => (
            <Category key={category.id}>
               <Title>
                  <Input
                     type="text"
                     placeholder="Category Name"
                     value={category.title}
                     onChange={e =>
                        dispatch({
                           type: 'CATEGORY_TITLE',
                           payload: {
                              title: e.target.value,
                           },
                        })
                     }
                  />
                  <span
                     onClick={() =>
                        dispatch({
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
                        <span>{product.title}</span>
                        <span
                           onClick={() =>
                              dispatch({
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
                     text="Add Product"
                     onClick={() => add_product(category.title)}
                  />
               </Products>
            </Category>
         ))}
         <Input
            type="text"
            placeholder="Add Category"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={create_category}
         />
      </React.Fragment>
   )
}

export default Categories
