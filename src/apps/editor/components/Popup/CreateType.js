import React from 'react'
import { Flex, Spacer } from '@dailykit/ui'
import { CreateFolder, CreateFile, CloseIcon } from '../../assets/Icons'
import { Popup } from '../../../../shared/components'
import { Cross, Type } from './style'

export default function CreateType({ show, closePopup, setCreateType }) {
   return (
      <Popup
         show={show}
         size="360px"
         style={{ position: 'absolute', top: '40px', left: '6px' }}
      >
         <Flex container alignItems="start" justifyContent="space-between">
            <Popup.Text>Create</Popup.Text>
            <Cross onClick={() => closePopup()}>{CloseIcon}</Cross>
         </Flex>
         <Flex container justifyContent="space-between" flexDirection="column">
            <Type onClick={() => setCreateType('folder')}>
               <CreateFolder size="24" />
               <p>New Folder</p>
            </Type>
            <Type onClick={() => setCreateType('file')}>
               <CreateFile size="24" />
               <p>New File</p>
            </Type>
            <Spacer size="16px" />
         </Flex>
      </Popup>
   )
}
