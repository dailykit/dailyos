import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'

// Components
import { TunnelHeader, Input, ButtonTile } from '@dailykit/ui'

// Styles
import { TunnelBody } from '../styled'

import { CREATE_CUISINES } from '../../../../../../graphql'

const address = 'apps.settings.views.forms.cuisines.tunnels.addnew.'

const AddTypesTunnel = ({ closeTunnel }) => {
   const { t } = useTranslation()

   const [busy, setBusy] = React.useState(false)
   const [types, setTypes] = React.useState([''])

   // Mutation
   const [addType] = useMutation(CREATE_CUISINES, {
      onCompleted: () => {
         toast.success('Cuisines added.')
         closeTunnel(1)
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
         setBusy(false)
      },
   })

   // Handlers
   const handleChange = (e, i) => {
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
         const objects = types.map(type => ({
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
         />
         <TunnelBody>
            {types.map((type, i) => (
               <Input
                  type="text"
                  name={`type-${i}`}
                  style={{ width: '320px', marginBottom: '32px' }}
                  value={type}
                  onChange={e => handleChange(e, i)}
                  placeholder={t(address.concat('enter a type name'))}
               />
            ))}
            <ButtonTile
               type="secondary"
               text="Add New Type"
               onClick={() => setTypes([...types, ''])}
            />
         </TunnelBody>
      </>
   )
}

export default AddTypesTunnel
