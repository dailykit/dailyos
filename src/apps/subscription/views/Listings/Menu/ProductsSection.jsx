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

import { useMenu } from './state'
import tableOptions from '../../../tableOption'
import { SIMPLE_RECIPE_PRODUCT_OPTIONS } from '../../../graphql'
import { InlineLoader } from '../../../../../shared/components'

const ProductsSection = () => {
   const columns = [
      {
         hozAlign: 'center',
         headerSort: false,
         formatter: 'rowSelection',
      },
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
                  <MealKits columns={columns} />
               </HorizontalTabPanel>
               <HorizontalTabPanel style={{ padding: '14px 0' }}>
                  <ReadyToEats columns={columns} />
               </HorizontalTabPanel>
            </HorizontalTabPanels>
         </HorizontalTabs>
      </Wrapper>
   )
}

export default ProductsSection

const MealKits = ({ columns }) => {
   const tableRef = React.useRef()
   const { state, dispatch } = useMenu()
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

   const handleRowSelection = row => {
      const data = row.getData()

      if (row.isSelected()) {
         dispatch({
            type: 'SET_PRODUCT',
            payload: {
               product: { id: data.id },
            },
         })
      } else {
         dispatch({
            type: 'REMOVE_PRODUCT',
            payload: data.id,
         })
      }
   }

   if (loading) return <InlineLoader />
   return (
      <div>
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            data={productOptions.nodes}
            rowSelected={handleRowSelection}
            rowDeselected={handleRowSelection}
            options={{
               ...tableOptions,
               selectable: true,
               groupBy: 'recipeProduct.name',
            }}
         />
      </div>
   )
}

const ReadyToEats = ({ columns }) => {
   const tableRef = React.useRef()
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
            ref={tableRef}
            columns={columns}
            data={productOptions.nodes}
            options={{
               ...tableOptions,
               selectable: true,
               groupBy: 'recipeProduct.name',
            }}
         />
      </div>
   )
}

const Wrapper = styled.main`
   padding: 0 16px;
`
