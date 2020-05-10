import React from 'react'
import { ButtonTile, Text, HelperText } from '@dailykit/ui'
import { ComboProductContext } from '../../../../../../context/product/comboProduct'
import {
   StyledWrapper,
   StyledLabel,
   StyledLayout,
   StyledListing,
   StyledListingTile,
   StyledPanel,
   StyledComboTile,
   StyledTable,
   StyledTabs,
   StyledTab,
   StyledHeader,
} from './styled'
import { AddIcon } from '../../../../../../assets/icons'

import { useTranslation } from 'react-i18next'

const address =
   'apps.online_store.views.forms.product.comboproduct.components.items.'

const Items = ({ state, openTunnel }) => {
   const { t } = useTranslation()
   const { productState, productDispatch } = React.useContext(
      ComboProductContext
   )

   const open = id => {
      productDispatch({
         type: 'META',
         payload: {
            name: 'componentId',
            value: id,
         },
      })
      openTunnel(3)
   }

   return (
      <StyledWrapper>
         {state.comboProductComponents?.length ? (
            <React.Fragment>
               <StyledHeader>
                  <Text as="h2">
                     {t(address.concat('items'))} (
                     {state.comboProductComponents.length})
                  </Text>
                  <span onClick={() => openTunnel(2)}>
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
                  <ItemsView state={state} openTunnel={openTunnel} />
               ) : (
                  state.comboProductComponents.map(component => (
                     <React.Fragment>
                        <StyledLabel>{component.label}</StyledLabel>
                        <ButtonTile
                           type="primary"
                           size="sm"
                           text={t(address.concat('add product'))}
                           onClick={() => open(component.id)}
                        />
                     </React.Fragment>
                  ))
               )}
            </React.Fragment>
         ) : (
            <ButtonTile
               type="primary"
               size="lg"
               text={t(address.concat('add items'))}
               onClick={() => openTunnel(2)}
            />
         )}
      </StyledWrapper>
   )
}

const ItemsView = ({ state, openTunnel }) => {
   const { t } = useTranslation()
   const { productState, productDipsatch } = React.useContext(
      ComboProductContext
   )

   const [active, setActive] = React.useState('')

   const open = id => {
      productDipsatch({
         type: 'META',
         payload: {
            name: 'componentId',
            value: id,
         },
      })
      openTunnel(3)
   }

   return (
      <StyledLayout>
         <StyledListing>
            {state.comboProductComponents.map(component => (
               <StyledComboTile key={component.id}>
                  <StyledLabel>{component.label}</StyledLabel>
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
                     </StyledListingTile>
                  ) : (
                     <ButtonTile
                        type="primary"
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
               <React.Fragment>
                  <h2>
                     {active.customizableProduct?.name ||
                        active.inventoryProduct?.name ||
                        active.simpleRecipeProduct?.name}
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
                  {(active.simpleRecipeProduct || active.inventoryProduct) && (
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
                           </tr>
                        </thead>
                        <tbody>
                           {active.simpleRecipeProduct ? (
                              <React.Fragment>
                                 {active.simpleRecipeProduct.simpleRecipeProductOptions
                                    .filter(option => option.type === 'mealKit')
                                    .filter(option => option.isActive)
                                    .map((option, i) => (
                                       <tr key={i}>
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
                                       </tr>
                                    ))}
                                 {active.simpleRecipeProduct.simpleRecipeProductOptions
                                    .filter(
                                       option => option.type === 'readyToEat'
                                    )
                                    .filter(option => option.isActive)
                                    .map((option, i) => (
                                       <tr key={i}>
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
                                       </tr>
                                    ))}
                              </React.Fragment>
                           ) : (
                              <React.Fragment>
                                 {active.inventoryProduct.inventoryProductOptions.map(
                                    option => (
                                       <tr key={option.id}>
                                          <td>{option.label}</td>
                                          <td>{option.quantity}</td>
                                          <td>${option.price[0].value} </td>
                                          <td>{option.price[0].discount} %</td>
                                       </tr>
                                    )
                                 )}
                              </React.Fragment>
                           )}
                        </tbody>
                     </StyledTable>
                  )}
               </React.Fragment>
            )}
         </StyledPanel>
      </StyledLayout>
   )
}

export default Items
