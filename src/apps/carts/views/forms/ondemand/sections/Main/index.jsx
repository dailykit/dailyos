import React from 'react'
import moment from 'moment'
import { isEqual } from 'lodash'
import styled, { css } from 'styled-components'
import { toast } from 'react-toastify'
import { useParams } from 'react-router'
import { Element } from 'react-scroll'
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
import {
   AnchorNav,
   AnchorNavItem,
   Text,
   Flex,
   Filler,
   TextButton,
   Spacer,
} from '@dailykit/ui'

import { useManual } from '../../state'
import { MUTATIONS, QUERIES } from '../../../../../graphql'
import EmptyIllo from '../../../../../assets/svgs/EmptyIllo'
import { InlineLoader } from '../../../../../../../shared/components'
import { currencyFmt, logger } from '../../../../../../../shared/utils'

export const Main = () => {
   const { brand } = useManual()
   const [menu, setMenu] = React.useState([])
   const [categories, setCategories] = React.useState([])
   const [isMenuEmpty, setIsMenuEmpty] = React.useState(false)
   const [hasMenuError, setHasMenuError] = React.useState(false)
   const [isMenuLoading, setIsMenuLoading] = React.useState(true)
   const [fetchProducts] = useLazyQuery(QUERIES.PRODUCTS.LIST, {
      onCompleted: ({ products = [] }) => {
         const _menu = []
         categories.map(category => {
            _menu.push({
               title: category.name,
               products: products.filter(product =>
                  category.products.includes(product.id)
               ),
            })
         })
         setMenu(_menu)
         setIsMenuEmpty(false)
         setHasMenuError(false)
         setIsMenuLoading(false)
      },
      onError: error => {
         logger(error)
         setIsMenuEmpty(false)
         setHasMenuError(true)
         setIsMenuLoading(false)
      },
   })
   useQuery(QUERIES.MENU, {
      skip: !brand?.id,
      variables: {
         params: { brandId: brand.id, date: moment().format('YYYY-MM-DD') },
      },
      onCompleted: async (data = {}) => {
         try {
            if (
               isEqual(data, {
                  menu: [{ data: { menu: [] }, __typename: 'onDemand_menu' }],
               })
            ) {
               setIsMenuEmpty(true)
               setHasMenuError(false)
               setIsMenuLoading(false)
               return
            }
            const [_data] = data.menu
            const { data: { menu = [] } = {} } = _data
            setCategories(menu)
            const ids = menu.map(({ products }) => products).flat()

            if (ids.length === 0) {
               setIsMenuEmpty(true)
               setHasMenuError(false)
               setIsMenuLoading(false)
               return
            }
            await fetchProducts({
               variables: {
                  where: {
                     isArchived: { _eq: false },
                     id: { _in: ids },
                  },
               },
            })
         } catch (error) {
            logger(error)
            setIsMenuLoading(false)
            setHasMenuError(true)
            setIsMenuEmpty(false)
            toast.error(
               'There was an issue in fetching the menu for today, please try again!'
            )
         }
      },
      onError: error => {
         logger(error)
         setIsMenuLoading(false)
         setHasMenuError(true)
         setIsMenuEmpty(false)
         toast.error(
            'There was an issue in fetching the menu for today, please try again!'
         )
      },
   })

   if (isMenuLoading) return <InlineLoader />
   if (hasMenuError)
      return (
         <Styles.Main>
            <Flex
               container
               width="100%"
               height="100%"
               alignItems="center"
               justifyContent="center"
            >
               <Filler
                  width="380px"
                  height="320px"
                  illustration={<EmptyIllo width="240px" />}
                  message="There was an issue in fetching the menu for today, please try again!"
               />
            </Flex>
         </Styles.Main>
      )
   if (isMenuEmpty)
      return (
         <Styles.Main>
            <Flex
               container
               width="100%"
               height="100%"
               alignItems="center"
               justifyContent="center"
            >
               <Filler
                  width="380px"
                  height="320px"
                  illustration={<EmptyIllo width="240px" />}
                  message="No products available for today!"
               />
            </Flex>
         </Styles.Main>
      )
   return (
      <Styles.Main>
         <Menu menu={menu} />
      </Styles.Main>
   )
}

const Menu = ({ menu }) => {
   const { id: cartId } = useParams()
   const { cart, tunnels, dispatch } = useManual()

   const [insertCartItem, { loading }] = useMutation(
      MUTATIONS.CART.ITEM.INSERT,
      {
         onCompleted: () => {
            toast.success('Item added to cart!')
         },
         onError: error => {
            logger(error)
            toast.error('Failed to add product to cart!')
         },
      }
   )

   const calcDiscountedPrice = (price, discount) => {
      return price - price * (discount / 100)
   }

   const renderPrice = product => {
      if (product.isPopupAllowed) {
         if (product.discount) {
            return (
               <Flex container alignItems="center">
                  <Styles.Price strike>
                     {currencyFmt(product.price)}
                  </Styles.Price>{' '}
                  <Styles.Price>
                     {currencyFmt(
                        calcDiscountedPrice(product.price, product.discount)
                     )}
                  </Styles.Price>
               </Flex>
            )
         }
         return <Styles.Price>{currencyFmt(product.price)}</Styles.Price>
      } else {
         const totalPrice =
            product.defaultCartItem.unitPrice +
            product.defaultCartItem.childs?.data?.reduce(
               (acc, op) => acc + op.unitPrice,
               0
            )

         return <Styles.Price>{currencyFmt(totalPrice)}</Styles.Price>
      }
   }

   const handleAddProduct = (e, categoryTitle) => {
      const { productId } = e.target.dataset
      if (productId && !loading) {
         const category = menu.find(item => item.title === categoryTitle)
         const product = category.products.find(pdct => pdct.id === +productId)

         if (product.isPopupAllowed) {
            dispatch({
               type: 'SET_PRODUCT_ID',
               payload: productId,
            })
            switch (product.type) {
               case 'simple':
                  return tunnels.productOptions[1](1)
               case 'customizable':
                  return tunnels.customizableComponents[1](1)
               case 'combo':
                  return tunnels.comboComponents[1](1)
            }
         } else {
            insertCartItem({
               variables: {
                  object: {
                     ...product.defaultCartItem,
                     cartId: +cartId,
                  },
               },
            })
         }
      }
   }

   return (
      <>
         <AnchorNav>
            {menu.map(item => (
               <AnchorNavItem
                  key={item.title}
                  label={item.title}
                  targetElement={item.title}
                  containerId="categories"
               />
            ))}
         </AnchorNav>
         <Element
            id="categories"
            style={{
               width: '100%',
               overflowY: 'auto',
               overflowX: 'hidden',
               position: 'relative',
               height: '95.7%',
               padding: '0 14px',
            }}
         >
            {menu.map(item => (
               <Element
                  key={item.title}
                  name={item.title}
                  style={{ height: '100%', overflowY: 'auto' }}
                  onClick={e => handleAddProduct(e, item.title)}
               >
                  <Text as="text1">{item.title}</Text>
                  <Spacer size="14px" />
                  <Styles.Cards>
                     {item.products.map(product => (
                        <Styles.Card key={product.id}>
                           <aside>
                              {product.assets?.images &&
                              product.assets?.images?.length > 0 ? (
                                 <img
                                    alt={product.name}
                                    src={product.assets?.images[0]}
                                 />
                              ) : (
                                 <span>N/A</span>
                              )}
                           </aside>
                           <Flex as="main" container flexDirection="column">
                              <Text as="text2">{product.name}</Text>
                              <Text as="text3">{renderPrice(product)}</Text>
                              <Spacer size="8px" />
                              {cart?.paymentStatus === 'PENDING' && (
                                 <TextButton
                                    type="solid"
                                    variant="secondary"
                                    size="sm"
                                    data-product-id={product.id}
                                 >
                                    ADD {product.isPopupAllowed && '+'}
                                 </TextButton>
                              )}
                           </Flex>
                        </Styles.Card>
                     ))}
                  </Styles.Cards>
                  <Spacer size="24px" />
               </Element>
            ))}
         </Element>
      </>
   )
}

const Styles = {
   Main: styled.main`
      grid-area: main;
      overflow-y: auto;
   `,
   Cards: styled.ul`
      display: grid;
      grid-gap: 14px;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
   `,
   Card: styled.li`
      padding: 4px;
      display: grid;
      grid-gap: 8px;
      min-height: 56px;
      border-radius: 2px;
      background: #ffffff;
      border: 1px solid #ececec;
      grid-template-columns: auto 1fr;
      aside {
         width: 56px;
         height: 42px;
         display: flex;
         background: #eaeaea;
         align-items: center;
         justify-content: center;
         > span {
            font-size: 14px;
            color: #ab9e9e;
         }
         > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 2px;
         }
      }
   `,
   Filler: styled(Filler)`
      p {
         font-size: 14px;
         text-align: center;
      }
   `,
   Price: styled.p(
      ({ strike }) => css`
         text-decoration-line: ${strike ? 'line-through' : 'none'};
         margin-right: ${strike ? '1ch' : '0'};
      `
   ),
}
