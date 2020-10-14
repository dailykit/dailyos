import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   ButtonTile,
   Flex,
   IconButton,
   Input,
   Loader,
   Text,
   Toggle,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui/'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import EditIcon from '../../../assets/icons/Edit'
import { AddressCard, ContactCard } from '../../../components'
import { useTabs } from '../../../context'
import { SUPPLIER_SUBSCRIPTION, UPDATE_SUPPLIER } from '../../../graphql'
import { StyledHeader } from '../../Listings/styled'
import { FlexContainer, StyledWrapper } from '../styled'
import { ImageContainer } from './styled'
import AddressTunnel from './Tunnels/AddressTunnel'
import LogoTunnel from './Tunnels/LogoTunnel'
import PersonContactTunnel from './Tunnels/PersonContactTunnel'

const address = 'apps.inventory.views.forms.supplier.'

export default function SupplierForm() {
   const { t } = useTranslation()
   const [name, setName] = useState('')
   const [paymentTerms, setPaymentTerms] = useState('')
   const [shippingTerms, setShippingTerms] = useState('')
   const [formState, setFormState] = useState({})
   const { id } = useParams()
   const { setTabTitle } = useTabs()

   const [addressTunnel, openAddressTunnel, closeAddressTunnel] = useTunnel(1)
   const [contactTunnel, openContactTunnel, closeContactTunnel] = useTunnel(1)
   const [assetTunnel, openAssetTunnel, closeAssetTunnel] = useTunnel(1)

   const { loading: supplierLoading } = useSubscription(SUPPLIER_SUBSCRIPTION, {
      variables: {
         id,
      },
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.supplier
         setName(data.name)
         setFormState(data)

         setShippingTerms(data.shippingTerms || '')
         setPaymentTerms(data.paymentTerms || '')
      },
   })
   const [updateSupplier] = useMutation(UPDATE_SUPPLIER, {
      onCompleted: () => {
         toast.info('Information updated!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error! Please try again')
      },
   })

   const handleUpdateSupplier = () => {
      setTabTitle(name)
      updateSupplier({
         variables: {
            id: formState.id,
            object: {
               name,
               paymentTerms,
               shippingTerms,
            },
         },
      })
   }

   if (supplierLoading) return <Loader />

   return (
      <>
         <Tunnels tunnels={addressTunnel}>
            <Tunnel size="lg" layer={1}>
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
            <StyledHeader>
               <div>
                  <Input
                     label="Supplier Name"
                     type="text"
                     name="supplierName"
                     value={name}
                     onChange={e => setName(e.target.value)}
                     onBlur={handleUpdateSupplier}
                  />
               </div>

               <div style={{ width: '110px' }}>
                  <FlexContainer>
                     <>
                        <ShowAvailability formState={formState} />
                        <span style={{ width: '20px' }} />
                     </>
                  </FlexContainer>
               </div>
            </StyledHeader>
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

            <Flex container alignItems="center" margin="24px 0 0 0">
               <Text as="title">{t(address.concat('person of contact'))}</Text>

               {formState.contactPerson?.email ||
               formState.contactPerson?.firstName ? (
                  <>
                     <span style={{ width: '8px' }} />
                     <IconButton
                        onClick={() => openContactTunnel(1)}
                        type="ghost"
                     >
                        <EditIcon color="#555b6e" />
                     </IconButton>
                  </>
               ) : null}
            </Flex>

            {formState.contactPerson?.firstName &&
            formState.contactPerson?.email ? (
               <ContactCard
                  name={`${formState.contactPerson?.firstName} ${formState.contactPerson?.lastName}`}
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
            </Flex>

            <br />

            <Input
               type="textarea"
               label={t(address.concat('payment terms'))}
               name="paymentTerms"
               rows="4"
               value={paymentTerms}
               onChange={e => setPaymentTerms(e.target.value)}
               onBlur={handleUpdateSupplier}
            />
            <br />

            <Input
               type="textarea"
               label={t(address.concat('shipping terms'))}
               name="shippingTerms"
               rows="4"
               value={shippingTerms}
               onChange={e => setShippingTerms(e.target.value)}
               onBlur={handleUpdateSupplier}
            />
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
         console.log(error)
         toast.error('Error! Please try again')
      },
   })

   return (
      <Toggle
         checked={formState.available}
         label={formState.available ? 'Available' : 'Unavailable'}
         setChecked={() => {
            updateSupplier({
               variables: {
                  id: formState.id,
                  object: { available: !formState.available },
               },
            })
         }}
      />
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
         <Flex container margin="24px 0 0 0" alignItems="center">
            <Text as="title">{t(address.concat('address'))}</Text>
            {check && (
               <>
                  <span style={{ width: '8px' }} />
                  <IconButton onClick={() => openTunnel(1)} type="ghost">
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
