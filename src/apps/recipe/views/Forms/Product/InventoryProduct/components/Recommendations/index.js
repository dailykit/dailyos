import React from 'react'
import {
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTab,
   HorizontalTabPanels,
   HorizontalTabPanel,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
// eslint-disable-next-line import/no-cycle
import { ProductTile } from '../../../../../../../../shared/components'
import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'
import { Grid } from './styled'
import {
   RecommendationTypeTunnel,
   ProductsTunnel,
   ProductsTypeTunnel,
} from '../../tunnels'
import { UPDATE_INVENTORY_PRODUCT } from '../../../../../../graphql'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'

const address =
   'apps.online_store.views.forms.product.inventoryproduct.components.accompaniments.'

const Recommendations = ({ state }) => {
   const { t } = useTranslation()
   const { productDispatch } = React.useContext(InventoryProductContext)

   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [productsTunnels, openProductsTunnel, closeProductsTunnel] = useTunnel(
      2
   )

   const [updateProduct] = useMutation(UPDATE_INVENTORY_PRODUCT, {
      onCompleted: () => {
         toast.success('Product removed!')
      },
      onError: () => {
         toast.error('Error')
      },
   })

   const addProducts = recommendationType => {
      productDispatch({
         type: 'RECOMMENDATION_TYPE',
         payload: {
            recommendationType,
         },
      })
      openProductsTunnel(1)
   }

   const deleteProduct = (recommendationType, product) => {
      try {
         const { recommendations } = state
         const index = recommendations.findIndex(
            ({ type }) => type === recommendationType
         )
         recommendations[index].products = recommendations[
            index
         ].products.filter(
            item => !(item.id === product.id && item.type === product.type)
         )
         updateProduct({
            variables: {
               id: state.id,
               set: {
                  recommendations,
               },
            },
         })
      } catch (err) {
         console.log(err.message)
         toast.error(err.message)
      }
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <RecommendationTypeTunnel state={state} close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={productsTunnels}>
            <Tunnel layer={1}>
               <ProductsTypeTunnel
                  open={openProductsTunnel}
                  close={closeProductsTunnel}
               />
            </Tunnel>
            <Tunnel layer={2}>
               <ProductsTunnel state={state} close={closeProductsTunnel} />
            </Tunnel>
         </Tunnels>
         {state.recommendations?.length ? (
            <HorizontalTabs>
               <HorizontalTabList>
                  {state.recommendations.map(({ type }) => (
                     <HorizontalTab>{type}</HorizontalTab>
                  ))}
               </HorizontalTabList>
               <HorizontalTabPanels>
                  {state.recommendations.map(({ type, products }) => (
                     <HorizontalTabPanel>
                        <Grid>
                           {products.map(product => (
                              <ProductTile
                                 key={product.id}
                                 image={product.image}
                                 title={product.title}
                                 onDelete={() => deleteProduct(type, product)}
                              />
                           ))}
                           <ButtonTile
                              type="secondary"
                              text="Add Products"
                              onClick={() => addProducts(type)}
                           />
                        </Grid>
                     </HorizontalTabPanel>
                  ))}
               </HorizontalTabPanels>
            </HorizontalTabs>
         ) : (
            <ButtonTile
               type="secondary"
               text="Add Recommendation Types"
               onClick={() => openTunnel(1)}
            />
         )}
      </>
   )
}

export default Recommendations
