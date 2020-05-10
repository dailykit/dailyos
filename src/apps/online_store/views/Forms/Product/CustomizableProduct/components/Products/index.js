import React from 'react'
import {
   ButtonTile,
   Checkbox,
   Toggle,
   TextButton,
   HelperText,
} from '@dailykit/ui'

import { CustomizableProductContext } from '../../../../../../context/product/customizableProduct'

// styles
import {
   StyledWrapper,
   StyledLayout,
   StyledListing,
   StyledPanel,
   StyledListingTile,
   StyledTabs,
   StyledTab,
   StyledTabView,
   StyledTable,
   StyledAction,
} from './styled'

import { StyledDefault } from '../../../SimpleRecipeProduct/components/Recipe/styled'

import { useTranslation, Trans } from 'react-i18next'
import { DeleteIcon } from '../../../../../../assets/icons'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { DELETE_CUSTOMIZABLE_PRODUCT_OPTION } from '../../../../../../graphql'

const address =
   'apps.online_store.views.forms.product.customizableproduct.components.items.'

const Products = ({ state, openTunnel }) => {
   const { t } = useTranslation()
   const { productState, productDispatch } = React.useContext(
      CustomizableProductContext
   )

   // Mutation
   const [deleteOption] = useMutation(DELETE_CUSTOMIZABLE_PRODUCT_OPTION, {
      onCompleted: () => {
         toast.success('Product deleted')
         productDispatch({
            type: 'PRODUCT_INDEX',
            payload: 0,
         })
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
   })

   // Handlers
   const remove = product => {
      if (
         window.confirm(
            `Are you sure you want to delete product - ${
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

   return (
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
                        <span onClick={() => remove(option)}>
                           <DeleteIcon color="#fff" />
                        </span>
                        <StyledDefault hidden={true}>
                           {t(address.concat('default'))}
                        </StyledDefault>
                     </StyledListingTile>
                  ))}
                  <ButtonTile
                     type="primary"
                     size="sm"
                     text={t(address.concat('add products'))}
                     onClick={() => openTunnel(2)}
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
                  </h2>
                  <HelperText
                     type="hint"
                     message={t(
                        address.concat(
                           'accompanients are taken as per added on the selected product'
                        )
                     )}
                  />
                  <StyledAction hidden={true}>
                     <TextButton
                        type="outline"
                        // onClick={() => {
                        //    dispatch({
                        //       type: 'DEFAULT',
                        //       payload: {
                        //          value: {
                        //             type: _state.currentItem.type,
                        //             id: _state.currentItem.id,
                        //          },
                        //       },
                        //    })
                        // }}
                     >
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
                              <th>{t(address.concat('discounted price'))}</th>
                           </tr>
                        </thead>
                        <tbody>
                           {state.customizableProductOptions[
                              productState.productIndex
                           ].simpleRecipeProduct ? (
                              <React.Fragment>
                                 {state.customizableProductOptions[
                                    productState.productIndex
                                 ].simpleRecipeProduct.simpleRecipeProductOptions
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
                                 {state.customizableProductOptions[
                                    productState.productIndex
                                 ].simpleRecipeProduct.simpleRecipeProductOptions
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
                              </React.Fragment>
                           ) : (
                              <React.Fragment>
                                 {state.customizableProductOptions[
                                    productState.productIndex
                                 ].inventoryProduct.inventoryProductOptions.map(
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
                              </React.Fragment>
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
               onClick={() => openTunnel(2)}
            />
         )}
      </StyledWrapper>
   )
}

export default Products
