import React from 'react'
import { Flex, Spacer } from '@dailykit/ui'
import { Popup } from '../../../../shared/components'
import { Javascript, Html, Css, Pug, CloseIcon } from '../../assets/Icons'
import { useGlobalContext } from '../../context'
import { Card, Cross } from './style'

export default function FileType({ show, closePopup, setFileType }) {
   return (
      <Popup show={show}>
         <Flex container alignItems="start" justifyContent="space-between">
            <Popup.Text>Select the file type</Popup.Text>
            <Cross onClick={closePopup}>{CloseIcon}</Cross>
         </Flex>
         <Flex container alignItems="center" justifyContent="space-between">
            <Spacer size="16px" />
            <Card onClick={() => setFileType('js')}>
               <Javascript />
               <p>Javascript</p>
            </Card>
            <Spacer size="16px" />
            <Card onClick={() => setFileType('html')}>
               <Html />
               <p>Html</p>
            </Card>
            <Spacer size="16px" />
            <Card onClick={() => setFileType('css')}>
               <Css />
               <p>Css</p>
            </Card>
            <Spacer size="16px" />
            <Card onClick={() => setFileType('pug')}>
               <Pug />
               <p>Pug</p>
            </Card>
            <Spacer size="16px" />
         </Flex>
      </Popup>
   )
}
