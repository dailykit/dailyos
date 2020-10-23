import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Avatar,
   Flex,
   Form,
   IconButton,
   Loader,
   SectionTab,
   SectionTabList,
   SectionTabPanel,
   SectionTabPanels,
   SectionTabs,
   SectionTabsListHeader,
   Text,
   TextButton,
   Tunnel,
   Tunnels,
   useTunnel,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { EditIcon } from '../../../../../shared/assets/icons'
import AddIcon from '../../../../../shared/assets/icons/Add'
import { Tooltip } from '../../../../../shared/components'
import { logger } from '../../../../../shared/utils/errorLog'
import { ClockIcon, ItemIcon } from '../../../assets/icons'
import { GENERAL_ERROR_MESSAGE } from '../../../constants/errorMessages'
import { BULK_ITEM_CREATED } from '../../../constants/successMessages'
import { useTabs } from '../../../context'
import {
   CREATE_BULK_ITEM,
   SUPPLIER_ITEM_SUBSCRIPTION,
   UPDATE_SUPPLIER_ITEM,
} from '../../../graphql'
import ProcessingView from './ProcessingView'
import {
   StyledGrid,
   StyledInfo,
   StyledSupplier,
   TransparentIconButton,
} from './styled'
import {
   ConfigTunnel,
   InfoTunnel,
   ProcessingTunnel,
   SuppliersTunnel,
} from './tunnels'

const address = 'apps.inventory.views.forms.item.'

export default function ItemForm() {
   const { t } = useTranslation()
   const [formState, setFormState] = React.useState({})
   const [itemName, setItemName] = React.useState('')
   const { id } = useParams()
   const { setTabTitle } = useTabs()

   const [supplierTunnel, openSupplierTunnel, closeSupplierTunnel] = useTunnel(
      1
   )
   const [infoTunnel, openInfoTunnel, closeInfoTunnel] = useTunnel(1)
   const [
      processingTunnel,
      openProcessingTunnel,
      closeProcessingTunnel,
   ] = useTunnel(1)
   const [configTunnel, openConfigTunnel, closeConfigTunnel] = useTunnel(1)

   const { loading: itemDetailLoading } = useSubscription(
      SUPPLIER_ITEM_SUBSCRIPTION,
      {
         variables: { id },
         onSubscriptionData: input => {
            const data = input.subscriptionData.data.supplierItem

            setItemName(data.name)
            setFormState(data)
         },
      }
   )

   const [updateSupplierItem] = useMutation(UPDATE_SUPPLIER_ITEM, {
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
      },
      onCompleted: () => {
         toast.info('Supplier Item updated!')
         setTabTitle(itemName)
      },
   })

   const [
      createBulkItem,
      {
         loading: creatingBulkItem,
         data: { createBulkItem: { returning: bulktItems = [] } = {} } = {},
      },
   ] = useMutation(CREATE_BULK_ITEM, {
      onCompleted: data => {
         if (formState.bulkItemAsShippedId) {
            toast.info(BULK_ITEM_CREATED)
            openConfigTunnel(1)
         } else
            updateSupplierItem({
               variables: {
                  id: formState.id,
                  object: {
                     bulkItemAsShippedId: data.createBulkItem.returning[0].id,
                  },
               },
            })
      },
      onError: error => {
         logger(error)
         toast.error(GENERAL_ERROR_MESSAGE)
      },
   })

   if (itemDetailLoading) return <Loader />

   return (
      <>
         <Tunnels tunnels={supplierTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <SuppliersTunnel
                  close={closeSupplierTunnel}
                  formState={formState}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={infoTunnel}>
            <Tunnel layer={1}>
               <InfoTunnel
                  close={() => closeInfoTunnel(1)}
                  formState={formState}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={processingTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <ProcessingTunnel
                  close={closeProcessingTunnel}
                  open={openProcessingTunnel}
                  formState={formState}
                  createBulkItem={createBulkItem}
                  creatingBulkItem={creatingBulkItem}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={configTunnel}>
            <Tunnel style={{ overflowY: 'auto' }} layer={1} size="lg">
               <ConfigTunnel
                  close={closeConfigTunnel}
                  open={openConfigTunnel}
                  id={bulktItems[0]?.id}
               />
            </Tunnel>
         </Tunnels>

         <div
            style={{ background: '#f3f3f3', minHeight: 'calc(100vh - 40px)' }}
         >
            <Flex
               margin="0 auto"
               padding="0 32px"
               style={{ background: '#fff' }}
            >
               <Flex
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  padding="16px 0"
               >
                  {formState.name && (
                     <>
                        <StyledInfo>
                           <div>
                              <Form.Group>
                                 <Flex container alignItems="center">
                                    <Form.Label
                                       htmlFor="itemName"
                                       title="itemName"
                                    >
                                       Item Name
                                    </Form.Label>
                                    <Tooltip identifier="supplieritem_form_itemname_formfield" />
                                 </Flex>
                                 <Form.Text
                                    id="itemName"
                                    name="itemName"
                                    placeholder="Supplier Item Name..."
                                    value={itemName}
                                    onChange={e => setItemName(e.target.value)}
                                    onBlur={() => {
                                       if (!itemName.length) {
                                          toast.error("Name can't be empty")
                                          return setItemName(formState.name)
                                       }

                                       if (itemName !== formState.name)
                                          updateSupplierItem({
                                             variables: {
                                                id: formState.id,
                                                object: { name: itemName },
                                             },
                                          })
                                    }}
                                 />
                              </Form.Group>
                              <span>sku: {formState.sku || 'N/A'}</span>
                           </div>
                        </StyledInfo>
                        <StyledSupplier>
                           <ContactPerson
                              formState={formState}
                              open={openSupplierTunnel}
                           />
                        </StyledSupplier>
                     </>
                  )}
               </Flex>
            </Flex>
            <>
               <StyledGrid onClick={() => openInfoTunnel(1)}>
                  <div>
                     <div>
                        <ItemIcon />
                     </div>
                     <div>
                        <span>
                           <Text as="h4">
                              <Flex container alignItems="center">
                                 {t(address.concat('unit qty'))}
                                 <Tooltip identifier="supplieritem_form_unitquantity" />
                              </Flex>
                           </Text>
                        </span>
                        <div>
                           {/* prettier-ignore */}
                           <Text as="h3">
                              {formState.unitSize + formState.unit}
                              {formState.prices?.length
                                 ? ` ($ ${+formState.prices[0]?.unitPrice?.value})`
                                 : null}
                           </Text>
                        </div>
                     </div>
                  </div>
                  <div>
                     <div>
                        <ClockIcon />
                     </div>
                     <div>
                        <span>
                           <Text as="h4">
                              <Flex container alignItems="center">
                                 {t(address.concat('lead time'))}
                                 <Tooltip identifier="supplieritem_form_leadtime" />
                              </Flex>
                           </Text>
                        </span>
                        <div>
                           <Text as="h3">
                              {formState.leadTime?.value ? (
                                 <span>
                                    {`${formState.leadTime?.value} ${formState.leadTime?.unit}`}
                                 </span>
                              ) : (
                                 'N/A'
                              )}
                           </Text>
                        </div>
                     </div>
                  </div>
               </StyledGrid>

               <SectionTabs
                  style={{
                     width: 'calc(100vw - 64px)',
                     margin: '24px auto 0 auto',
                  }}
               >
                  <SectionTabList>
                     <SectionTabsListHeader>
                        <Text as="title">
                           <Flex container alignItems="center">
                              {t(address.concat('processings'))} (
                              {formState.bulkItems?.length})
                              <Tooltip identifier="supplieritem_form_processings" />
                           </Flex>
                        </Text>
                        <IconButton
                           onClick={() => {
                              if (!formState.supplier)
                                 return toast.error('Select a supplier first!')

                              openProcessingTunnel(1)
                           }}
                           type="outline"
                        >
                           <AddIcon size="18" strokeWidth="3" color="#555B6E" />
                        </IconButton>
                     </SectionTabsListHeader>
                     {formState.bulkItemAsShipped?.name ? (
                        <>
                           <Flex
                              container
                              alignItems="center"
                              margin="0 0 8px 0"
                           >
                              <Text as="subtitle">
                                 as received from supplier
                              </Text>
                              <Tooltip identifier="supplieritem_form_as_received_from_supplier_bulkitems" />
                           </Flex>

                           <SectionTab>
                              <Flex
                                 container
                                 style={{ textAlign: 'left' }}
                                 padding="14px"
                                 justifyContent="space-between"
                              >
                                 <div>
                                    <h3 style={{ marginBottom: '5px' }}>
                                       {formState.bulkItemAsShipped.name}
                                    </h3>
                                    <Text as="subtitle">
                                       {t(address.concat('on hand'))}:{' '}
                                       {formState.bulkItemAsShipped.onHand}{' '}
                                       {formState.bulkItemAsShipped?.unit || ''}
                                    </Text>
                                    {/* prettier-ignore */}
                                    <Text as="subtitle">
                                       {t(address.concat('shelf life'))}:{' '}
                                       {formState.bulkItemAsShipped.shelfLife
                                          ?.value || 'N/A'}{' '}
                                       {formState.bulkItemAsShipped.shelfLife
                                          ?.value
                                          ? formState.bulkItemAsShipped.shelfLife?.unit
                                          : ''}
                                    </Text>
                                 </div>
                              </Flex>
                           </SectionTab>
                        </>
                     ) : null}

                     {formState.bulkItems?.length ? (
                        <>
                           <Flex container alignItems="center" margin="8px 0">
                              <Text as="subtitle">
                                 derived from received processing
                              </Text>
                              <Tooltip identifier="supplieritem_form_derived_from_received_processing_bulkitems" />
                           </Flex>

                           {formState.bulkItems?.map(procs => {
                              if (procs.id === formState.bulkItemAsShippedId)
                                 return null
                              return (
                                 <SectionTab key={procs.id}>
                                    <Flex
                                       style={{
                                          textAlign: 'left',
                                       }}
                                       padding="14px"
                                    >
                                       <h3 style={{ marginBottom: '5px' }}>
                                          {procs.name}
                                       </h3>
                                       <Text as="subtitle">
                                          {t(address.concat('on hand'))}:{' '}
                                          {procs.onHand} {procs.unit}
                                       </Text>
                                       <Text as="subtitle">
                                          {t(address.concat('shelf life'))}:{' '}
                                          {procs?.shelfLife?.value || 'N/A'}{' '}
                                          {procs?.shelfLife?.value
                                             ? procs?.shelfLife?.unit
                                             : ''}
                                       </Text>
                                    </Flex>
                                 </SectionTab>
                              )
                           })}
                        </>
                     ) : null}
                  </SectionTabList>
                  <SectionTabPanels>
                     <SectionTabPanel>
                        <ProcessingView
                           proc={formState.bulkItemAsShipped}
                           isDefault
                        />
                     </SectionTabPanel>

                     {formState.bulkItems?.map(procs => {
                        if (procs.id === formState.bulkItemAsShippedId)
                           return null
                        return (
                           <SectionTabPanel key={procs.id}>
                              <ProcessingView proc={procs} />
                           </SectionTabPanel>
                        )
                     })}
                  </SectionTabPanels>
               </SectionTabs>
            </>
         </div>
      </>
   )
}

function ContactPerson({ formState, open }) {
   if (!formState.supplier)
      return (
         <TextButton type="outline" onClick={() => open(1)}>
            Add Supplier
         </TextButton>
      )

   return (
      <>
         <span>{formState.supplier.name}</span>
         <Avatar
            withName
            title={`${formState.supplier?.contactPerson?.firstName} ${
               formState.supplier?.contactPerson?.lastName || ''
            }`}
         />
         <TransparentIconButton type="outline" onClick={() => open(1)}>
            <EditIcon size="18" color="#555B6E" />
         </TransparentIconButton>
      </>
   )
}
