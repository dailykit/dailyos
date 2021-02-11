import React from 'react'

import Tabs from '../Tabs'
import Styles from './styled'
import { MenuIcon } from '../../assets/icons'

export const TabBar = ({ toggle }) => {
   return (
      <Styles.Header>
         <Styles.Menu
            title="Menu"
            type="button"
            onClick={() => toggle(open => !open)}
         >
            <MenuIcon color="#000" size="24" />
         </Styles.Menu>
         <Tabs />
      </Styles.Header>
   )
}
