import React from 'react'
import { useTranslation } from 'react-i18next'

// State
import { useTabs } from '../../context'

// Styled
import {
   StyledSidebar,
   StyledList,
   StyledListItem,
   StyledHeading,
} from './styled'

const address = 'apps.recipe.sections.sidebar.'

const Sidebar = ({ visible, toggleSidebar }) => {
   const { t } = useTranslation()
   const { addTab } = useTabs()
   const addTabHandler = (title, path) => {
      toggleSidebar(visible => !visible)
      addTab(title, path)
   }
   return (
      <StyledSidebar visible={visible}>
         <StyledHeading>{t(address.concat('listings'))}</StyledHeading>
         <StyledList>
            <StyledListItem
               onClick={() => addTabHandler('Products', '/recipe/products')}
            >
               {t(address.concat('products'))}
            </StyledListItem>
            <StyledListItem
               onClick={() => addTabHandler('Recipes', '/recipe/recipes')}
            >
               {t(address.concat('recipes'))}
            </StyledListItem>
            <StyledListItem
               onClick={() =>
                  addTabHandler('Ingredients', '/recipe/ingredients')
               }
            >
               {t(address.concat('ingredients'))}
            </StyledListItem>
         </StyledList>
      </StyledSidebar>
   )
}

export default Sidebar
