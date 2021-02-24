import React from 'react'
import { Form, Loader, Flex, Spacer } from '@dailykit/ui'
export const Text = ({ fieldDetail, path, onConfigChange }) => (
   <Flex
      container
      justifyContent="space-between"
      alignItems="center"
      margin="0 0 0 4px"
   >
      <Form.Label title={fieldDetail.label} htmlFor="text">
         {fieldDetail.label.toUpperCase()}
      </Form.Label>
      <Form.Text
         id={path}
         name={path}
         onChange={onConfigChange}
         value={fieldDetail.value}
         placeholder="Enter the orientation"
      />
   </Flex>
)

export const Toggle = ({ fieldDetail, path, onConfigChange }) => (
   <Flex
      container
      justifyContent="space-between"
      alignItems="center"
      margin="0 0 0 4px"
   >
      <Form.Label title={fieldDetail.label} htmlFor="toggle">
         {fieldDetail.label.toUpperCase()}
      </Form.Label>
      <Form.Toggle
         name={path}
         onChange={e => onConfigChange(e, !fieldDetail.value)}
         value={fieldDetail.value}
         children={fieldDetail.value ? 'ON' : 'OFF'}
      />
   </Flex>
)

export const ColorPicker = ({ fieldDetail, path, onConfigChange }) => (
   <Flex
      container
      justifyContent="space-between"
      alignItems="center"
      margin="0 0 0 4px"
   >
      <Form.Label title={fieldDetail.label} htmlFor="color">
         {fieldDetail.label.toUpperCase()}
      </Form.Label>
      <input
         type="color"
         id="favcolor"
         name={path}
         value={fieldDetail.value}
         onChange={onConfigChange}
      />
   </Flex>
)
