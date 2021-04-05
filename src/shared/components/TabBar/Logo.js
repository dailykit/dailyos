import React from 'react'
import { DailykitIcon } from '../../assets/icons'
import { useOnClickOutside } from '../../hooks'
import { Sidebar } from '../Sidebar'
import Styles from './styled'

const Logo = () => {
   const [open, setOpen] = React.useState(false)
   const menuRef = React.useRef()
   useOnClickOutside(menuRef, () => setOpen(false))

   return (
      <div ref={menuRef}>
         {open && <Sidebar />}
         <Styles.Logo onClick={() => setOpen(!open)}>
            <DailykitIcon />
         </Styles.Logo>
      </div>
   )
}

export default Logo
