import React from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'
import { TunnelHeader, Form, Spacer, ButtonTile, Flex } from '@dailykit/ui'

import { MASTER } from '../../../../../../graphql'
import { logger } from '../../../../../../../../shared/utils'
import { Tooltip } from '../../../../../../../../shared/components'

const address = 'apps.settings.views.forms.processings.tunnels.addnew.'

const AddTypesTunnel = ({ closeTunnel }) => {
   const { t } = useTranslation()

   const [busy, setBusy] = React.useState(false)
   const [types, setTypes] = React.useState([''])

   // Mutation
   const [addType] = useMutation(MASTER.PROCESSINGS.CREATE, {
      onCompleted: () => {
         toast.success('Processings added.')
         closeTunnel(1)
      },
      onError: error => {
         toast.error('Failed to add processing!')
         logger(error)
         setBusy(false)
      },
   })

   // Handlers
   const onChange = (e, i) => {
      const updatedTypes = types
      const value = e.target.value.trim()
      if (Boolean(value)) {
         updatedTypes[i] = value
         setTypes([...updatedTypes])
      }
   }
   const add = () => {
      try {
         if (busy) return
         setBusy(true)
         const objects = types.filter(Boolean).map(type => ({
            name: type,
         }))
         if (!objects.length) {
            throw Error('Nothing to add!')
         }
         addType({
            variables: {
               objects,
            },
         })
      } catch (error) {
         toast.error(error.message)
         setBusy(false)
      }
   }

   return (
      <>
         <TunnelHeader
            title={t(address.concat('add new types'))}
            right={{
               action: add,
               title: busy
                  ? t(address.concat('adding'))
                  : t(address.concat('add')),
            }}
            close={() => closeTunnel(1)}
            tooltip={<Tooltip identifier="tunnel_processing_heading" />}
         />
         <Flex padding="16px">
            {types.map((type, i) => (
               <>
                  <Form.Group>
                     <Form.Label htmlFor={`type-${i}`} title={`type-${i}`}>
                        Type Name*
                     </Form.Label>
                     <Form.Text
                        value={type}
                        id={`type-${i}`}
                        name={`type-${i}`}
                        onChange={e => onChange(e, i)}
                        placeholder="Enter the type name"
                     />
                  </Form.Group>
                  <Spacer size="16px" />
               </>
            ))}
            <ButtonTile
               type="secondary"
               text="Add New Type"
               onClick={() => setTypes([...types, ''])}
            />
         </Flex>
      </>
   )
}

export default AddTypesTunnel
