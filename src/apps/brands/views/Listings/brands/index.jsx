import React from 'react'

import { useTabs } from '../../../context'

export const Brands = () => {
   const { tab, addTab } = useTabs()

   React.useEffect(() => {
      if (!tab) {
         addTab('Brands', '/brands/brands')
      }
   }, [tab, addTab])

   return <div>brands</div>
}
