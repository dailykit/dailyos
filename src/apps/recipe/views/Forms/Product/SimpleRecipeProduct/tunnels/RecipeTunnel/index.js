import React from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   TunnelHeader,
   Loader,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
   CREATE_SIMPLE_RECIPE_PRODUCT_OPTIONS,
   UPDATE_SIMPLE_RECIPE_PRODUCT,
   SIMPLE_RECIPES,
} from '../../../../../../graphql'
import { TunnelBody } from '../styled'

const address =
   'apps.online_store.views.forms.product.simplerecipeproduct.tunnels.recipetunnel.'

export default function RecipeTunnel({ state, close }) {
   const { t } = useTranslation()

   const [busy, setBusy] = React.useState(false)

   const [search, setSearch] = React.useState('')
   const [recipes, setRecipes] = React.useState([])
   const [list, current, selectOption] = useSingleList(recipes)

   // Subscription for fetching recipes
   const { loading } = useQuery(SIMPLE_RECIPES, {
      onCompleted: data => {
         const { simpleRecipes } = data
         const updatedRecipes = simpleRecipes.filter(
            item => item.isValid.status
         )
         setRecipes([...updatedRecipes])
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
      },
      fetchPolicy: 'cache-and-network',
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
         close(1)
      },
      onError: () => {
         toast.error('Error!')
         setBusy(false)
      },
   })

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
      onError: () => {
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
      <>
         <TunnelHeader
            title={t(address.concat('select a recipe'))}
            right={{
               action: add,
               title: busy
                  ? t(address.concat('adding'))
                  : t(address.concat('add')),
            }}
            close={() => close(1)}
         />
         <TunnelBody>
            {loading ? (
               <Loader />
            ) : (
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
            )}
         </TunnelBody>
      </>
   )
}
