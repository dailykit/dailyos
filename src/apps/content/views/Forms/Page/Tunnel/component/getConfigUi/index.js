import React from 'react'
import _ from 'lodash'
import { ColorPicker, Text, Toggle } from '../uiComponent'

export const getConfigUi = ({ key, configJson, onConfigChange }) => {
   const field = _.get(configJson, key)
   let configUi
   if (field.dataType === 'boolean' && field.userInsertType === 'toggle') {
      configUi = (
         <Toggle
            fieldDetail={field}
            path={key}
            onConfigChange={(name, value) => onConfigChange(name, value)}
         />
      )
   } else if (
      field.dataType === 'color' &&
      field.userInsertType === 'colorPicker'
   ) {
      configUi = (
         <ColorPicker
            fieldDetail={field}
            path={key}
            onConfigChange={onConfigChange}
         />
      )
   } else if (
      field.dataType === 'string' &&
      field.userInsertType === 'string'
   ) {
      configUi = (
         <Text fieldDetail={field} path={key} onConfigChange={onConfigChange} />
      )
   }
   return configUi
}
