import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   TextButton,
   useSingleList,
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Text,
} from '@dailykit/ui'

import { CloseIcon } from '../../../../../../assets/icons'
import { TunnelHeader, TunnelBody } from '../styled'

import { toast } from 'react-toastify'

import {
   UPDATE_SIMPLE_RECIPE_PRODUCT,
   CREATE_SIMPLE_RECIPE_PRODUCT_OPTIONS,
} from '../../../../../../graphql'

import { useTranslation, Trans } from 'react-i18next'

const address =
   'apps.online_store.views.forms.product.simplerecipeproduct.tunnels.recipetunnel.'

export default function RecipeTunnel({ state, close, recipes }) {
   const { t } = useTranslation()

   const [busy, setBusy] = React.useState(false)

   const [search, setSearch] = React.useState('')
   const [list, current, selectOption] = useSingleList(recipes)

   // 2

   // Mutation
   const [updateProduct] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT, {
      variables: {
         id: state.id,
         set: {
            simpleRecipeId: current.id,
         },
      },
      onCompleted: () => {
         toast.success('Recipe added! Creating options...')
         createOptions()
      },
      onError: error => {
         console.log(error)
         toast.error('Error!')
         setBusy(false)
      },
   })
   const [createOptions] = useMutation(CREATE_SIMPLE_RECIPE_PRODUCT_OPTIONS, {
      variables: {
         objects: current.simpleRecipeYields?.flatMap(serving => {
            return [
               {
                  simpleRecipeProductId: state.id,
                  simpleRecipeYieldId: serving.id,
                  type: 'mealKit',
                  isActive: true,
                  price: [
                     {
                        rule: '',
                        value: '0',
                        discount: '0',
                     },
                  ],
               },
               {
                  simpleRecipeProductId: state.id,
                  simpleRecipeYieldId: serving.id,
                  type: 'readyToEat',
                  isActive: true,
                  price: [
                     {
                        rule: '',
                        value: '0',
                        discount: '0',
                     },
                  ],
               },
            ]
         }),
      },
      onCompleted: () => {
         toast.success('Options added!')
         close(2)
      },
      onError: error => {
         console.log(error)
         toast.error('Error!')
         setBusy(false)
      },
   })

   // Handlers
   const add = () => {
      if (busy) return
      setBusy(true)
      updateProduct()
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(2)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <Text as="title">{t(address.concat('select a recipe'))}</Text>
            </div>
            <div>
               <TextButton type="solid" onClick={add}>
                  {busy
                     ? t(address.concat('adding'))
                     : t(address.concat('add'))}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem type="SSL1" title={current.title} />
               ) : (
                  <ListSearch
                     onChange={value => setSearch(value)}
                     placeholder={t(
                        address.concat("type what you're looking for")
                     )}
                  />
               )}
               <ListOptions>
                  {list
                     .filter(option =>
                        option.title.toLowerCase().includes(search)
                     )
                     .map(option => (
                        <ListItem
                           type="SSL1"
                           key={option.id}
                           title={option.title}
                           isActive={option.id === current.id}
                           onClick={() => selectOption('id', option.id)}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelBody>
      </React.Fragment>
   )
}
