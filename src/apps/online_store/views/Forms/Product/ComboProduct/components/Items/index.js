import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   ButtonTile,
   HelperText,
   Text,
   Tunnels,
   Tunnel,
   useTunnel,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { AddIcon, DeleteIcon, LinkIcon } from '../../../../../../assets/icons'
import { ComboProductContext } from '../../../../../../context/product/comboProduct'
import { Context } from '../../../../../../context/tabs'
import {
   DELETE_COMBO_PRODUCT_COMPONENT,
   UPDATE_COMBO_PRODUCT_COMPONENT,
} from '../../../../../../graphql'
import {
   StyledComboTile,
   StyledHeader,
   StyledLabel,
   StyledLayout,
   StyledLink,
   StyledListing,
   StyledListingTile,
   StyledPanel,
   StyledTab,
   StyledTable,
   StyledTabs,
   StyledWrapper,
} from './styled'
import { ItemsTunnel, ProductTypeTunnel, ProductsTunnel } from '../../tunnels'

const address =
   'apps.online_store.views.forms.product.comboproduct.components.items.'

const Items = ({ state }) => {
   const { t } = useTranslation()
   const { productDispatch } = React.useContext(ComboProductContext)

   const [tunnels, openTunnel, closeTunnel] = useTunnel(3)

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
            console.log(error)
            toast.error(t(address.concat('error')))
         },
      }
   )

   // Handlers
   const removeComponent = component => {
      if (
         window.confirm(
            `t(address.concat('are you sure you want to remove label')) - ${component.label}?`
         )
      ) {
         deleteComboProductComponent({
            variables: {
               id: component.id,
            },
         })
      }
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <ItemsTunnel state={state} close={closeTunnel} />
            </Tunnel>
            <Tunnel layer={2}>
               <ProductTypeTunnel close={closeTunnel} open={openTunnel} />
            </Tunnel>
            <Tunnel layer={3}>
               <ProductsTunnel
                  state={state}
                  close={closeTunnel}
                  // products={products[productState.meta.productType]}
               />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            {state.comboProductComponents?.length ? (
               <>
                  <StyledHeader>
                     <Text as="h2">
                        {t(address.concat('items'))} (
                        {state.comboProductComponents.length})
                     </Text>
                     <span
                        role="button"
                        tabIndex="0"
                        onKeyDown={e => e.charCode === 13 && openTunnel(1)}
                        onClick={() => openTunnel(1)}
                     >
                        <AddIcon color="#555B6E" size="16" stroke="3" />
                     </span>
                  </StyledHeader>
                  {/* This filter will see if any of the item has product in it, if yes then view will change */}
                  {state.comboProductComponents.filter(
                     component =>
                        component.customizableProduct ||
                        component.inventoryProduct ||
                        component.simpleRecipeProduct
                  ).length ? (
                     <ItemsView
                        state={state}
                        openTunnel={openTunnel}
                        deleteComboProductComponent={
                           deleteComboProductComponent
                        }
                     />
                  ) : (
                     state.comboProductComponents.map(component => (
                        <>
                           <StyledLabel>
                              {component.label}
                              <span
                                 role="button"
                                 tabIndex="0"
                                 onKeyDown={e =>
                                    e.charCode === 13 &&
                                    removeComponent(component)
                                 }
                                 onClick={() => removeComponent(component)}
                              >
                                 <DeleteIcon color="#FF5A52" />
                              </span>
                           </StyledLabel>
                           <ButtonTile
                              type="primary"
                              size="sm"
                              text={t(address.concat('add product'))}
                              onClick={() => open(component.id)}
                           />
                        </>
                     ))
                  )}
               </>
            ) : (
               <ButtonTile
                  type="primary"
                  size="lg"
                  text={t(address.concat('add items'))}
                  onClick={() => openTunnel(1)}
               />
            )}
         </StyledWrapper>
      </>
   )
}

const ItemsView = ({ state, openTunnel, deleteComboProductComponent }) => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const { productDispatch } = React.useContext(ComboProductContext)

   const [active, setActive] = React.useState('')

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
   const [updateComboProductComponent] = useMutation(
      UPDATE_COMBO_PRODUCT_COMPONENT,
      {
         onCompleted: () => {
            toast.success('Product removed!')
         },
         onError: error => {
            console.log(error)
            toast.error('Error')
         },
      }
   )

   // Handlers
   const removeProduct = component => {
      if (
         window.confirm(
            `t(address.concat('are you sure you want to remove product from')) ${component.label}?`
         )
      ) {
         updateComboProductComponent({
            variables: {
               id: component.id,
               set: {
                  customizableProductId: null,
                  inventoryProductId: null,
                  simpleRecipeProductId: null,
               },
            },
         })
      }
   }
   const removeComponent = component => {
      if (
         window.confirm(
            `Are you sure you want to remove label - ${component.label}?`
         )
      ) {
         deleteComboProductComponent({
            variables: {
               id: component.id,
            },
         })
      }
   }
   const addTab = (title, view, id) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view, id } })
   }

   return (
      <StyledLayout>
         <StyledListing>
            {state.comboProductComponents.map(component => (
               <StyledComboTile key={component.id}>
                  <StyledLabel>
                     {component.label}{' '}
                     <span
                        role="button"
                        tabIndex="0"
                        onKeyDown={e =>
                           e.charCode === 13 && removeComponent(component)
                        }
                        onClick={() => removeComponent(component)}
                     >
                        <DeleteIcon color="#FF5A52" />
                     </span>{' '}
                  </StyledLabel>
                  {component.customizableProduct ||
                  component.inventoryProduct ||
                  component.simpleRecipeProduct ? (
                     <StyledListingTile
                        active={active.id === component.id}
                        onClick={() => setActive(component)}
                     >
                        <h3>
                           {component.customizableProduct?.name ||
                              component.inventoryProduct?.name ||
                              component.simpleRecipeProduct?.name}
                        </h3>
                        <span
                           role="button"
                           tabIndex="0"
                           onKeyDown={e =>
                              e.charCode === 13 && removeProduct(component)
                           }
                           onClick={() => removeProduct(component)}
                        >
                           <DeleteIcon color="#fff" />
                        </span>
                     </StyledListingTile>
                  ) : (
                     <ButtonTile
                        type="secondary"
                        size="sm"
                        text={t(address.concat('add product'))}
                        onClick={() => open(component.id)}
                     />
                  )}
               </StyledComboTile>
            ))}
         </StyledListing>
         <StyledPanel>
            {active && (
               <>
                  <h2>
                     {active.customizableProduct?.name ||
                        active.inventoryProduct?.name ||
                        active.simpleRecipeProduct?.name}
                     <StyledLink
                        onClick={() =>
                           // eslint-disable-next-line no-nested-ternary
                           active.inventoryProduct
                              ? addTab(
                                   active.inventoryProduct.name,
                                   'inventoryProduct',
                                   active.inventoryProduct.id
                                )
                              : active.simpleRecipeProduct
                              ? addTab(
                                   active.simpleRecipeProduct.name,
                                   'simpleRecipeProduct',
                                   active.simpleRecipeProduct.id
                                )
                              : addTab(
                                   active.customizableProduct.name,
                                   'customizableProduct',
                                   active.customizableProduct.id
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
                  <StyledTabs>
                     <StyledTab active>
                        {t(address.concat('pricing'))}
                     </StyledTab>
                  </StyledTabs>
                  {active.simpleRecipeProduct || active.inventoryProduct ? (
                     <StyledTable>
                        <thead>
                           <tr>
                              <th>
                                 {active.simpleRecipeProduct
                                    ? ''
                                    : t(address.concat('labels'))}
                              </th>
                              <th>
                                 {active.simpleRecipeProduct
                                    ? t(address.concat('servings'))
                                    : t(address.concat('options'))}
                              </th>
                              <th>{t(address.concat('price'))}</th>
                              <th>{t(address.concat('discount'))}</th>
                              <th>{t(address.concat('discounted price'))}</th>
                           </tr>
                        </thead>
                        <tbody>
                           {active.simpleRecipeProduct ? (
                              <>
                                 {active.simpleRecipeProduct.simpleRecipeProductOptions
                                    .filter(option => option.type === 'mealKit')
                                    .filter(option => option.isActive)
                                    .map((option, i) => (
                                       <tr key={option.id}>
                                          <td>
                                             {i === 0 ? (
                                                <span>
                                                   {t(
                                                      address.concat('meal kit')
                                                   )}
                                                </span>
                                             ) : (
                                                ''
                                             )}
                                          </td>
                                          <td>
                                             {
                                                option.simpleRecipeYield.yield
                                                   .serving
                                             }
                                          </td>
                                          <td>${option.price[0].value} </td>
                                          <td>{option.price[0].discount} %</td>
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
                                                      option.price[0].discount
                                                   ) /
                                                      100)
                                             ).toFixed(2) || ''}
                                          </td>
                                       </tr>
                                    ))}
                                 {active.simpleRecipeProduct.simpleRecipeProductOptions
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
                                                option.simpleRecipeYield.yield
                                                   .serving
                                             }
                                          </td>
                                          <td>${option.price[0].value} </td>
                                          <td>{option.price[0].discount} %</td>
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
                                                      option.price[0].discount
                                                   ) /
                                                      100)
                                             ).toFixed(2) || ''}
                                          </td>
                                       </tr>
                                    ))}
                              </>
                           ) : (
                              <>
                                 {active.inventoryProduct.inventoryProductOptions.map(
                                    option => (
                                       <tr key={option.id}>
                                          <td>{option.label}</td>
                                          <td>{option.quantity}</td>
                                          <td>${option.price[0].value} </td>
                                          <td>{option.price[0].discount} %</td>
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
                                                      option.price[0].discount
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
            )}
         </StyledPanel>
      </StyledLayout>
   )
}

export default Items
