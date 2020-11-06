import React from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   HelperText,
   TextButton,
   Tunnels,
   Tunnel,
   useTunnel,
   SectionTabs,
   SectionTabList,
   SectionTabsListHeader,
   Text,
   IconButton,
   PlusIcon,
   SectionTab,
   SectionTabPanels,
   SectionTabPanel,
   Flex,
} from '@dailykit/ui'

import { ItemInfo, StyledTable } from './styled'
import { useTabs } from '../../../../../../context'
import { ProductTypeTunnel, ProductsTunnel } from '../../tunnels'
import { Tooltip } from '../../../../../../../../shared/components'
import { DeleteIcon, LinkIcon } from '../../../../../../assets/icons'
import { currencyFmt, logger } from '../../../../../../../../shared/utils'
import { CustomizableProductContext } from '../../../../../../context/product/customizableProduct'
import {
   DELETE_CUSTOMIZABLE_PRODUCT_OPTION,
   UPDATE_CUSTOMIZABLE_PRODUCT,
} from '../../../../../../graphql'
// styles

const address =
   'apps.menu.views.forms.product.customizableproduct.components.products.'

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
         toast.success('Product removed!')
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })
   const [updateProduct] = useMutation(UPDATE_CUSTOMIZABLE_PRODUCT, {
      onCompleted: () => {
         toast.success(t(address.concat('default updated!')))
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
   })

   // Handlers
   const remove = product => {
      if (
         window.confirm(
            `Do you want to remove - ${
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
   const makeDefault = id => {
      updateProduct({
         variables: {
            id: state.id,
            set: {
               default: id,
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
         {state.customizableProductOptions?.length ? (
            <SectionTabs>
               <SectionTabList>
                  <SectionTabsListHeader>
                     <Flex container alignItems="center">
                        <Text as="title">
                           Products({state.customizableProductOptions.length})
                        </Text>
                        <Tooltip identifier="customizable_product_products" />
                     </Flex>
                     <IconButton type="ghost" onClick={() => openTunnel(1)}>
                        <PlusIcon color="#555b6e" />
                     </IconButton>
                  </SectionTabsListHeader>
                  {state.customizableProductOptions.map(option => (
                     <SectionTab key={option.id}>
                        <ItemInfo>
                           {Boolean(
                              option.simpleRecipeProduct?.assets?.images
                                 ?.length ||
                                 option.inventoryProduct?.assets?.images?.length
                           ) && (
                              <img
                                 src={
                                    option.simpleRecipeProduct?.assets
                                       ?.images[0] ||
                                    option.inventoryProduct?.assets?.images[0]
                                 }
                              />
                           )}
                           <h3>
                              {option.inventoryProduct?.name ||
                                 option.simpleRecipeProduct?.name}
                           </h3>
                           <button onClick={() => remove(option)}>
                              <DeleteIcon color="#fff" />
                           </button>
                           <label hidden={state.default !== option.id}>
                              {t(address.concat('default'))}
                           </label>
                        </ItemInfo>
                     </SectionTab>
                  ))}
               </SectionTabList>
               <SectionTabPanels>
                  {state.customizableProductOptions.map(option => (
                     <SectionTabPanel key={option.id}>
                        <Flex
                           container
                           alignItems="center"
                           justifyContent="space-between"
                        >
                           <Flex container alignItems="center">
                              <Text as="h2">
                                 {option.inventoryProduct?.name ||
                                    option.simpleRecipeProduct?.name}
                              </Text>
                              <IconButton
                                 type="ghost"
                                 onClick={() =>
                                    option.inventoryProduct
                                       ? addTab(
                                            option.inventoryProduct.name,
                                            `/products/inventory-products/${option.inventoryProduct.id}`
                                         )
                                       : addTab(
                                            option.simpleRecipeProduct.name,
                                            `/products/simple-recipe-products/${option.simpleRecipeProduct.id}`
                                         )
                                 }
                              >
                                 <LinkIcon color="#00A7E1" stroke={1.5} />
                              </IconButton>
                           </Flex>
                           {Boolean(state.default !== option.id) && (
                              <TextButton
                                 type="ghost"
                                 onClick={() => makeDefault(option.id)}
                              >
                                 Set as Default
                              </TextButton>
                           )}
                        </Flex>
                        <StyledTable>
                           <thead>
                              <tr>
                                 <th>
                                    {option.simpleRecipeProduct
                                       ? ''
                                       : t(address.concat('labels'))}
                                 </th>
                                 <th>
                                    {option.simpleRecipeProduct
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
                              {option.simpleRecipeProduct ? (
                                 <>
                                    {option.simpleRecipeProduct.simpleRecipeProductOptions
                                       .filter(op => op.type === 'mealKit')
                                       .filter(op => op.isActive)
                                       .map((op, i) => (
                                          <tr key={op.id}>
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
                                                   op.simpleRecipeYield.yield
                                                      .serving
                                                }
                                             </td>
                                             <td>
                                                {currencyFmt(
                                                   Number(op.price[0].value) ||
                                                      0
                                                )}{' '}
                                             </td>
                                             <td>{op.price[0].discount} %</td>
                                             <td>
                                                {currencyFmt(
                                                   Number(
                                                      (
                                                         parseFloat(
                                                            op.price[0].value
                                                         ) -
                                                         parseFloat(
                                                            op.price[0].value
                                                         ) *
                                                            (parseFloat(
                                                               op.price[0]
                                                                  .discount
                                                            ) /
                                                               100)
                                                      ).toFixed(2)
                                                   ) || 0
                                                )}
                                             </td>
                                          </tr>
                                       ))}
                                    {option.simpleRecipeProduct.simpleRecipeProductOptions
                                       .filter(op => op.type === 'readyToEat')
                                       .filter(op => op.isActive)
                                       .map((op, i) => (
                                          <tr key={op.id}>
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
                                                   op.simpleRecipeYield.yield
                                                      .serving
                                                }
                                             </td>
                                             <td>${op.price[0].value} </td>
                                             <td>{op.price[0].discount} %</td>
                                             <td>
                                                $
                                                {(
                                                   parseFloat(
                                                      op.price[0].value
                                                   ) -
                                                   parseFloat(
                                                      op.price[0].value
                                                   ) *
                                                      (parseFloat(
                                                         op.price[0].discount
                                                      ) /
                                                         100)
                                                ).toFixed(2) || ''}
                                             </td>
                                          </tr>
                                       ))}
                                 </>
                              ) : (
                                 <>
                                    {option.inventoryProduct.inventoryProductOptions.map(
                                       op => (
                                          <tr key={op.id}>
                                             <td>{op.label}</td>
                                             <td>{op.quantity}</td>
                                             <td>${op.price[0].value} </td>
                                             <td>{op.price[0].discount} %</td>
                                             <td>
                                                $
                                                {(
                                                   parseFloat(
                                                      op.price[0].value
                                                   ) -
                                                   parseFloat(
                                                      op.price[0].value
                                                   ) *
                                                      (parseFloat(
                                                         op.price[0].discount
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
                     </SectionTabPanel>
                  ))}
               </SectionTabPanels>
            </SectionTabs>
         ) : (
            <ButtonTile
               type="primary"
               size="lg"
               text={t(address.concat('add products'))}
               onClick={() => openTunnel(1)}
            />
         )}
      </>
   )
}

export default Products
