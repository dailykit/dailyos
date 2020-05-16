import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Input, Text, Checkbox, TextButton } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { CloseIcon } from '../../../../../assets/icons'
import { TunnelBody, TunnelHeader } from '../styled'
import { SafetyCheckContext } from '../../../../../context/check'

const CheckTunnel = ({ state, closeTunnel }) => {
   const { t } = useTranslation()
   const { checkState } = React.useContext(SafetyCheckContext)

   const [busy, setBusy] = React.useState(false)
   const [mask, setMask] = React.useState(false)
   const [sanitizer, setSanitizer] = React.useState(false)
   const [temp, setTemp] = React.useState('')

   // Handlers
   const save = () => {
      console.log(mask, sanitizer, temp)
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(2)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <Text as="title">Enter Checkup Details</Text>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {busy ? 'Saving...' : 'Save'}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody></TunnelBody>
      </React.Fragment>
   )
}

export default CheckTunnel
