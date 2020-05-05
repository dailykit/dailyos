import React from 'react'

import {
   StyledWrapper,
   IconContainer,
   StyledList,
   StyledListItem,
} from './styled'
import { SettingsIcon } from '../../assets/icons'

const Lang = () => {
   const [lang, setLang] = React.useState('en')
   const [isVisible, setIsVisible] = React.useState(false)

   const changeLang = lang => {
      console.log(lang)
      setLang(lang)
      setIsVisible(false)
   }

   return (
      <StyledWrapper>
         <StyledList hidden={!isVisible}>
            <StyledListItem
               active={lang === 'en'}
               onClick={() => changeLang('en')}
            >
               English
            </StyledListItem>
            <StyledListItem
               active={lang === 'fr'}
               onClick={() => changeLang('fr')}
            >
               Français
            </StyledListItem>
            <StyledListItem
               active={lang === 'es'}
               onClick={() => changeLang('es')}
            >
               Español
            </StyledListItem>
            <StyledListItem
               active={lang === 'hb'}
               onClick={() => changeLang('hb')}
            >
               עברית
            </StyledListItem>
         </StyledList>
         <IconContainer onClick={() => setIsVisible(!isVisible)}>
            <SettingsIcon color="#28C1F6" size={32} />
         </IconContainer>
      </StyledWrapper>
   )
}

export default Lang
