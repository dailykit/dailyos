import React from 'react'

import { TextButton, Input, Text, ButtonTile } from '@dailykit/ui'

import { CloseIcon } from '../../../../../../assets/icons'
import { TunnelHeader, TunnelBody, StyledRow } from '../styled'
import { ComboProductContext } from '../../../../../../context/product/comboProduct'
import { useMutation } from '@apollo/react-hooks'

// graphql
import { CREATE_COMBO_PRODUCT_COMPONENT } from '../../../../../../graphql'
import { toast } from 'react-toastify'

export default function ItemTunnel({ close }) {
   const { state, dispatch } = React.useContext(ComboProductContext)

   const [busy, setBusy] = React.useState(false)

   const [labels, setLabels] = React.useState([''])

   // Mutation
   const [createComboProductComponent] = useMutation(
      CREATE_COMBO_PRODUCT_COMPONENT,
      {
         onCompleted: data => {
            dispatch({
               type: 'COMPONENTS',
               payload: {
                  components: data.createComboProductComponent.returning,
               },
            })
            close(2)
            toast.success('Items added!')
         },
         onError: error => {
            console.log(error)
            setBusy(false)
         },
      }
   )

   // Handlers
   const save = () => {
      if (busy) return
      setBusy(true)
      const objects = labels
         .filter(label => label.length)
         .map(label => {
            return {
               comboProductId: state.id,
               label,
            }
         })
      createComboProductComponent({
         variables: {
            objects,
         },
      })
   }

   const updatedLabel = (index, value) => {
      const updatedLabels = labels
      updatedLabels[index] = value
      setLabels([...updatedLabels])
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(1)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <span>Add Items</span>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {busy ? 'Saving...' : 'Save'}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <Text as="h2">Label your items to add recipes for</Text>
            {labels.map((label, i) => (
               <StyledRow>
                  <Input
                     type="text"
                     placeholder="enter"
                     name={`label-${i}`}
                     value={label}
                     onChange={e => updatedLabel(i, e.target.value)}
                  />
               </StyledRow>
            ))}
            <ButtonTile
               type="secondary"
               text="Add another item"
               onClick={() => setLabels([...labels, ''])}
            />
         </TunnelBody>
      </React.Fragment>
   )
}
