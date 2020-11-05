import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Avatar,
   ButtonTile,
   Flex,
   Form,
   IconButton,
   Loader,
   Spacer,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ErrorState, Tooltip } from '../../../../../shared/components'
import { logger } from '../../../../../shared/utils'
import EditIcon from '../../../assets/icons/Edit'
import { AddressCard } from '../../../components'
import { GENERAL_ERROR_MESSAGE } from '../../../constants/errorMessages'
import { GENERAL_SUCCESS_MESSAGE } from '../../../constants/successMessages'
import { useTabs } from '../../../context'
import { SUPPLIER_SUBSCRIPTION, UPDATE_SUPPLIER } from '../../../graphql'
import { validators } from '../../../utils/validators'
import { StyledWrapper } from '../styled'
import { ImageContainer } from './styled'
import AddressTunnel from './Tunnels/AddressTunnel'
import LogoTunnel from './Tunnels/LogoTunnel'
import PersonContactTunnel from './Tunnels/PersonContactTunnel'

const address = 'apps.inventory.views.forms.supplier.'

export default function SupplierForm() {
   const { t } = useTranslation()
   const [name, setName] = useState({
      value: '',
      meta: { isTouched: false, isValid: false, errors: [] },
   })
   const [paymentTerms, setPaymentTerms] = useState('')
   const [shippingTerms, setShippingTerms] = useState('')
   const [formState, setFormState] = useState({})

   const { id } = useParams()
   const { setTabTitle } = useTabs()

   const [addressTunnel, openAddressTunnel, closeAddressTunnel] = useTunnel(1)
   const [contactTunnel, openContactTunnel, closeContactTunnel] = useTunnel(1)
   const [assetTunnel, openAssetTunnel, closeAssetTunnel] = useTunnel(1)

   const { loading: supplierLoading, error } = useSubscription(
      SUPPLIER_SUBSCRIPTION,
      {
         variables: {
            id,
         },
         onSubscriptionData: input => {
            const data = input.subscriptionData.data.supplier
            const { isValid, errors } = validators.name(
               data.name,
               'supplier name'
            )

            setName({
               value: data.name,
               meta: { ...name.meta, isValid, errors },
            })

            setFormState(data)

            setShippingTerms(data.shippingTerms || '')
            setPaymentTerms(data.paymentTerms || '')
         },
      }
   )

   const [updateSupplier] = useMutation(UPDATE_SUPPLIER, {
      onCompleted: () => {
         toast.info(GENERAL_SUCCESS_MESSAGE)
      },
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
      },
   })

   const handleUpdateSupplier = () => {
      updateSupplier({
         variables: {
            id: formState.id,
            object: {
               paymentTerms: paymentTerms.trim(),
               shippingTerms: shippingTerms.trim(),
            },
         },
      })
   }

   if (error) {
      logger(error)
      return <ErrorState />
   }

   if (supplierLoading) return <Loader />

   return (
      <>
         <Tunnels tunnels={addressTunnel}>
            <Tunnel size="sm" layer={1}>
               <AddressTunnel
                  close={closeAddressTunnel}
                  formState={formState}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={contactTunnel}>
            <Tunnel layer={1}>
               <PersonContactTunnel
                  close={closeContactTunnel}
                  formState={formState}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={assetTunnel}>
            <Tunnel layer={1}>
               <LogoTunnel close={closeAssetTunnel} formState={formState} />
            </Tunnel>
         </Tunnels>

         <StyledWrapper>
            <Flex
               container
               alignItems="center"
               justifyContent="space-between"
               padding="16px 0"
            >
               <Form.Group>
                  <Form.Label htmlFor="supplierName" title="Supplier Name">
                     <Flex container alignItems="center">
                        Supplier Name
                        <Tooltip identifier="suppliers_listings_supplier_name" />
                     </Flex>
                  </Form.Label>

                  <Form.Text
                     id="supplierName"
                     name="supplierName"
                     value={name.value}
                     hasError={!name.meta.isValid}
                     onChange={e =>
                        setName({
                           value: e.target.value,
                           meta: { ...name.meta },
                        })
                     }
                     onBlur={e => {
                        const { isValid, errors } = validators.name(
                           e.target.value
                        )

                        setName({
                           value: e.target.value,
                           meta: { isValid, errors, isTouched: true },
                        })

                        if (isValid) {
                           setTabTitle(e.target.value)
                           updateSupplier({
                              variables: {
                                 id: formState.id,
                                 object: { name: e.target.value },
                              },
                           })
                        }
                     }}
                  />
                  {name.meta.isTouched && !name.meta.isValid && (
                     <Form.Error>{name.meta.errors[0]}</Form.Error>
                  )}
               </Form.Group>

               <Flex width="110px">
                  <ShowAvailability formState={formState} />
               </Flex>
            </Flex>
            {formState.logo ? (
               <ImageContainer>
                  <div>
                     <span
                        role="button"
                        tabIndex="0"
                        onClick={() => openAssetTunnel(1)}
                        onKeyDown={e => e.charCode === 13 && openAssetTunnel(1)}
                     >
                        <EditIcon />
                     </span>
                  </div>
                  <img src={formState.logo} alt="supplier logo" />
               </ImageContainer>
            ) : (
               <ButtonTile
                  onClick={() => openAssetTunnel(1)}
                  type="primary"
                  size="lg"
                  text={t(address.concat('add logo of the supplier'))}
                  helper={t(
                     address.concat(
                        'upto 1MB - only JPGs, PNGs, and PDFs are allowed'
                     )
                  )}
               />
            )}

            <AddressView formState={formState} openTunnel={openAddressTunnel} />

            <Flex
               container
               alignItems="center"
               margin="24px 0 0 0"
               justifyContent="space-between"
            >
               <Flex container alignItems="center">
                  <Text as="title">
                     {t(address.concat('person of contact'))}
                  </Text>
                  <Tooltip identifier="suppliers_listings_contact_person" />
               </Flex>

               {formState.contactPerson?.email ||
               formState.contactPerson?.firstName ? (
                  <>
                     <IconButton
                        onClick={() => openContactTunnel(1)}
                        type="outline"
                     >
                        <EditIcon color="#555b6e" />
                     </IconButton>
                  </>
               ) : null}
            </Flex>

            {formState.contactPerson?.firstName ? (
               <Avatar
                  withName
                  title={`${formState.contactPerson?.firstName} ${
                     formState.contactPerson?.lastName || ''
                  }`}
               />
            ) : (
               <ButtonTile
                  type="secondary"
                  text={t(address.concat('add person of contact'))}
                  onClick={() => openContactTunnel(1)}
                  style={{ margin: '20px 0' }}
               />
            )}

            <Flex container alignItems="center" margin="24px 0 0 0">
               <Text as="title">
                  {t(address.concat('terms and conditions'))}
               </Text>
               <Tooltip identifier="supplier_form_terms_and_conditions" />
            </Flex>

            <Spacer size="16px" />

            <Form.Group>
               <Form.Label htmlFor="paymentTerms" title="Payment Terms">
                  <Flex container alignItems="center">
                     {t(address.concat('payment terms'))}
                     <Tooltip identifier="supplier_form_shipping_terms_form_field" />
                  </Flex>
               </Form.Label>
               <Form.TextArea
                  name="paymentTerms"
                  value={paymentTerms}
                  onChange={e => setPaymentTerms(e.target.value)}
                  onBlur={handleUpdateSupplier}
               />
            </Form.Group>
            <Spacer size="16px" />

            <Form.Group>
               <Form.Label htmlFor="shippingTerms" title="shippingTerms">
                  <Flex container alignItems="center">
                     {t(address.concat('shipping terms'))}
                     <Tooltip identifier="supplier_form_shipping_terms_form_field" />
                  </Flex>
               </Form.Label>
               <Form.TextArea
                  type="textarea"
                  name="shippingTerms"
                  value={shippingTerms}
                  onChange={e => setShippingTerms(e.target.value)}
                  onBlur={handleUpdateSupplier}
               />
            </Form.Group>
         </StyledWrapper>
      </>
   )
}

function ShowAvailability({ formState }) {
   const [updateSupplier] = useMutation(UPDATE_SUPPLIER, {
      onCompleted: () => {
         toast.success('Updated availability!')
      },
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
      },
   })

   return (
      <Form.Group>
         <Form.Toggle
            value={formState.available}
            onChange={() => {
               updateSupplier({
                  variables: {
                     id: formState.id,
                     object: { available: !formState.available },
                  },
               })
            }}
         >
            {formState.available ? 'Available' : 'Unavailable'}
         </Form.Toggle>
      </Form.Group>
   )
}

function AddressView({ formState, openTunnel }) {
   const { t } = useTranslation()

   const check =
      formState.address?.location ||
      formState.address?.address1 ||
      formState.address?.address2 ||
      formState.address?.city

   return (
      <>
         <Flex
            container
            margin="24px 0 0 0"
            alignItems="center"
            justifyContent="space-between"
         >
            <Flex container alignItems="center">
               <Text as="title">{t(address.concat('address'))}</Text>
               <Tooltip identifier="supplier_form_address_section" />
            </Flex>
            {check && (
               <>
                  <IconButton onClick={() => openTunnel(1)} type="outline">
                     <EditIcon color="#555b6e" />
                  </IconButton>
               </>
            )}
         </Flex>

         {check ? (
            <AddressCard
               address={
                  formState.address.location ||
                  `${formState.address.address1}, ${formState.address.address2}`
               }
               zip={formState.address?.zip}
               city={formState.address?.city}
            />
         ) : (
            <ButtonTile
               type="secondary"
               text={t(address.concat('add address'))}
               onClick={() => openTunnel(1)}
               style={{ margin: '20px 0' }}
            />
         )}
      </>
   )
}
