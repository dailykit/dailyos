import React from 'react'
import { useHistory } from 'react-router-dom'

import 'react-datepicker/dist/react-datepicker.css'

import { Wrapper } from './styled'
import { MenuProvider } from './state'
import DateSection from './DateSection'
import PlansSection from './PlansSection'
import ProductsSection from './ProductsSection'
import { useTabs } from '../../../context'

export const Menu = () => {
   const history = useHistory()
   const { tab, addTab } = useTabs()

   React.useEffect(() => {
      if (!tab) {
         addTab('Menu', '/subscription/menu')
      }
   }, [history, tab, addTab])

   return (
      <MenuProvider>
         <Wrapper>
            <div>
               <DateSection />
               <PlansSection />
               <ProductsSection />
            </div>
         </Wrapper>
      </MenuProvider>
   )
}
