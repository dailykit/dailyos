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
   const { tabs, addTab } = useTabs()

   React.useEffect(() => {
      const tab = tabs.find(item => item.path === `/subscription/menu`) || {}
      if (!Object.prototype.hasOwnProperty.call(tab, 'path')) {
         addTab('Menu', '/subscription/menu')
      }
   }, [history, tabs])

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
