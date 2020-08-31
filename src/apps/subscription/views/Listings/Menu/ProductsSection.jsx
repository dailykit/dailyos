import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import styled, { css } from 'styled-components'
import { ReactTabulator } from '@dailykit/react-tabulator'
import {
   Text,
   Input,
   Tunnel,
   Toggle,
   Tunnels,
   Dropdown,
   useTunnel,
   TextButton,
   TunnelHeader,
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
} from '@dailykit/ui'

import { useMenu } from './state'
import tableOptions from '../../../tableOption'
import { InlineLoader } from '../../../../../shared/components'
import {
   PRODUCT_CATEGORIES,
   INSERT_OCCURENCE_PRODUCTS,
   SIMPLE_RECIPE_PRODUCT_OPTIONS,
} from '../../../graphql'

const ProductsSection = () => {
   const { dispatch } = useMenu()
   const mealKitTableRef = React.useRef()
   const readyToEatTableRef = React.useRef()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const columns = [
      {
         title: 'Product',
         headerFilter: true,
         field: 'recipeProduct.name',
         headerFilterPlaceholder: 'Search products...',
      },
      {
         title: 'Serving',
         field: 'recipeYield.size',
      },
      {
         title: 'Author',
         headerFilter: true,
         field: 'recipeYield.recipe.author',
      },
   ]

   const handleRowSelection = row => {
      const data = row.getData()

      if (row.isSelected()) {
         dispatch({
            type: 'SET_PRODUCT',
            payload: {
               id: data.recipeProduct.id,
               option: { id: data.id },
            },
         })
      } else {
         dispatch({
            type: 'REMOVE_PRODUCT',
            payload: data.id,
         })
      }
   }

   const handleRowValidation = row => {
      if (!localStorage.getItem('serving_size')) return true
      return (
         row.getData().recipeYield.size === localStorage.getItem('serving_size')
      )
   }

   return (
      <Wrapper>
         <Header>
            <Text as="h2">Products</Text>
            <TextButton type="solid" onClick={() => openTunnel(1)}>
               Continue
            </TextButton>
         </Header>
         <HorizontalTabs>
            <HorizontalTabList>
               <HorizontalTab>Ready To Eats</HorizontalTab>
               <HorizontalTab>Meal Kits</HorizontalTab>
            </HorizontalTabList>
            <HorizontalTabPanels>
               <HorizontalTabPanel style={{ padding: '14px 0' }}>
                  <ReadyToEats
                     columns={columns}
                     readyToEatTableRef={readyToEatTableRef}
                     handleRowSelection={handleRowSelection}
                     handleRowValidation={handleRowValidation}
                  />
               </HorizontalTabPanel>
               <HorizontalTabPanel style={{ padding: '14px 0' }}>
                  <MealKits
                     columns={columns}
                     mealKitTableRef={mealKitTableRef}
                     handleRowSelection={handleRowSelection}
                     handleRowValidation={handleRowValidation}
                  />
               </HorizontalTabPanel>
            </HorizontalTabPanels>
         </HorizontalTabs>
         <SaveTunnel
            tunnels={tunnels}
            openTunnel={openTunnel}
            closeTunnel={closeTunnel}
            mealKitTableRef={mealKitTableRef}
            readyToEatTableRef={readyToEatTableRef}
         />
      </Wrapper>
   )
}

export default ProductsSection

const MealKits = ({
   columns,
   mealKitTableRef,
   handleRowSelection,
   handleRowValidation,
}) => {
   const { loading, data: { productOptions = {} } = {} } = useQuery(
      SIMPLE_RECIPE_PRODUCT_OPTIONS,
      {
         variables: {
            type: {
               _eq: 'mealKit',
            },
         },
      }
   )

   if (loading) return <InlineLoader />
   return (
      <div>
         <ReactTabulator
            columns={columns}
            ref={mealKitTableRef}
            data={productOptions.nodes}
            rowSelected={handleRowSelection}
            rowDeselected={handleRowSelection}
            selectableCheck={handleRowValidation}
            options={{
               ...tableOptions,
               selectable: true,
               groupBy: 'recipeProduct.name',
            }}
         />
      </div>
   )
}

const ReadyToEats = ({
   columns,
   handleRowSelection,
   readyToEatTableRef,
   handleRowValidation,
}) => {
   const { loading, data: { productOptions = {} } = {} } = useQuery(
      SIMPLE_RECIPE_PRODUCT_OPTIONS,
      {
         variables: {
            type: {
               _eq: 'readyToEat',
            },
         },
      }
   )

   if (loading) return <InlineLoader />
   return (
      <div>
         <ReactTabulator
            columns={columns}
            ref={readyToEatTableRef}
            data={productOptions.nodes}
            rowSelected={handleRowSelection}
            rowDeselected={handleRowSelection}
            selectableCheck={handleRowValidation}
            options={{
               ...tableOptions,
               selectable: true,
               groupBy: 'recipeProduct.name',
            }}
         />
      </div>
   )
}

const SaveTunnel = ({
   tunnels,
   closeTunnel,
   mealKitTableRef,
   readyToEatTableRef,
}) => {
   const { state, dispatch } = useMenu()
   const [checked, setChecked] = React.useState(false)
   const [form, setForm] = React.useState({
      addonLabel: '',
      addonPrice: '',
      productCategory: '',
   })
   const { data: { productCategories = [] } = {} } = useQuery(
      PRODUCT_CATEGORIES
   )
   const [insertOccurenceProducts] = useMutation(INSERT_OCCURENCE_PRODUCTS, {
      onCompleted: () => {
         setForm({
            addonLabel: '',
            addonPrice: '',
            productCategory: '',
         })
         closeTunnel(1)
         dispatch({ type: 'CLEAR_STATE' })
         const mealKitRows = mealKitTableRef.current.table.getSelectedRows()
         const readyToEatRows = readyToEatTableRef.current.table.getSelectedRows()
         mealKitRows.forEach(row => row.deselect())
         readyToEatRows.forEach(row => row.deselect())
         localStorage.removeItem('serving_size')
      },
   })

   const save = async () => {
      const plans = state.plans.selected
      const products = state.products.selected

      const objects = await Promise.all(
         plans.map(plan => {
            const result = products.map(product => ({
               isSingleSelect: !checked,
               addonLabel: form.addonLabel,
               simpleRecipeProductId: product.id,
               addonPrice: Number(form.addonPrice),
               productCategory: form.productCategory,
               ...(state.plans.isPermanent
                  ? { subscriptionId: plan.subscription.id }
                  : { subscriptionOccurenceId: plan.occurence.id }),
               simpleRecipeProductOptionId: product.option.id,
            }))
            return result
         })
      )
      insertOccurenceProducts({
         variables: {
            objects: objects.flat(),
         },
      })
   }

   const handleChange = e => {
      const { name, value } = e.target
      setForm({ ...form, [name]: value })
   }

   const selectOption = option => {
      setForm({ ...form, productCategory: option.title })
   }

   return (
      <Tunnels tunnels={tunnels}>
         <Tunnel layer={1}>
            <TunnelHeader
               title="Occurence Products"
               close={() => closeTunnel(1)}
               right={{ action: () => save(), title: 'Save' }}
            />
            <Main>
               <Spacer size="24px" />
               <Input
                  type="text"
                  name="addonLabel"
                  label="Add On Label"
                  value={form.addonLabel}
                  onChange={e => handleChange(e)}
               />
               <Spacer size="20px" />
               <Input
                  type="text"
                  name="addonPrice"
                  label="Add On Price"
                  value={form.addonPrice}
                  onChange={e => handleChange(e)}
               />
               <Spacer size="24px" />
               <Toggle
                  checked={checked}
                  setChecked={setChecked}
                  label="Can be added multiple times in cart?"
               />
               <Spacer size="24px" />
               <Dropdown
                  type="single"
                  searchedOption={() => {}}
                  options={productCategories}
                  selectedOption={selectOption}
                  placeholder="search for a product category"
               />
            </Main>
         </Tunnel>
      </Tunnels>
   )
}

const Wrapper = styled.main`
   padding: 0 16px;
`

const Header = styled.header`
   display: flex;
   align-items: center;
   justify-content: space-between;
`

const Main = styled.main`
   padding: 0 24px;
`

const Spacer = styled.div(
   ({ size }) => css`
      height: ${size};
   `
)
