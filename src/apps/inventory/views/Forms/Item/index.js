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
import AddIcon from '../../../../../shared/assets/icons/Add'
import DeleteIcon from '../../../../../shared/assets/icons/Delete'
import { Tooltip } from '../../../../../shared/components'
import EditIcon from '../../../../recipe/assets/icons/Edit'
import { ClockIcon, ItemIcon } from '../../../assets/icons'
import { useTabs } from '../../../context'
import {
   ItemContext,
   reducer,
   state as initialState,
} from '../../../context/item'
import {
   DELETE_BULK_ITEM,
   SUPPLIER_ITEM_SUBSCRIPTION,
   UPDATE_SUPPLIER_ITEM,
} from '../../../graphql'
import { FlexContainer, Flexible } from '../styled'
import ProcessingView from './ProcessingView'
import {
   ProcessingButton,
   StatHeader,
   StatValue,
   StyledGrid,
   StyledHeader,
   StyledInfo,
   StyledMain,
   StyledSupplier,
   TransparentIconButton,
} from './styled'
import {
   ConfigTunnel,
   ConfigureDerivedProcessingTunnel,
   ConfigureSachetTunnel,
   InfoTunnel,
   ProcessingTunnel,
   SelectDerivedProcessingTunnel,
   SuppliersTunnel,
} from './tunnels'

const address = 'apps.inventory.views.forms.item.'

export default function ItemForm() {
   const { t } = useTranslation()
   const [state, dispatch] = React.useReducer(reducer, initialState)
   const [active, setActive] = React.useState(false)
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

   const [
      derivedProcessingsTunnel,
      openDerivedProcessingTunnel,
      closeDerivedProcessingTunnel,
   ] = useTunnel(1)

   const [
      configureSachetTunnel,
      openConfigureSachetTunnel,
      closeConfigureSachetTunnel,
   ] = useTunnel(1)

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

   const [deleteBulkItem, { loading: bulkItemDeleteLoading }] = useMutation(
      DELETE_BULK_ITEM,
      {
         onCompleted: () => {
            toast.info('Bulk Item deleted successfully.')
         },
         onError: error => {
            console.log(error)
            toast.error('Error! cannot delete the bulk item. Please try again.')
         },
      }
   )

   const [updateSupplierItem] = useMutation(UPDATE_SUPPLIER_ITEM, {
      onError: error => {
         console.log(error)
         toast.error('Error! Please try again.')
      },
      onCompleted: () => {
         toast.info('Item name updated successfully')
         setTabTitle(itemName)
      },
   })

   const handleBulkItemDelete = id => {
      deleteBulkItem({ variables: { id } })
   }

   if (itemDetailLoading || bulkItemDeleteLoading) return <Loader />

   return (
      <ItemContext.Provider value={{ state, dispatch }}>
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
               />
            </Tunnel>
            <Tunnel style={{ overflowY: 'auto' }} layer={2} size="lg">
               <ConfigTunnel
                  close={closeProcessingTunnel}
                  open={openProcessingTunnel}
                  formState={formState}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={derivedProcessingsTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <SelectDerivedProcessingTunnel
                  next={() => openDerivedProcessingTunnel(2)}
                  close={() => closeDerivedProcessingTunnel(1)}
                  formState={formState}
               />
            </Tunnel>
            <Tunnel style={{ overflowY: 'auto' }} size="lg" layer={2}>
               <ConfigureDerivedProcessingTunnel
                  open={openDerivedProcessingTunnel}
                  close={closeDerivedProcessingTunnel}
                  formState={formState}
               />
            </Tunnel>
         </Tunnels>

         <Tunnels tunnels={configureSachetTunnel}>
            <Tunnel layer={1}>
               <ConfigureSachetTunnel
                  open={openConfigureSachetTunnel}
                  close={closeConfigureSachetTunnel}
                  formState={formState}
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
               <StyledHeader>
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
               </StyledHeader>
            </Flex>
            <>
               <StyledGrid onClick={() => openInfoTunnel(1)}>
                  <div>
                     <div>
                        <ItemIcon />
                     </div>
                     <div>
                        <span>
                           <StatHeader>
                              <Flex container alignItems="center">
                                 {t(address.concat('unit qty'))}
                                 <Tooltip identifier="supplieritem_form_unitquantity" />
                              </Flex>
                           </StatHeader>
                        </span>
                        <div>
                           {/* prettier-ignore */}
                           <StatValue>
                              {formState.unitSize + formState.unit}
                              {formState.prices?.length
                                 ? ` ($ ${+formState.prices[0]?.unitPrice?.value})`
                                 : null}
                           </StatValue>
                        </div>
                     </div>
                  </div>
                  <div>
                     <div>
                        <ClockIcon />
                     </div>
                     <div>
                        <span>
                           <StatHeader>
                              <Flex container alignItems="center">
                                 {t(address.concat('lead time'))}
                                 <Tooltip identifier="supplieritem_form_leadtime" />
                              </Flex>
                           </StatHeader>
                        </span>
                        <div>
                           <StatValue>
                              {formState.leadTime?.value ? (
                                 <span>
                                    {`${formState.leadTime?.value} ${formState.leadTime?.unit}`}
                                 </span>
                              ) : (
                                 'N/A'
                              )}
                           </StatValue>
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

                              dispatch({
                                 type: 'CLEAR_STATE',
                              })

                              if (formState.bulkItemAsShippedId) {
                                 openDerivedProcessingTunnel(1)
                              } else {
                                 openProcessingTunnel(1)
                              }
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
                                 {t(
                                    address.concat('as recieved from supplier')
                                 )}
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
                                    <Text as="subtitle">
                                       {t(address.concat('shelf life'))}:{' '}
                                       {formState.bulkItemAsShipped.shelfLife
                                          ?.value || 'N/A'}{' '}
                                       {formState.bulkItemAsShipped.shelfLife
                                          ?.value
                                          ? formState.bulkItemAsShipped
                                               .shelfLife?.unit
                                          : ''}
                                    </Text>
                                 </div>
                                 <FlexContainer>
                                    <TransparentIconButton
                                       onClick={() => openProcessingTunnel(2)}
                                       type="button"
                                    >
                                       <EditIcon />
                                    </TransparentIconButton>
                                 </FlexContainer>
                              </Flex>
                           </SectionTab>
                        </>
                     ) : null}

                     {formState.bulkItems?.length ? (
                        <>
                           <Flex container alignItems="center" margin="8px 0">
                              <Text as="subtitle">
                                 {t(
                                    address.concat(
                                       'derived from recieved processing'
                                    )
                                 )}
                              </Text>
                              <Tooltip identifier="supplieritem_form_derived_from_received_processing_bulkitems" />
                           </Flex>

                           {formState.bulkItems?.map(procs => {
                              if (procs.id === formState.bulkItemAsShippedId)
                                 return null
                              return (
                                 <SectionTab key={procs.id}>
                                    <Flex
                                       container
                                       style={{
                                          textAlign: 'left',
                                       }}
                                       padding="14px"
                                       justifyContent="space-between"
                                    >
                                       <div>
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
                                       </div>
                                       <Flex container>
                                          <IconButton
                                             onClick={() => {
                                                dispatch({
                                                   type: 'SET_DER_ACTION',
                                                   payload: 'UPDATE',
                                                })
                                                openDerivedProcessingTunnel(2)
                                             }}
                                             type="ghost"
                                          >
                                             <EditIcon />
                                          </IconButton>
                                          <span style={{ width: '5px' }} />
                                          <IconButton
                                             onClick={() =>
                                                handleBulkItemDelete(procs.id)
                                             }
                                             type="ghost"
                                          >
                                             <DeleteIcon />
                                          </IconButton>
                                       </Flex>
                                    </Flex>
                                 </SectionTab>
                              )
                           })}
                        </>
                     ) : null}
                  </SectionTabList>
                  <SectionTabPanels>
                     <SectionTabPanel>
                        <ProcessingView proc={formState.bulkItemAsShipped} />
                     </SectionTabPanel>

                     {formState.bulkItems?.map(procs => {
                        if (procs.id === formState.bulkItemAsShippedId)
                           return null
                        return (
                           <SectionTabPanel>
                              <ProcessingView proc={procs} />
                           </SectionTabPanel>
                        )
                     })}
                  </SectionTabPanels>
               </SectionTabs>
            </>
         </div>
      </ItemContext.Provider>
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
