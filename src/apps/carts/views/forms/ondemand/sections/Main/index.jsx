import React from 'react'
import moment from 'moment'
import { forEach, isEqual } from 'lodash'
import styled, { css } from 'styled-components'
import { toast } from 'react-toastify'
import { useParams } from 'react-router'
import { Element } from 'react-scroll'
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
import debounce from '../../../../../../../shared/hooks/debounce'
import {
   AnchorNav,
   AnchorNavItem,
   Text,
   Flex,
   Filler,
   TextButton,
   Spacer,
   RadioGroup,
   IconButton,
   SearchBox,
} from '@dailykit/ui'

import { useManual } from '../../state'
import { buildImageUrl } from '../../../../../utils'
import { MUTATIONS, QUERIES } from '../../../../../graphql'
import EmptyIllo from '../../../../../assets/svgs/EmptyIllo'
import { InlineLoader } from '../../../../../../../shared/components'
import {
   calcDiscountedPrice,
   currencyFmt,
   logger,
} from '../../../../../../../shared/utils'
import { SearchIcon, CloseIcon } from '../../../../../../../shared/assets/icons'

export const Main = () => {
   const { brand } = useManual()
   const [menu, setMenu] = React.useState([])
   const [categories, setCategories] = React.useState([])
   const [isMenuEmpty, setIsMenuEmpty] = React.useState(false)
   const [hasMenuError, setHasMenuError] = React.useState(false)
   const [isMenuLoading, setIsMenuLoading] = React.useState(true)
   const [allProducts, setAllProducts] = React.useState([])
   const [menuStore, setMenuStore] = React.useState(true)
   const [search, setSearch] = React.useState('')
   const [showSearch, setShowSearch] = React.useState(false)
   const [productId, setProductId] = React.useState([])

   const [options] = React.useState([
      { id: 1, title: 'Menu Store' },
      { id: 2, title: 'All Products' },
   ])
   useQuery(QUERIES.PRODUCTS.LIST, {
      variables: {
         where: { isPublished: { _eq: true }, isArchived: { _eq: false } },
      },
      onCompleted: data => {
         setAllProducts(data.products)
      },
   })

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
         const productIds = products.map(product => product.id)
         setProductId(productIds)
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
         <Flex
            container
            width="100%"
            alignItems="center"
            justifyContent="space-between"
         >
            <Flex container alignItems="center" justifyContent="flex-start">
               <RadioGroup
                  options={options}
                  active={1}
                  onChange={() => setMenuStore(!menuStore)}
               />
            </Flex>

            {showSearch ? (
               <SearchBox
                  width="100%"
                  onBlur={() => setShowSearch(false)}
                  placeholder="Search"
                  value={search}
                  hasReadAccess={true}
                  hasWriteAccess={true}
                  fallBackMessage="You shall not pass!"
                  onChange={e => setSearch(e.target.value)}
               />
            ) : (
               ''
            )}
         </Flex>
         <Spacer size="20px" />
         {menuStore ? (
            <Menu
               menu={menu}
               productId={productId}
               renderPrice={renderPrice}
               allProducts={allProducts}
            />
         ) : (
            <AllProducts allProducts={allProducts} renderPrice={renderPrice} />
         )}
      </Styles.Main>
   )
}

const Menu = ({ menu, productId, renderPrice, allProducts }) => {
   const { id: cartId } = useParams()
   const { cart, tunnels, dispatch } = useManual()

   const [showSearch, setShowSearch] = React.useState(false)
   const [searchedResult, setSearchResult] = React.useState([])
   const [isLoading, setIsLoading] = React.useState(false)
   const [input, setInput] = React.useState('')

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

   const [searchProducts] = useLazyQuery(QUERIES.PRODUCTS.LIST, {
      onCompleted: data => {
         setIsLoading(false)
         setSearchResult(data.products)
      },
      fetchPolicy: 'network-only',
   })

   const handleProductWithoutCategory = e => {
      const { productId } = e.target.dataset
      if (productId && !loading) {
         const product = allProducts.find(pdct => pdct.id === +productId)
         openTunnels(product, productId)
      }
   }

   const handleAddProduct = (e, categoryTitle) => {
      const { productId } = e.target.dataset
      if (productId && !loading) {
         const category = menu.find(item => item.title === categoryTitle)
         const product = category.products.find(pdct => pdct.id === +productId)
         openTunnels(product, productId)
      }
   }

   const openTunnels = (product, productId) => {
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

   return (
      <>
         {showSearch ? (
            <Flex
               container
               width="100%"
               alignItems="center"
               justifyContent="space-between"
            >
               <SearchBox
                  placeholder="Search"
                  value={input}
                  hasReadAccess={true}
                  hasWriteAccess={true}
                  fallBackMessage="You shall not pass!"
                  onChange={e => {
                     setInput(e.target.value)
                     searchProducts({
                        variables: {
                           where: {
                              id: { _in: productId },
                              name: { _ilike: `%${e.target.value}%` },
                           },
                        },
                     })
                  }}
               />

               <IconButton
                  type="ghost"
                  size="sm"
                  onClick={() => setShowSearch(false)}
               >
                  <CloseIcon color="#ec3333" />
               </IconButton>
            </Flex>
         ) : (
            <Flex
               container
               width="100%"
               alignItems="center"
               justifyContent="space-between"
            >
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

               <IconButton
                  type="ghost"
                  size="sm"
                  onClick={() => setShowSearch(true)}
               >
                  <SearchIcon color="#888D9D" />
               </IconButton>
            </Flex>
         )}
         <Spacer size="10px" />
         {showSearch ? (
            <SearchedResults
               handleProductWithoutCategory={handleProductWithoutCategory}
               isLoading={isLoading}
               data={searchedResult}
               cart={cart}
               renderPrice={renderPrice}
            />
         ) : (
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
                     <SearchedResults
                        data={item.products}
                        renderPrice={renderPrice}
                        cart={cart}
                     />

                     <Spacer size="24px" />
                  </Element>
               ))}
            </Element>
         )}
      </>
   )
}

const AllProducts = ({ allProducts, renderPrice }) => {
   const { id: cartId } = useParams()
   const { cart, tunnels, dispatch } = useManual()
   const [showSearch, setShowSearch] = React.useState(false)
   const [input, setInput] = React.useState('')
   const [searchedResult, setSearchedResult] = React.useState([])
   const [isLoading, setIsLoading] = React.useState(false)
   const [searchProducts] = useLazyQuery(QUERIES.PRODUCTS.LIST, {
      onCompleted: data => {
         setIsLoading(false)
         setSearchedResult(data.products)
      },
      fetchPolicy: 'network-only',
   })

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

   React.useEffect(() => {
      if (input.trim().length === 0) {
         setIsLoading(false)
         setSearchedResult([])
      } else {
         optimisedSearchProducts({
            variables: {
               where: {
                  isPublished: { _eq: true },
                  isArchived: { _eq: false },
                  name: { _ilike: `%${input}%` },
               },
            },
         })
      }
   }, [input])

   const optimisedSearchProducts = debounce(searchProducts, 1000)

   const handleProductWithoutCategory = e => {
      const { productId } = e.target.dataset
      if (productId && !loading) {
         const product = allProducts.find(pdct => pdct.id === +productId)
         openTunnels(product, productId)
      }
   }

   const openTunnels = (product, productId) => {
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

   return (
      <>
         {showSearch ? (
            <Flex
               container
               width="100%"
               alignItems="center"
               justifyContent="space-between"
            >
               <SearchBox
                  placeholder="Search"
                  value={input}
                  hasReadAccess={true}
                  hasWriteAccess={true}
                  fallBackMessage="You shall not pass!"
                  onChange={e => {
                     setInput(e.target.value)
                     setIsLoading(true)
                  }}
               />
               <IconButton
                  type="ghost"
                  size="sm"
                  onClick={() => setShowSearch(false)}
               >
                  <CloseIcon color="#ec3333" />
               </IconButton>
            </Flex>
         ) : (
            <Flex
               container
               width="100%"
               alignItems="center"
               justifyContent="space-between"
            >
               <AnchorNav>
                  <AnchorNavItem
                     targetElement="element-1"
                     label="All Products"
                     containerId="containerElement"
                  />
               </AnchorNav>

               <IconButton
                  type="ghost"
                  size="sm"
                  onClick={() => setShowSearch(true)}
               >
                  <SearchIcon color="#888D9D" />
               </IconButton>
            </Flex>
         )}
         <Spacer size="10px" />
         {showSearch ? (
            <SearchedResults
               handleProductWithoutCategory={handleProductWithoutCategory}
               isLoading={isLoading}
               data={searchedResult}
               cart={cart}
               renderPrice={renderPrice}
            />
         ) : (
            <Element
               id="containerElement"
               style={{
                  position: 'relative',
                  height: '600px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  width: '100%',
               }}
            >
               <Element
                  name="element-1"
                  style={{
                     height: '1000px',
                  }}
                  onClick={e => handleProductWithoutCategory(e)}
               >
                  <SearchedResults
                     data={allProducts}
                     renderPrice={renderPrice}
                     cart={cart}
                  />
               </Element>
            </Element>
         )}
      </>
   )
}

const SearchedResults = ({
   data,
   cart,
   renderPrice,
   isLoading,
   handleProductWithoutCategory,
}) => {
   if (isLoading) {
      return <InlineLoader />
   }
   if (data.length === 0) {
      return (
         <div
            style={{
               display: 'flex',
               justifyContent: 'center',
               marginTop: '4rem',
            }}
         >
            <Filler message="no results found" width="200px" height="200px" />
         </div>
      )
   }

   return (
      <Styles.Cards>
         {data.map(product => (
            <Styles.Card key={product.id}>
               <aside>
                  {product.assets?.images &&
                  product.assets?.images?.length > 0 ? (
                     <img
                        alt={product.name}
                        src={buildImageUrl('56x56', product.assets?.images[0])}
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
                        onClick={e => handleProductWithoutCategory(e)}
                     >
                        ADD {product.isPopupAllowed && '+'}
                     </TextButton>
                  )}
               </Flex>
            </Styles.Card>
         ))}
      </Styles.Cards>
   )
}

const Styles = {
   Main: styled.main`
      grid-area: main;
      overflow-y: auto;
      padding: 10px;
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
         height: 56px;
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
