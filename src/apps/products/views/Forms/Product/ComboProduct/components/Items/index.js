import React from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   Flex,
   IconButton,
   PlusIcon,
   SectionTab,
   SectionTabList,
   SectionTabPanel,
   SectionTabPanels,
   SectionTabs,
   SectionTabsListHeader,
   Text,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import { ItemInfo, StyledTable } from './styled'
import { useTabs } from '../../../../../../context'
import { DragNDrop, Tooltip } from '../../../../../../../../shared/components'
import { DeleteIcon, LinkIcon } from '../../../../../../assets/icons'
import {
   currencyFmt,
   logger,
   isIncludedInOptions,
} from '../../../../../../../../shared/utils'
import { ComboProductContext } from '../../../../../../context/product/comboProduct'
import {
   DELETE_COMBO_PRODUCT_COMPONENT,
   UPDATE_COMBO_PRODUCT_COMPONENT,
} from '../../../../../../graphql'
import {
   ItemsTunnel,
   ProductOptionsTunnel,
   ProductsTunnel,
   ProductTypeTunnel,
} from '../../tunnels'

const address = 'apps.menu.views.forms.product.comboproduct.components.items.'

const Items = ({ state }) => {
   const { t } = useTranslation()
   const { addTab } = useTabs()
   const { productDispatch } = React.useContext(ComboProductContext)

   const [tunnels, openTunnel, closeTunnel] = useTunnel(4)

   const open = id => {
      productDispatch({
         type: 'META',
         payload: {
            name: 'componentId',
            value: id,
         },
      })
      openTunnel(2)
   }

   // Mutation
   const [deleteComboProductComponent] = useMutation(
      DELETE_COMBO_PRODUCT_COMPONENT,
      {
         onCompleted: () => {
            toast.success(t(address.concat('label removed!')))
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )
   const [updateComboProductComponent] = useMutation(
      UPDATE_COMBO_PRODUCT_COMPONENT,
      {
         onCompleted: () => {
            toast.success('Product removed!')
         },
         onError: error => {
            toast.error('Something went wrong!')
            logger(error)
         },
      }
   )

   // Handlers
   const removeComponent = component => {
      if (window.confirm(`Do you want to remove label - ${component.label}?`)) {
         deleteComboProductComponent({
            variables: {
               id: component.id,
            },
         })
      }
   }
   const removeProduct = component => {
      if (
         window.confirm(
            `Do you want to remove product from label ${component.label}?`
         )
      ) {
         updateComboProductComponent({
            variables: {
               id: component.id,
               set: {
                  customizableProductId: null,
                  inventoryProductId: null,
                  simpleRecipeProductId: null,
                  options: null,
               },
            },
         })
      }
   }

   const editOptions = component => {
      productDispatch({
         type: 'OPTIONS_MODE',
         payload: {
            type: 'edit',
            options: component.options,
            componentId: component.id,
         },
      })
      productDispatch({
         type: 'PRODUCT',
         payload: {
            value: component.inventoryProduct || component.simpleRecipeProduct,
         },
      })
      openTunnel(4)
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="sm">
               <ItemsTunnel state={state} close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <ProductTypeTunnel close={closeTunnel} open={openTunnel} />
            </Tunnel>
            <Tunnel layer={3}>
               <ProductsTunnel
                  state={state}
                  close={closeTunnel}
                  open={openTunnel}
               />
            </Tunnel>
            <Tunnel layer={4}>
               <ProductOptionsTunnel state={state} close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         {state.comboProductComponents?.length ? (
            <SectionTabs>
               <SectionTabList>
                  <SectionTabsListHeader>
                     <Flex container alignItems="center">
                        <Text as="title">
                           Items({state.comboProductComponents.length})
                        </Text>
                        <Tooltip identifier="combo_product_items" />
                     </Flex>
                     <IconButton type="ghost" onClick={() => openTunnel(1)}>
                        <PlusIcon color="#555b6e" />
                     </IconButton>
                  </SectionTabsListHeader>
                  <DragNDrop
                     list={state.comboProductComponents}
                     droppableId="comboProductComponentsDroppableId"
                     tablename="comboProductComponent"
                     schemaname="products"
                  >
                     {state.comboProductComponents.map(component => (
                        <React.Fragment key={component.id}>
                           <Flex
                              container
                              alignItems="center"
                              justifyContent="space-between"
                           >
                              <Text as="h4"> {component.label} </Text>
                              <IconButton
                                 type="ghost"
                                 onClick={() => removeComponent(component)}
                              >
                                 <DeleteIcon color="#FF5A52" />
                              </IconButton>
                           </Flex>
                           <SectionTab>
                              {Boolean(
                                 component.customizableProduct ||
                                    component.inventoryProduct ||
                                    component.simpleRecipeProduct
                              ) ? (
                                 <ItemInfo>
                                    {Boolean(
                                       component.simpleRecipeProduct?.assets
                                          ?.images?.length ||
                                          component.inventoryProduct?.assets
                                             ?.images?.length ||
                                          component.customizableProduct?.assets
                                             ?.images?.length
                                    ) && (
                                       <img
                                          src={
                                             component.simpleRecipeProduct
                                                ?.assets?.images[0] ||
                                             component.inventoryProduct?.assets
                                                ?.images[0] ||
                                             component.customizableProduct
                                                ?.assets?.images[0]
                                          }
                                       />
                                    )}
                                    <h3>
                                       {component.inventoryProduct?.name ||
                                          component.simpleRecipeProduct?.name ||
                                          component.customizableProduct?.name}
                                    </h3>
                                    <button
                                       onClick={() => removeProduct(component)}
                                    >
                                       <DeleteIcon color="#fff" />
                                    </button>
                                 </ItemInfo>
                              ) : (
                                 <ButtonTile
                                    type="secondary"
                                    text="Add Product"
                                    onClick={() => open(component.id)}
                                 />
                              )}
                           </SectionTab>
                        </React.Fragment>
                     ))}
                  </DragNDrop>
               </SectionTabList>
               <SectionTabPanels>
                  {state.comboProductComponents.map(component => (
                     <SectionTabPanel key={component.id}>
                        {Boolean(
                           component.customizableProduct ||
                              component.inventoryProduct ||
                              component.simpleRecipeProduct
                        ) ? (
                           <>
                              <Flex
                                 container
                                 alignItems="center"
                                 justifyContent="space-between"
                              >
                                 <Flex container alignItems="center">
                                    <Text as="h2">
                                       {component.customizableProduct?.name ||
                                          component.inventoryProduct?.name ||
                                          component.simpleRecipeProduct?.name}
                                    </Text>
                                    <IconButton
                                       type="ghost"
                                       onClick={() =>
                                          component.inventoryProduct
                                             ? addTab(
                                                  component.inventoryProduct
                                                     .name,
                                                  `/products/inventory-products/${component.inventoryProduct.id}`
                                               )
                                             : component.simpleRecipeProduct
                                             ? addTab(
                                                  component.simpleRecipeProduct
                                                     .name,
                                                  `/products/simple-recipe-products/${component.simpleRecipeProduct.id}`
                                               )
                                             : addTab(
                                                  component.customizableProduct
                                                     .name,
                                                  `/products/customizable-products/${component.customizableProduct.id}`
                                               )
                                       }
                                    >
                                       <LinkIcon color="#00A7E1" stroke={1.5} />
                                    </IconButton>
                                 </Flex>
                                 {!component.customizableProduct && (
                                    <TextButton
                                       type="outline"
                                       onClick={() => editOptions(component)}
                                    >
                                       Edit Options
                                    </TextButton>
                                 )}
                              </Flex>
                              {component.simpleRecipeProduct ||
                              component.inventoryProduct ? (
                                 <>
                                    {component.options?.length ? (
                                       <StyledTable>
                                          <thead>
                                             <tr>
                                                <th>
                                                   {component.simpleRecipeProduct
                                                      ? ''
                                                      : 'Label'}
                                                </th>
                                                <th>
                                                   {component.simpleRecipeProduct
                                                      ? 'Serving'
                                                      : 'Quantity'}
                                                </th>
                                                <th>
                                                   {t(address.concat('price'))}
                                                </th>
                                                <th>
                                                   {t(
                                                      address.concat('discount')
                                                   )}
                                                </th>
                                                <th>
                                                   {t(
                                                      address.concat(
                                                         'discounted price'
                                                      )
                                                   )}
                                                </th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {component.simpleRecipeProduct ? (
                                                <>
                                                   {component.simpleRecipeProduct.simpleRecipeProductOptions
                                                      .filter(
                                                         option =>
                                                            option.type ===
                                                            'mealKit'
                                                      )
                                                      .filter(
                                                         option =>
                                                            option.isActive &&
                                                            isIncludedInOptions(
                                                               option.id,
                                                               component.options
                                                            )
                                                      )
                                                      .map(option => {
                                                         const op = component.options.find(
                                                            ({ optionId }) =>
                                                               optionId ===
                                                               option.id
                                                         )
                                                         return {
                                                            ...option,
                                                            price: op.price,
                                                            discount:
                                                               op.discount,
                                                         }
                                                      })
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
                                                                  option
                                                                     .simpleRecipeYield
                                                                     .yield
                                                                     .serving
                                                               }
                                                            </td>
                                                            <td>
                                                               {currencyFmt(
                                                                  Number(
                                                                     option.price
                                                                  ) || 0
                                                               )}
                                                            </td>
                                                            <td>
                                                               {option.discount}
                                                               %
                                                            </td>
                                                            <td>
                                                               {currencyFmt(
                                                                  Number(
                                                                     (
                                                                        parseFloat(
                                                                           option.price
                                                                        ) -
                                                                        parseFloat(
                                                                           option.price
                                                                        ) *
                                                                           (parseFloat(
                                                                              option.discount
                                                                           ) /
                                                                              100)
                                                                     ).toFixed(
                                                                        2
                                                                     )
                                                                  ) || 0
                                                               )}
                                                            </td>
                                                         </tr>
                                                      ))}
                                                   {component.simpleRecipeProduct.simpleRecipeProductOptions
                                                      .filter(
                                                         option =>
                                                            option.type ===
                                                            'readyToEat'
                                                      )
                                                      .filter(
                                                         option =>
                                                            option.isActive &&
                                                            isIncludedInOptions(
                                                               option.id,
                                                               component.options
                                                            )
                                                      )
                                                      .map(option => {
                                                         const op = component.options.find(
                                                            ({ optionId }) =>
                                                               optionId ===
                                                               option.id
                                                         )
                                                         return {
                                                            ...option,
                                                            price: op.price,
                                                            discount:
                                                               op.discount,
                                                         }
                                                      })
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
                                                                  option
                                                                     .simpleRecipeYield
                                                                     .yield
                                                                     .serving
                                                               }
                                                            </td>
                                                            <td>
                                                               {currencyFmt(
                                                                  Number(
                                                                     option.price
                                                                  ) || 0
                                                               )}
                                                            </td>
                                                            <td>
                                                               {option.discount}
                                                               %
                                                            </td>
                                                            <td>
                                                               {currencyFmt(
                                                                  Number(
                                                                     (
                                                                        parseFloat(
                                                                           option.price
                                                                        ) -
                                                                        parseFloat(
                                                                           option.price
                                                                        ) *
                                                                           (parseFloat(
                                                                              option.discount
                                                                           ) /
                                                                              100)
                                                                     ).toFixed(
                                                                        2
                                                                     )
                                                                  ) || 0
                                                               )}
                                                            </td>
                                                         </tr>
                                                      ))}
                                                </>
                                             ) : (
                                                <>
                                                   {component.inventoryProduct.inventoryProductOptions
                                                      .filter(option =>
                                                         isIncludedInOptions(
                                                            option.id,
                                                            component.options
                                                         )
                                                      )
                                                      .map(option => {
                                                         const op = component.options.find(
                                                            ({ optionId }) =>
                                                               optionId ===
                                                               option.id
                                                         )
                                                         return {
                                                            ...option,
                                                            price: op.price,
                                                            discount:
                                                               op.discount,
                                                         }
                                                      })
                                                      .map(option => (
                                                         <tr key={option.id}>
                                                            <td>
                                                               {option.label}
                                                            </td>
                                                            <td>
                                                               {option.quantity}
                                                            </td>
                                                            <td>
                                                               {currencyFmt(
                                                                  Number(
                                                                     option.price
                                                                  ) || 0
                                                               )}
                                                            </td>
                                                            <td>
                                                               {option.discount}
                                                               %
                                                            </td>
                                                            <td>
                                                               {currencyFmt(
                                                                  Number(
                                                                     (
                                                                        parseFloat(
                                                                           option.price
                                                                        ) -
                                                                        parseFloat(
                                                                           option.price
                                                                        ) *
                                                                           (parseFloat(
                                                                              option.discount
                                                                           ) /
                                                                              100)
                                                                     ).toFixed(
                                                                        2
                                                                     )
                                                                  ) || 0
                                                               )}
                                                            </td>
                                                         </tr>
                                                      ))}
                                                </>
                                             )}
                                          </tbody>
                                       </StyledTable>
                                    ) : (
                                       <Text as="subtitle">
                                          {' '}
                                          No product options selected!{' '}
                                       </Text>
                                    )}
                                 </>
                              ) : (
                                 <Text as="p">
                                    {t(
                                       address.concat(
                                          'cannot display pricing for a customizable product'
                                       )
                                    )}
                                    .
                                 </Text>
                              )}
                           </>
                        ) : (
                           <Text as="subtitle">No product added yet. </Text>
                        )}
                     </SectionTabPanel>
                  ))}
               </SectionTabPanels>
            </SectionTabs>
         ) : (
            <ButtonTile
               type="primary"
               size="lg"
               text={t(address.concat('add items'))}
               onClick={() => openTunnel(1)}
            />
         )}
      </>
   )
}

export default Items
