import React from 'react'
import { Text, IconButton } from '@dailykit/ui'

import { Content, Flexible, RecipeButton } from './styled'

import { ProductContext } from '../../../context/product/index'
import RecipeConfigurator from './RecipeConfigurator'
import AddIcon from '../../../assets/icons/Add'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.'

export default function Item({ open }) {
   const { t } = useTranslation()
   const {
      productState: { itemView, currentRecipe },
      productDispatch,
   } = React.useContext(ProductContext)
   return (
      <Content>
         <Flexible width="1">
            <Content
               style={{ alignItems: 'center', justifyContent: 'space-between' }}
            >
               <Text as="title">{t(address.concat('recipes for'))} {itemView.label}</Text>
               <IconButton type="ghost" onClick={() => open(2)}>
                  <AddIcon />
               </IconButton>
            </Content>
            <hr style={{ border: '1px solid #dddddd' }} />
            <br />

            {itemView.recipes?.map((recipe, index) => (
               <RecipeButton
                  key={recipe.recipe}
                  active={recipe.recipe === currentRecipe.recipe}
                  onClick={() =>
                     productDispatch({
                        type: 'SET_CURRENT_RECIPE',
                        payload: recipe,
                     })
                  }
               >
                  <img src={recipe.img} alt={recipe.title} />
                  <h4 style={{ marginLeft: '10px' }}>{recipe.title}</h4>
               </RecipeButton>
            ))}
         </Flexible>
         <Flexible width="3">
            <RecipeConfigurator open={open} />
         </Flexible>
      </Content>
   )
}
