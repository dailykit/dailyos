import React from 'react'

// State
import { Context } from '../../context/tabs'

import { StyledHome, StyledCardList, StyledCard } from './styled'

import { useTranslation } from 'react-i18next'

const address = 'apps.online_store.views.home.'

const Home = () => {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)
   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'listings', title, view } })
   }
   return (
      <StyledHome>
         <h1>{t(address.concat('seller app'))}</h1>
         <StyledCardList>
            <StyledCard onClick={() => addTab('Products', 'products')}>
               <h2>{t(address.concat('products'))}</h2>
               <p>{t(address.concat('10 created so far'))}</p>
               <span data-type="status">{t(address.concat('all active'))}</span>
               <span data-type="link">{t(address.concat('go to products'))} ></span>
            </StyledCard>
            <StyledCard onClick={() => addTab('Collections', 'collections')}>
               <h2>{t(address.concat('collections'))}</h2>
               <p>{t(address.concat('4 created so far'))}</p>
               <span data-type="status">{t(address.concat('all available'))}</span>
               <span data-type="link">{t(address.concat('go to collections'))} ></span>
            </StyledCard>
         </StyledCardList>
      </StyledHome>
   )
}

export default Home
