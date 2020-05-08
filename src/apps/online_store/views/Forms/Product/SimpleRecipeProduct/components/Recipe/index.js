import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ButtonTile, IconButton } from '@dailykit/ui'

import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'

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
} from './styled'

import { Accompaniments } from '../'

import { toast } from 'react-toastify'

import {
   UPDATE_SIMPLE_RECIPE_PRODUCT,
   DELETE_SIMPLE_RECIPE_PRODUCT_OPTIONS,
} from '../../../../../../graphql'

import { useTranslation, Trans } from 'react-i18next'
import { EyeIcon, EditIcon, DeleteIcon } from '../../../../../../assets/icons'

const address =
   'apps.online_store.views.forms.product.simplerecipeproduct.components.recipe.'

export default function Recipe({ state, openTunnel }) {
   const { t } = useTranslation()
   const { productDispatch } = React.useContext(SimpleProductContext)

   const [_state, _setState] = React.useState({
      view: 'pricing',
   })

   // Mutation
   const [updateProduct] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT, {
      onCompleted: () => {
         toast.success('Default set!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error!')
      },
   })
   const [removeRecipe] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT, {
      variables: {
         id: state.id,
         set: {
            simpleRecipeId: null,
            default: null,
         },
      },
      onCompleted: () => {
         toast.success('Recipe removed!')
         deleteOptions()
      },
      onError: error => {
         console.log(error)
         toast.error('Error!')
      },
   })
   const [deleteOptions] = useMutation(DELETE_SIMPLE_RECIPE_PRODUCT_OPTIONS, {
      variables: {
         ids: state.simpleRecipeProductOptions?.map(option => option.id),
      },
      onCompleted: () => {
         toast.success('Product options deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error!')
      },
   })

   // Handlers
   const remove = () => {
      if (window.confirm('Do you want to remove tagged recipe?')) {
         removeRecipe()
      }
   }
   const changeDefault = option => {
      if (option.id !== state.default) {
         updateProduct({
            variables: {
               id: state.id,
               set: {
                  default: option.id,
               },
            },
         })
      }
   }
   const editOption = option => {
      productDispatch({
         type: 'EDIT',
         payload: option,
      })
      openTunnel(6)
   }

   return (
      <StyledWrapper>
         {state.simpleRecipe ? (
            <StyledLayout>
               <StyledListing>
                  <StyledListingTile active>
                     <h3>{state.simpleRecipe.name}</h3>
                     <span onClick={remove}>
                        <DeleteIcon color="#fff" />
                     </span>
                  </StyledListingTile>
               </StyledListing>
               <StyledPanel>
                  <h2>{state.simpleRecipe.name}</h2>
                  <StyledTabs>
                     <StyledTab
                        onClick={() =>
                           _setState({ ..._state, view: 'pricing' })
                        }
                        active={_state.view === 'pricing'}
                     >
                        {t(address.concat('pricing'))}
                     </StyledTab>
                     <StyledTab
                        onClick={() =>
                           _setState({ ..._state, view: 'accompaniments' })
                        }
                        active={_state.view === 'accompaniments'}
                     >
                        {t(address.concat('accompaniments'))}
                     </StyledTab>
                  </StyledTabs>
                  <StyledTabView>
                     {_state.view === 'pricing' ? (
                        <StyledTable>
                           <thead>
                              <tr>
                                 <th></th>
                                 <th style={{ textAlign: 'center' }}>
                                    {t(address.concat('visibility'))}
                                 </th>
                                 <th style={{ textAlign: 'center' }}>
                                    {t(address.concat('default'))}
                                 </th>
                                 <th>{t(address.concat('servings'))}</th>
                                 <th>{t(address.concat('price'))}</th>
                                 <th>{t(address.concat('discount'))}</th>
                                 <th>
                                    {t(address.concat('discounted price'))}
                                 </th>
                                 <th></th>
                              </tr>
                           </thead>
                           <tbody>
                              {state.simpleRecipeProductOptions
                                 .filter(option => option.type === 'mealKit')
                                 .map((option, i) => (
                                    <tr key={i}>
                                       <td>
                                          {i === 0 ? (
                                             <span>
                                                {t(address.concat('meal kit'))}
                                             </span>
                                          ) : (
                                             ''
                                          )}
                                       </td>
                                       <td style={{ textAlign: 'center' }}>
                                          <span hidden={!option.isActive}>
                                             <EyeIcon color="#00A7E1" />
                                          </span>
                                       </td>
                                       <td style={{ textAlign: 'center' }}>
                                          <input
                                             type="radio"
                                             checked={
                                                state.default === option.id
                                             }
                                             onClick={() =>
                                                changeDefault(option)
                                             }
                                          />
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
                                             parseFloat(option.price[0].value) -
                                             parseFloat(option.price[0].value) *
                                                (parseFloat(
                                                   option.price[0].discount
                                                ) /
                                                   100)
                                          ).toFixed(2) || ''}
                                       </td>
                                       <td>
                                          <IconButton
                                             onClick={() => editOption(option)}
                                          >
                                             <EditIcon color="#00A7E1" />
                                          </IconButton>
                                       </td>
                                    </tr>
                                 ))}
                              {state.simpleRecipeProductOptions
                                 .filter(option => option.type === 'readyToEat')
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
                                       <td style={{ textAlign: 'center' }}>
                                          <span hidden={!option.isActive}>
                                             <EyeIcon color="#00A7E1" />
                                          </span>
                                       </td>
                                       <td style={{ textAlign: 'center' }}>
                                          <input
                                             type="radio"
                                             checked={
                                                state.default === option.id
                                             }
                                             onClick={() =>
                                                changeDefault(option)
                                             }
                                          />
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
                                             parseFloat(option.price[0].value) -
                                             parseFloat(option.price[0].value) *
                                                (parseFloat(
                                                   option.price[0].discount
                                                ) /
                                                   100)
                                          ).toFixed(2) || ''}
                                       </td>
                                       <td>
                                          <IconButton
                                             onClick={() => editOption(option)}
                                          >
                                             <EditIcon color="#00A7E1" />
                                          </IconButton>
                                       </td>
                                    </tr>
                                 ))}
                           </tbody>
                        </StyledTable>
                     ) : (
                        <Accompaniments state={state} openTunnel={openTunnel} />
                     )}
                  </StyledTabView>
               </StyledPanel>
            </StyledLayout>
         ) : (
            <ButtonTile
               type="primary"
               size="lg"
               text={t(address.concat('add recipe'))}
               onClick={() => openTunnel(2)}
            />
         )}
      </StyledWrapper>
   )
}
