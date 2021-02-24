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
import ConfigContext from '../../../../../context/Config'
import { getFile } from '../../../../../utils'
import { getConfigUi } from '../component'
export default function ConfigTunnel({
   tunnels,
   openTunnel,
   closeTunnel,
   onSave,
   selectedOption,
}) {
   const [configContext, setConfigContext] = React.useContext(ConfigContext)
   const [configJson, setConfigJson] = React.useState({})
   const [fields, setFields] = React.useState([])
   let elements = []
   console.log('oldConfig', configContext)

   const onConfigChange = (e, value) => {
      let updatedConfig
      const type = _.get(configJson, `${e.target.name}.dataType`)
      if (type === 'boolean') {
         updatedConfig = _.set(configJson, `${e.target.name}.value`, value)
      } else {
         updatedConfig = _.set(
            configJson,
            `${e.target.name}.value`,
            e.target.value
         )
      }

      // console.log("updateObj", updateObj, e.target.name);
      setConfigJson(prev => {
         return {
            ...prev,
            ...updatedConfig,
         }
      })
   }

   const getHeaderUi = title => {
      return <h1 style={{ marginLeft: '4px' }}>{title.toUpperCase()}</h1>
   }

   const renderAllFields = (data, rootKey) => {
      showConfigUi(data, rootKey)

      console.log('elements', elements)

      setFields([...elements])
   }

   const showConfigUi = (configData, rootKey) => {
      _.forOwn(configData, (value, key) => {
         const isFieldObject = _.has(value, 'value')
         if (isFieldObject) {
            const updatedRootkey = rootKey ? `${rootKey}.${key}` : key
            elements.push(
               getConfigUi({
                  key: updatedRootkey,
                  configJson,
                  onConfigChange,
               })
            )
         } else {
            elements.push(getHeaderUi(key))
            const updatedRootkey = rootKey ? `${rootKey}.${key}` : key
            showConfigUi(value, updatedRootkey)
         }
      })
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
      } else {
         setConfigJson(configContext)
      }
   }, [selectedOption, configContext])

   React.useEffect(() => {
      console.log('re-run...')
      if (Object.keys(configJson).length) {
         renderAllFields(configJson, '')
      }
   }, [configJson])

   return (
      <div>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="full">
               <TunnelHeader
                  title="Config Details"
                  close={() => closeTunnel(1)}
                  right={{
                     title: 'Save',
                     action: () => onSave(configJson),
                  }}
               />
               <TunnelBody>
                  <div>
                     {fields.map((config, index) => {
                        return (
                           <div key={index}>
                              {config}
                              <Spacer size="16px" />
                           </div>
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
