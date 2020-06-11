import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { ButtonTile, Input, Text, TextButton } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { CloseIcon } from '../../../../../../assets/icons'
import { ComboProductContext } from '../../../../../../context/product/comboProduct'
// graphql
import { CREATE_COMBO_PRODUCT_COMPONENT } from '../../../../../../graphql'
import { StyledRow, TunnelBody, TunnelHeader } from '../styled'

const address =
   'apps.online_store.views.forms.product.comboproduct.tunnels.itemstunnel.'

export default function ItemTunnel({ state, close }) {
   const { t } = useTranslation()
   const { productState, productDispatch } = React.useContext(
      ComboProductContext
   )

   const [busy, setBusy] = React.useState(false)

   const [labels, setLabels] = React.useState([''])

   // Mutation
   const [createComboProductComponent] = useMutation(
      CREATE_COMBO_PRODUCT_COMPONENT,
      {
         onCompleted: data => {
            close(2)
            toast.success(t(address.concat('items added!')))
         },
         onError: error => {
            console.log(error)
            setBusy(false)
         },
      }
   )

   // Handlers
   const save = () => {
      try {
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
         if (!objects.length) {
            throw Error(t(address.concat('no labels added!')))
         }
         createComboProductComponent({
            variables: {
               objects,
            },
         })
      } catch (e) {
         toast.error(e.message)
         setBusy(false)
      }
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
               <span onClick={() => close(2)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <Text as="title">{t(address.concat('add items'))}</Text>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {busy
                     ? t(address.concat('saving'))
                     : t(address.concat('save'))}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <Text as="h2">
               {t(address.concat('label your items to add recipes for'))}
            </Text>
            {labels.map((label, i) => (
               <StyledRow>
                  <Input
                     type="text"
                     placeholder={t(address.concat('enter'))}
                     name={`label-${i}`}
                     value={label}
                     onChange={e => updatedLabel(i, e.target.value)}
                  />
               </StyledRow>
            ))}
            <ButtonTile
               type="secondary"
               text={t(address.concat('add another item'))}
               onClick={() => setLabels([...labels, ''])}
            />
         </TunnelBody>
      </React.Fragment>
   )
}
