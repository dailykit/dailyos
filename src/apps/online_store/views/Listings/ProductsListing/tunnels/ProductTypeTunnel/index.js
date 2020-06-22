import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Text, TunnelHeader } from '@dailykit/ui'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { randomSuffix } from '../../../../../../../shared/utils'
import { TunnelBody, SolidTile } from '../styled'
import { Context } from '../../../../../context/tabs'
import {
   CREATE_COMBO_PRODUCT,
   CREATE_CUSTOMIZABLE_PRODUCT,
   CREATE_INVENTORY_PRODUCT,
   CREATE_SIMPLE_RECIPE_PRODUCT,
} from '../../../../../graphql'

const address = 'apps.online_store.views.listings.productslisting.'

export default function ProductTypeTunnel({ close }) {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view, id) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view, id } })
   }

   // Mutations
   const [createComboProduct] = useMutation(CREATE_COMBO_PRODUCT, {
      onCompleted: data => {
         toast.success('Product created!')
         addTab(
            data.createComboProduct.returning[0].name,
            'comboProduct',
            data.createComboProduct.returning[0].id
         )
      },
   })
   const [createInventoryProduct] = useMutation(CREATE_INVENTORY_PRODUCT, {
      onCompleted: data => {
         toast.success('Product created!')
         addTab(
            data.createInventoryProduct.returning[0].name,
            'inventoryProduct',
            data.createInventoryProduct.returning[0].id
         )
      },
   })
   const [createRecipeProduct] = useMutation(CREATE_SIMPLE_RECIPE_PRODUCT, {
      onCompleted: data => {
         toast.success('Product created!')
         addTab(
            data.createSimpleRecipeProduct.returning[0].name,
            'simpleRecipeProduct',
            data.createSimpleRecipeProduct.returning[0].id
         )
      },
   })
   const [createCustomizableProduct] = useMutation(
      CREATE_CUSTOMIZABLE_PRODUCT,
      {
         onCompleted: data => {
            toast.success('Product created!')
            addTab(
               data.createCustomizableProduct.returning[0].name,
               'customizableProduct',
               data.createCustomizableProduct.returning[0].id
            )
         },
      }
   )

   const createProduct = type => {
      const object = {
         name: `${type}-${randomSuffix()}`,
      }
      switch (type) {
         case 'combo': {
            createComboProduct({
               variables: {
                  objects: [object],
               },
            })
            break
         }
         case 'inventory': {
            createInventoryProduct({
               variables: {
                  objects: [object],
               },
            })
            break
         }
         case 'recipe': {
            createRecipeProduct({
               variables: {
                  objects: [object],
               },
            })
            break
         }
         case 'customizable': {
            createCustomizableProduct({
               variables: {
                  objects: [object],
               },
            })
            break
         }
         default:
            return
      }
   }

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select type of product'))}
            close={() => close(1)}
         />
         <TunnelBody>
            <SolidTile onClick={() => createProduct('inventory')}>
               <Text as="h1">{t(address.concat('inventory product'))}</Text>
               <Text as="subtitle">
                  <Trans i18nKey={address.concat('subtitle 1')}>
                     Inventory product is just an item, supplied or bought
                  </Trans>
               </Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => createProduct('recipe')}>
               <Text as="h1">{t(address.concat('simple recipe product'))}</Text>
               <Text as="subtitle">
                  <Trans i18nKey={address.concat('subtitle 2')}>
                     Simple Recipe product is only one recipes, sold as Meal
                     Kits as well as Ready to Eat
                  </Trans>
               </Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => createProduct('customizable')}>
               <Text as="h1">{t(address.concat('customizable product'))}</Text>
               <Text as="subtitle">
                  <Trans i18nKey={address.concat('subtitle 3')}>
                     Customizable product has recipe options with one recipe as
                     default
                  </Trans>
               </Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => createProduct('combo')}>
               <Text as="h1">{t(address.concat('combo product'))}</Text>
               <Text as="subtitle">
                  <Trans i18nKey={address.concat('subtitle 4')}>
                     Advanced product is an item with your recipes, sold as Meal
                     Kits as well as Ready to Eat
                  </Trans>
               </Text>
            </SolidTile>
         </TunnelBody>
      </>
   )
}
