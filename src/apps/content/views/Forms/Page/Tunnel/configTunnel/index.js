import React from 'react'
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { TunnelHeader, Tunnel, Tunnels, Dropdown, Form } from '@dailykit/ui'
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

   const onConfigChange = e => {
      console.log(e.target.value)
   }

   const getConfigUi = () => {
      console.log('after setting config', configJson)
      // const parsedConfig = JSON.parse(configJson)
      // const configArray = Object.keys(parsedConfig).map(key => {
      //    return {
      //       key: parsedConfig[key],
      //    }
      // })
      // console.log(configArray)
   }

   React.useEffect(() => {
      const fetchFile = async () => {
         selectedOption.forEach(async file => {
            const filePath = file.value
               .replace('components', 'components/config')
               .replace('ejs', 'json')
            const response = await getFile(filePath)
            if (response.status === 200) {
               const configData = JSON.stringify(response.data)
               console.log(configData)
               setConfigJson('before setting', configData)
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
                  title="Preview Page"
                  close={() => closeTunnel(1)}
                  right={{
                     title: 'Save',
                     action: () => onSave(),
                  }}
               />
               <TunnelBody>
                  <h1>hello</h1>
                  {getConfigUi()}
               </TunnelBody>
            </Tunnel>
         </Tunnels>
      </div>
   )
}

const ColorPicker = ({ label, defaultValue, onConfigChange }) => {
   return (
      <Form.Group>
         <Form.Label htmlfor="color">{label.toUpperCase()}</Form.Label>
         <input
            type="color"
            id="favcolor"
            name="favcolor"
            value={defaultValue || '#555b63'}
            onChange={onConfigChange}
         />
      </Form.Group>
   )
}

const Toggle = ({ label, defaultValue, onConfigChange }) => {
   return (
      <Form.Group>
         <Form.Label htmlfor="toggle">{label.toUpperCase()}</Form.Label>
         <Form.Toggle
            name="toggle"
            onChange={onConfigChange}
            value={defaultValue || false}
         />
      </Form.Group>
   )
}

const Text = ({ label, defaultValue, onConfigChange }) => {
   return (
      <Form.Group>
         <Form.Label htmlfor="text">{label.toUpperCase()}</Form.Label>
         <Form.Text
            name="toggle"
            onChange={onConfigChange}
            value={defaultValue || false}
         />
      </Form.Group>
   )
}
