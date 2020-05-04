import React, { useContext, useReducer, useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import {
   ButtonTile,
   IconButton,
   Input,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui/'

import AddIcon from '../../../assets/icons/Add'
import FormHeading from '../../../components/FormHeading'
import Items from './Items'
import Availability from './Availability'
import AddItemsTunnel from './Tunnels/AddItemTunnel'
import AvailabilityTunnel from './Tunnels/AvailabilityTunnel'
import ProductDescriptionTunnel from './Tunnels/ProductDescriptionTunnel'
import SelectRecipesTunnel from './Tunnels/SelectRecipesTunnel'
import SetPricingTunnel from './Tunnels/SetPricingTunnel'
import AccompanimentTypeTunnel from './Tunnels/AccompanimentTypeTunnel'
import SelectAccompanimentsTunnel from './Tunnels/SelectAccompanimentsTunnel'
import {
   ProductContext,
   reducers,
   state as initialState,
} from '../../../context/product'
import { Context } from '../../../context/tabs'
import { FormActions, MainFormArea, Stats, StyledWrapper } from '../styled'

import { CREATE_PRODUCT, UPDATE_PRODUCT } from '../../../graphql/'
import {
   RECIPES,
   ACCOMPANIMENT_TYPES,
   PRODUCTS,
} from '../../../graphql/queries/index'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.'

export default function AddProductForm() {
   const { t } = useTranslation()
   const [productState, productDispatch] = useReducer(reducers, initialState)
   const [tunnels, openTunnel, closeTunnel] = useTunnel(7)
   const { state, dispatch } = useContext(Context)
   const [productName, setProductName] = useState('')
   const [recipes, setRecipes] = useState([])
   const [accompanimentTypes, setAccompanimentTypes] = useState([])
   const [products, setProducts] = useState([])

   const [createProduct] = useMutation(CREATE_PRODUCT)
   const [updateProduct] = useMutation(UPDATE_PRODUCT)

   useQuery(RECIPES, {
      onCompleted: data => {
         const updatedRecipes = data.recipes.map(({ id, name, servings }) => ({
            id,
            title: name,
            servings,
         }))
         setRecipes(updatedRecipes)
      },
   })

   useQuery(ACCOMPANIMENT_TYPES, {
      onCompleted: data => {
         setAccompanimentTypes(data.accompanimentTypes)
      },
   })

   useQuery(PRODUCTS, {
      onCompleted: data => {
         const refinedProducts = data.products.filter(
            product => product.id !== productState.id
         )
         setProducts(refinedProducts)
      },
   })

   const handlePublish = () => {
      const values = {
         id: productState.id,
         title: productName,
         description: productState.description,
         realtime: productState.realtime,
         preOrder: productState.preOrder,
         tags: productState.tags,
         items: productState.items.map(({ label, recipes, defaultRecipe }) => ({
            label,
            recipes: recipes.map(
               ({ recipe, mealKit, readyToEat, accompaniments }) => ({
                  recipe,
                  mealKit,
                  readyToEat,
                  accompaniments: accompaniments.map(({ id, products }) => ({
                     type: id,
                     products: products.map(({ id, discount }) => ({
                        product: id,
                        discount,
                     })),
                  })),
               })
            ),
            defaultRecipe,
         })),
      }
      console.log('%c values', 'color: #28c1f7', values)
   }

   const handleSave = () => {
      const values = {
         id: productState.id,
         title: productName,
         description: productState.description,
         realtime: productState.realtime,
         preOrder: productState.preOrder,
         tags: productState.tags,
         items: productState.items.map(({ label, recipes, defaultRecipe }) => ({
            label,
            recipes: recipes.map(
               ({ recipe, mealKit, readyToEat, accompaniments }) => ({
                  recipe,
                  mealKit,
                  readyToEat,
                  accompaniments: accompaniments.map(({ id, products }) => ({
                     type: id,
                     products: products.map(({ id, discount }) => ({
                        product: id,
                        discount,
                     })),
                  })),
               })
            ),
            defaultRecipe,
         })),
      }

      updateProduct({ variables: { input: values } })
   }

   const handleTabNameChange = async title => {
      if (title.length > 0) {
         dispatch({
            type: 'SET_TITLE',
            payload: { title, oldTitle: state.current.title },
         })
      } else {
         dispatch({
            type: 'SET_TITLE',
            payload: {
               title: 'Untitled Product',
               oldTitle: state.current.title,
            },
         })
      }

      if (!productState.id) {
         const {
            data: {
               createProduct: {
                  success,
                  product: { id },
               },
            },
         } = await createProduct({ variables: { title } })

         if (success) {
            productDispatch({ type: 'SET_PRODUCT_ID', payload: id })
         }
      } else {
         handleSave()
      }
   }

   return (
      <>
         <ProductContext.Provider value={{ productState, productDispatch }}>
            <Tunnels tunnels={tunnels}>
               <Tunnel layer={1}>
                  <AddItemsTunnel close={closeTunnel} />
               </Tunnel>
               <Tunnel layer={2}>
                  <SelectRecipesTunnel recipes={recipes} close={closeTunnel} />
               </Tunnel>
               <Tunnel layer={3}>
                  <ProductDescriptionTunnel close={closeTunnel} />
               </Tunnel>
               <Tunnel layer={4} size="lg">
                  <SetPricingTunnel close={closeTunnel} />
               </Tunnel>
               <Tunnel layer={5}>
                  <AvailabilityTunnel close={closeTunnel} />
               </Tunnel>
               <Tunnel layer={6}>
                  <AccompanimentTypeTunnel
                     accompanimentTypes={accompanimentTypes}
                     close={closeTunnel}
                  />
               </Tunnel>
               <Tunnel layer={7}>
                  <SelectAccompanimentsTunnel
                     close={closeTunnel}
                     products={products}
                  />
               </Tunnel>
            </Tunnels>
            <StyledWrapper>
               <FormHeading>
                  <div>
                     <Input
                        label={t(address.concat("untitled product"))}
                        type="text"
                        name="productName"
                        value={productName}
                        onChange={e => setProductName(e.target.value)}
                        onBlur={e => handleTabNameChange(productName)}
                     />
                  </div>

                  <FormActions>
                     <TextButton
                        onClick={handleSave}
                        type="ghost"
                        style={{ margin: '0px 10px' }}
                     >
                        {t(address.concat('save'))}
                     </TextButton>

                     <TextButton
                        onClick={handlePublish}
                        type="solid"
                        style={{ margin: '0px 10px' }}
                     >
                        {t(address.concat('publish'))}
                     </TextButton>
                  </FormActions>
               </FormHeading>

               <MainFormArea>
                  <Availability open={openTunnel} />
                  <hr style={{ border: '1px solid #dddddd' }} />
                  <br />

                  <Stats>
                     <h4 style={{ display: 'flex', alignItems: 'center' }}>
                        {t(address.concat('items'))} (
                        {productState.items[0].label?.length > 0
                           ? productState.items?.length
                           : '0'}
                        )
                        <IconButton type="ghost" onClick={() => openTunnel(1)}>
                           <AddIcon color="#000" />
                        </IconButton>
                     </h4>
                  </Stats>
                  {productState.items[0].label?.length === 0 ? (
                     <ButtonTile
                        type="primary"
                        size="sm"
                        text={t(address.concat("add items"))}
                        onClick={e => openTunnel(1)}
                        style={{ margin: '20px 0' }}
                     />
                  ) : (
                        <Items open={openTunnel} />
                     )}
               </MainFormArea>
            </StyledWrapper>
         </ProductContext.Provider>
      </>
   )
}
