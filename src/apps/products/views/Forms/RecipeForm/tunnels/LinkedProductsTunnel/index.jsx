import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { Filler, Text, TunnelHeader } from '@dailykit/ui'
import { InlineLoader, Tooltip } from '../../../../../../../shared/components'
import { useTabs } from '../../../../../../../shared/providers'
import { S_SIMPLE_PRODUCTS_FROM_RECIPE } from '../../../../../graphql'
import { TunnelBody } from '../styled'
import { ProductContent, ProductImage, StyledProductWrapper } from './styled'

const LinkedProductsTunnel = ({ state, closeTunnel }) => {
   const { addTab } = useTabs()
   const [options, setOptions] = React.useState([])

   const { loading } = useSubscription(S_SIMPLE_PRODUCTS_FROM_RECIPE, {
      variables: {
         where: {
            simpleRecipeYieldId: {
               _in: state.simpleRecipeYields.map(y => y.id),
            },
            isArchived: { _eq: false },
            product: {
               isArchived: { _eq: false },
            },
         },
         distinct_on: ['productId'],
      },
      onSubscriptionData: data => {
         setOptions(data.subscriptionData.data.productOptions)
      },
   })

   return (
      <>
         <TunnelHeader
            title="Linked Products"
            close={() => closeTunnel(1)}
            tooltip={<Tooltip identifier="recipe_create_product_tunnel" />}
         />
         <TunnelBody>
            {loading ? (
               <InlineLoader />
            ) : (
               <>
                  {options.length ? (
                     <>
                        {options.map(op => (
                           <ProductTile
                              key={op.product.id}
                              title={op.product.name}
                              assets={op.product.assets}
                              onClick={() =>
                                 addTab(
                                    op.product.name,
                                    `/products/products/${op.product.id}`
                                 )
                              }
                           />
                        ))}
                     </>
                  ) : (
                     <Filler message="No products created from this recipe yet!" />
                  )}
               </>
            )}
         </TunnelBody>
      </>
   )
}

export default LinkedProductsTunnel

const ProductTile = ({ assets, title, onClick }) => {
   return (
      <StyledProductWrapper onClick={onClick}>
         <ProductContent>
            {Boolean(assets && assets?.images?.length) && (
               <ProductImage src={assets.images[0]} />
            )}
            <Text as="p"> {title} </Text>
         </ProductContent>
      </StyledProductWrapper>
   )
}
