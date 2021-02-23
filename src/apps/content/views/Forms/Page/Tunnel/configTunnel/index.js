import React from 'react'
import _ from 'lodash'
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import {
   TunnelHeader,
   Tunnel,
   Tunnels,
   Dropdown,
   Form,
   Flex,
   Spacer,
} from '@dailykit/ui'
// import { GET_FILES, LINK_CSS_FILES } from '../../../graphql'
import { TunnelBody } from './style'
import BrandContext from '../../../../../context/Brand'
import { getFile } from '../../../../../utils'

export default function PagePreviewTunnel({
   tunnels,
   openTunnel,
   closeTunnel,
   onSave,
   selectedOption,
}) {
   const [context, setContext] = React.useContext(BrandContext)
   const [configJson, setConfigJson] = React.useState({})
   const uiArray = []
   console.log(configJson)
   const onConfigChange = e => {
      console.log(`${e.target.name}.value = `, e.target.value)
      const updatedValue = _.update(
         configJson,
         `${e.target.name}.value`,
         () => {
            return e.target.value
         }
      )
      setConfigJson(updatedValue)
   }

   const getHeaderUi = title => {
      return <h1 style={{ marginLeft: '4px' }}>{title.toUpperCase()}</h1>
   }

   const getConfigUi = key => {
      const field = _.get(configJson, key)
      let configUi
      if (field.dataType === 'boolean' && field.userInsertType === 'toggle') {
         configUi = (
            <Toggle
               fieldDetail={field}
               path={key}
               onConfigChange={onConfigChange}
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
            <Text
               fieldDetail={field}
               path={key}
               onConfigChange={onConfigChange}
            />
         )
      }
      return configUi
   }

   const showConfigUi = (configData, rootKey) => {
      _.forOwn(configData, (value, key) => {
         const isFieldObject = _.has(value, 'value')
         if (isFieldObject) {
            const updatedRootkey = rootKey ? `${rootKey}.${key}` : key
            uiArray.push(getConfigUi(updatedRootkey))
         } else {
            uiArray.push(getHeaderUi(key))
            const updatedRootkey = rootKey ? `${rootKey}.${key}` : key
            showConfigUi(value, updatedRootkey)
         }
      })
      return uiArray
   }

   React.useEffect(() => {
      const fetchFile = async () => {
         selectedOption.forEach(async file => {
            const filePath = file.value
               .replace('components', 'components/config')
               .replace('ejs', 'json')
            const response = await getFile(filePath)
            if (response.status === 200) {
               const configData = response.data
               setConfigJson(configData)
            }
         })
      }
      if (selectedOption.length) {
         fetchFile()
      }
   }, [selectedOption])

   return (
      <div>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="full">
               <TunnelHeader
                  title="Config Details"
                  close={() => closeTunnel(1)}
                  right={{
                     title: 'Save',
                     action: () => onSave(),
                  }}
               />
               <TunnelBody>
                  <div>
                     {Object.keys(configJson).length > 0 &&
                        showConfigUi(configJson, '')?.map(config => {
                           return (
                              <>
                                 {config}
                                 <Spacer size="16px" />
                              </>
                           )
                        })}
                  </div>
               </TunnelBody>
            </Tunnel>
         </Tunnels>
      </div>
   )
}

const ColorPicker = ({ fieldDetail, onConfigChange }) => (
   <Flex
      container
      justifyContent="space-between"
      alignItems="center"
      margin="0 0 0 4px"
   >
      <Form.Label htmlfor="color">{fieldDetail.label.toUpperCase()}</Form.Label>
      <input
         type="color"
         id="favcolor"
         name="favcolor"
         value={fieldDetail.default || '#555b63'}
         onChange={onConfigChange}
      />
   </Flex>
)

const Toggle = ({ fieldDetail, onConfigChange }) => (
   <Flex
      container
      justifyContent="space-between"
      alignItems="center"
      margin="0 0 0 4px"
   >
      <Form.Label htmlfor="toggle">
         {fieldDetail.label.toUpperCase()}
      </Form.Label>
      <Form.Toggle
         name="toggle"
         onChange={onConfigChange}
         value={fieldDetail.default || false}
      />
   </Flex>
)

const Text = ({ fieldDetail, onConfigChange }) => (
   <Flex
      container
      justifyContent="space-between"
      alignItems="center"
      margin="0 0 0 4px"
   >
      <Form.Label htmlfor="text">{fieldDetail.label.toUpperCase()}</Form.Label>
      <Form.Text
         name="toggle"
         onChange={onConfigChange}
         value={fieldDetail.default || false}
      />
   </Flex>
)
