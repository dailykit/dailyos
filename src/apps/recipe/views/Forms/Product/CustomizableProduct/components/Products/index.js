import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   HelperText,
   TextButton,
   Tunnels,
   Tunnel,
   useTunnel,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { DeleteIcon, LinkIcon } from '../../../../../../assets/icons'
import { CustomizableProductContext } from '../../../../../../context/product/customizableProduct'
import { useTabs } from '../../../../../../context'
import {
   DELETE_CUSTOMIZABLE_PRODUCT_OPTION,
   UPDATE_CUSTOMIZABLE_PRODUCT,
} from '../../../../../../graphql'
// styles
import {
   StyledAction,
   StyledDefault,
   StyledLayout,
   StyledLink,
   StyledListing,
   StyledListingTile,
   StyledPanel,
   StyledTab,
   StyledTable,
   StyledTabs,
   StyledTabView,
   StyledWrapper,
} from './styled'
import { ProductTypeTunnel, ProductsTunnel } from '../../tunnels'

const address =
   'apps.online_store.views.forms.product.customizableproduct.components.products.'

const Products = ({ state }) => {
   const { t } = useTranslation()
   const { addTab } = useTabs()
   const { productState, productDispatch } = React.useContext(
      CustomizableProductContext
   )

   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)

   // Mutation
   const [deleteOption] = useMutation(DELETE_CUSTOMIZABLE_PRODUCT_OPTION, {
      onCompleted: () => {
         toast.success(t(address.concat('product deleted')))
         productDispatch({
            type: 'PRODUCT_INDEX',
            payload: 0,
         })
      },
      onError: error => {
         console.log(error)
         toast.error(t(address.concat('error')))
      },
   })
   const [updateProduct] = useMutation(UPDATE_CUSTOMIZABLE_PRODUCT, {
      onCompleted: () => {
         toast.success(t(address.concat('default updated!')))
      },
      onError: error => {
         console.log(error)
         toast.error(t(address.concat('error')))
      },
   })

   // Handlers
   const remove = product => {
      if (
         window.confirm(
            `t(address.concat("are you sure you want to delete product")) - ${
               product.inventoryProduct?.name ||
               product.simpleRecipeProduct?.name
            }?`
         )
      ) {
         deleteOption({
            variables: {
               id: product.id,
            },
         })
      }
   }
   const makeDefault = () => {
      updateProduct({
         variables: {
            id: state.id,
            set: {
               default:
                  state.customizableProductOptions[productState.productIndex]
                     .id,
            },
         },
      })
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <ProductTypeTunnel close={closeTunnel} open={openTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <ProductsTunnel state={state} close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            {state.customizableProductOptions?.length ? (
               <StyledLayout>
                  <StyledListing>
                     {state.customizableProductOptions.map((option, index) => (
                        <StyledListingTile
                           active={productState.productIndex === index}
                           onClick={() =>
                              productDispatch({
                                 type: 'PRODUCT_INDEX',
                                 payload: index,
                              })
                           }
                        >
                           <h3>
                              {option.inventoryProduct?.name ||
                                 option.simpleRecipeProduct?.name}
                           </h3>
                           <span
                              tabIndex="0"
                              role="button"
                              onKeyDown={e =>
                                 e.charCode === 13 && remove(option)
                              }
                              onClick={() => remove(option)}
                           >
                              <DeleteIcon color="#fff" />
                           </span>
                           <StyledDefault hidden={state.default !== option.id}>
                              {t(address.concat('default'))}
                           </StyledDefault>
                        </StyledListingTile>
                     ))}
                     <ButtonTile
                        type="primary"
                        size="sm"
                        text={t(address.concat('add products'))}
                        onClick={() => openTunnel(1)}
                     />
                  </StyledListing>
                  <StyledPanel>
                     <h2>
                        {state.customizableProductOptions[
                           productState.productIndex
                        ].inventoryProduct?.name ||
                           state.customizableProductOptions[
                              productState.productIndex
                           ].simpleRecipeProduct?.name}
                        <StyledLink
                           onClick={() =>
                              state.customizableProductOptions[
                                 productState.productIndex
                              ].inventoryProduct
                                 ? addTab(
                                      state.customizableProductOptions[
                                         productState.productIndex
                                      ].inventoryProduct.name,
                                      `/recipe/inventory-products/${
                                         state.customizableProductOptions[
                                            productState.productIndex
                                         ].inventoryProduct.id
                                      }`
                                   )
                                 : addTab(
                                      state.customizableProductOptions[
                                         productState.productIndex
                                      ].simpleRecipeProduct.name,
                                      `/recipe/simple-recipe-products/${
                                         state.customizableProductOptions[
                                            productState.productIndex
                                         ].simpleRecipeProduct.id
                                      }`
                                   )
                           }
                        >
                           <LinkIcon color="#00A7E1" stroke={1.5} />
                        </StyledLink>
                     </h2>
                     <HelperText
                        type="hint"
                        message={t(
                           address.concat(
                              'accompanients are taken as per added on the selected product'
                           )
                        )}
                     />
                     <StyledAction
                        hidden={
                           state.default ===
                           state.customizableProductOptions[
                              productState.productIndex
                           ].id
                        }
                     >
                        <TextButton type="ghost" onClick={makeDefault}>
                           {t(address.concat('make default'))}
                        </TextButton>
                     </StyledAction>
                     <StyledTabs>
                        <StyledTab active>
                           {t(address.concat('pricing'))}
                        </StyledTab>
                     </StyledTabs>
                     <StyledTabView>
                        <StyledTable>
                           <thead>
                              <tr>
                                 <th>
                                    {state.customizableProductOptions[
                                       productState.productIndex
                                    ].simpleRecipeProduct
                                       ? ''
                                       : t(address.concat('labels'))}
                                 </th>
                                 <th>
                                    {state.customizableProductOptions[
                                       productState.productIndex
                                    ].simpleRecipeProduct
                                       ? t(address.concat('servings'))
                                       : t(address.concat('options'))}
                                 </th>
                                 <th>{t(address.concat('price'))}</th>
                                 <th>{t(address.concat('discount'))}</th>
                                 <th>
                                    {t(address.concat('discounted price'))}
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                              {state.customizableProductOptions[
                                 productState.productIndex
                              ].simpleRecipeProduct ? (
                                 <>
                                    {state.customizableProductOptions[
                                       productState.productIndex
                                    ].simpleRecipeProduct.simpleRecipeProductOptions
                                       .filter(
                                          option => option.type === 'mealKit'
                                       )
                                       .filter(option => option.isActive)
                                       .map((option, i) => (
                                          <tr key={option.id}>
                                             <td>
                                                {i === 0 ? (
                                                   <span>
                                                      {t(
                                                         address.concat(
                                                            'meal kit'
                                                         )
                                                      )}
                                                   </span>
                                                ) : (
                                                   ''
                                                )}
                                             </td>
                                             <td>
                                                {
                                                   option.simpleRecipeYield
                                                      .yield.serving
                                                }
                                             </td>
                                             <td>${option.price[0].value} </td>
                                             <td>
                                                {option.price[0].discount} %
                                             </td>
                                             <td>
                                                $
                                                {(
                                                   parseFloat(
                                                      option.price[0].value
                                                   ) -
                                                   parseFloat(
                                                      option.price[0].value
                                                   ) *
                                                      (parseFloat(
                                                         option.price[0]
                                                            .discount
                                                      ) /
                                                         100)
                                                ).toFixed(2) || ''}
                                             </td>
                                          </tr>
                                       ))}
                                    {state.customizableProductOptions[
                                       productState.productIndex
                                    ].simpleRecipeProduct.simpleRecipeProductOptions
                                       .filter(
                                          option => option.type === 'readyToEat'
                                       )
                                       .filter(option => option.isActive)
                                       .map((option, i) => (
                                          <tr key={option.id}>
                                             <td>
                                                {i === 0 ? (
                                                   <span>
                                                      {t(
                                                         address.concat(
                                                            'ready to eat'
                                                         )
                                                      )}
                                                   </span>
                                                ) : (
                                                   ''
                                                )}
                                             </td>
                                             <td>
                                                {
                                                   option.simpleRecipeYield
                                                      .yield.serving
                                                }
                                             </td>
                                             <td>${option.price[0].value} </td>
                                             <td>
                                                {option.price[0].discount} %
                                             </td>
                                             <td>
                                                $
                                                {(
                                                   parseFloat(
                                                      option.price[0].value
                                                   ) -
                                                   parseFloat(
                                                      option.price[0].value
                                                   ) *
                                                      (parseFloat(
                                                         option.price[0]
                                                            .discount
                                                      ) /
                                                         100)
                                                ).toFixed(2) || ''}
                                             </td>
                                          </tr>
                                       ))}
                                 </>
                              ) : (
                                 <>
                                    {state.customizableProductOptions[
                                       productState.productIndex
                                    ].inventoryProduct.inventoryProductOptions.map(
                                       option => (
                                          <tr key={option.id}>
                                             <td>{option.label}</td>
                                             <td>{option.quantity}</td>
                                             <td>${option.price[0].value} </td>
                                             <td>
                                                {option.price[0].discount} %
                                             </td>
                                             <td>
                                                $
                                                {(
                                                   parseFloat(
                                                      option.price[0].value
                                                   ) -
                                                   parseFloat(
                                                      option.price[0].value
                                                   ) *
                                                      (parseFloat(
                                                         option.price[0]
                                                            .discount
                                                      ) /
                                                         100)
                                                ).toFixed(2) || ''}
                                             </td>
                                          </tr>
                                       )
                                    )}
                                 </>
                              )}
                           </tbody>
                        </StyledTable>
                     </StyledTabView>
                  </StyledPanel>
               </StyledLayout>
            ) : (
               <ButtonTile
                  type="primary"
                  size="lg"
                  text={t(address.concat('add products'))}
                  onClick={() => openTunnel(1)}
               />
            )}
         </StyledWrapper>
      </>
   )
}

export default Products
