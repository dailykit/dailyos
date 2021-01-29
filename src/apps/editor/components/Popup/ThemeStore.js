import React from 'react'
import { Flex, Spacer, ComboButton } from '@dailykit/ui'
import { EditIcon, CloseIcon } from '../../assets/Icons'
import { Popup } from '../../../../shared/components'
import { Cross, PhotoGrid } from './style'

export default function ThemeStore({ show, closePopup, setCreateType }) {
   return (
      <Popup show={show} size="1200px">
         <Flex container alignItems="start" justifyContent="space-between">
            <Popup.Text>Choose a Template</Popup.Text>
            <Cross onClick={() => closePopup()}>{CloseIcon}</Cross>
         </Flex>
         <PhotoGrid>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
               <div className="theme">
                  <img
                     key={item}
                     src="https://dailykit-133-test.s3.amazonaws.com/images/18965-image (5).png"
                     alt="template"
                  />
                  <Spacer size="4px" />
                  <ComboButton type="solid" size="sm">
                     <EditIcon size="20" color="#fff" /> Edit
                  </ComboButton>
               </div>
            ))}
         </PhotoGrid>
      </Popup>
   )
}
