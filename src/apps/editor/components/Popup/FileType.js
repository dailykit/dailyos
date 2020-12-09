import React from 'react'
import { Flex, Popup, Spacer } from '@dailykit/ui'
import { Javascript, Html, Css, Pug, CloseIcon } from '../../assets/Icons'
import { Card, Cross } from './style'

export default function FileType({ showPopup, setShowPopup, selectFileType }) {
   return (
      <Popup show={showPopup}>
         <Flex container alignItems="start" justifyContent="space-between">
            <Popup.Text>Select the file type</Popup.Text>
            <Cross onClick={setShowPopup}>{CloseIcon}</Cross>
         </Flex>
         <Flex container alignItems="center" justifyContent="space-between">
            <Spacer size="16px" />
            <Card onClick={() => selectFileType('js')}>
               <Javascript />
               <p>Javascript</p>
            </Card>
            <Spacer size="16px" />
            <Card onClick={() => selectFileType('html')}>
               <Html />
               <p>Html</p>
            </Card>
            <Spacer size="16px" />
            <Card onClick={() => selectFileType('css')}>
               <Css />
               <p>Css</p>
            </Card>
            <Spacer size="16px" />
            <Card onClick={() => selectFileType('pug')}>
               <Pug />
               <p>Pug</p>
            </Card>
            <Spacer size="16px" />
         </Flex>
      </Popup>
   )
}
