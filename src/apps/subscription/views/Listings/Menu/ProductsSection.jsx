import React from 'react'
import styled from 'styled-components'
import {
   Text,
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
} from '@dailykit/ui'
import { useQuery } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from 'react-tabulator'

import tableOptions from '../../../tableOption'
import { SIMPLE_RECIPE_PRODUCTS } from '../../../graphql'
import { InlineLoader } from '../../../../../shared/components'

const ProductsSection = () => {
   return (
      <Wrapper>
         <Text as="h2">Products</Text>
         <HorizontalTabs>
            <HorizontalTabList>
               <HorizontalTab>Ready To Eats</HorizontalTab>
               <HorizontalTab>Meal Kits</HorizontalTab>
            </HorizontalTabList>
            <HorizontalTabPanels>
               <HorizontalTabPanel style={{ padding: '14px 0' }}>
                  <MealKits />
               </HorizontalTabPanel>
               <HorizontalTabPanel style={{ padding: '14px 0' }}>
                  <ReadyToEats />
               </HorizontalTabPanel>
            </HorizontalTabPanels>
         </HorizontalTabs>
      </Wrapper>
   )
}

export default ProductsSection

const MealKits = () => {
   const tableRef = React.useRef()
   const { loading, data: { simpleRecipeProducts = {} } = {} } = useQuery(
      SIMPLE_RECIPE_PRODUCTS,
      {
         variables: {
            productType: {
               _eq: 'mealKit',
            },
         },
      }
   )

   const columns = [
      {
         title: 'Product',
         field: 'name',
         headerFilter: true,
         headerFilterPlaceholder: 'Search products...',
      },
      {
         title: 'Servings',
         headerSort: false,
         formatter: reactFormatter(<Servings />),
      },
      {
         title: 'Type',
         field: 'recipe.type',
         headerFilter: true,
         headerFilterPlaceholder: 'Search types...',
      },
   ]

   if (loading) return <InlineLoader />
   return (
      <div>
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            options={tableOptions}
            data={simpleRecipeProducts.nodes}
         />
      </div>
   )
}

const ReadyToEats = () => {
   const tableRef = React.useRef()
   const { loading, data: { simpleRecipeProducts = {} } = {} } = useQuery(
      SIMPLE_RECIPE_PRODUCTS,
      {
         variables: {
            productType: {
               _eq: 'readyToEat',
            },
         },
      }
   )

   const columns = [
      {
         title: 'Product',
         field: 'name',
         headerFilter: true,
         headerFilterPlaceholder: 'Search products...',
      },
      {
         title: 'Servings',
         headerSort: false,
         formatter: reactFormatter(<Servings />),
      },
      {
         title: 'Type',
         field: 'recipe.type',
         headerFilter: true,
         headerFilterPlaceholder: 'Search types...',
      },
   ]

   if (loading) return <InlineLoader />
   return (
      <div>
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            options={tableOptions}
            data={simpleRecipeProducts.nodes}
         />
      </div>
   )
}

const Servings = ({ cell }) => {
   const { productOptions } = cell._cell.row.data
   return (
      <List>
         {productOptions.map(option => (
            <ListItem key={option.id}>{option.yield.size}</ListItem>
         ))}
      </List>
   )
}

const Wrapper = styled.main`
   padding: 0 16px;
`

const List = styled.ul`
   display: flex;
   align-items: center;
   border: 1px solid #e3e3e3;
   padding: 2px;
   border-radius: 2px;
`

const ListItem = styled.li`
   height: 28px;
   width: 28px;
   list-style: none;
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: 2px;
   &:hover,
   &.active {
      color: #fff;
      background: linear-gradient(180deg, #28c1f7 -4.17%, #00a7e1 100%);
   }
`
