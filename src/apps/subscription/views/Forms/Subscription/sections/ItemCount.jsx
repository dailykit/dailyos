import React from 'react'
import moment from 'moment'
import { RRule } from 'rrule'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import {
   Text,
   Input,
   Tunnel,
   Toggle,
   Tunnels,
   PlusIcon,
   useTunnel,
   IconButton,
   SectionTab,
   ComboButton,
   SectionTabs,
   TunnelHeader,
   SectionTabList,
   SectionTabPanel,
   SectionTabPanels,
   SectionTabsListHeader,
} from '@dailykit/ui'

import { usePlan } from '../state'
import DeliveryDay from './DeliveryDay'
import { ItemCountSection } from '../styled'
import { Spacer, Stack } from '../../../../styled'
import {
   ITEM_COUNT,
   INSERT_SUBSCRIPTION,
   UPSERT_ITEM_COUNT,
} from '../../../../graphql'
import { Flex, InlineLoader } from '../../../../../../shared/components'
import {
   EditIcon,
   TickIcon,
   CloseIcon,
} from '../../../../../../shared/assets/icons'

const ItemCount = ({ id, openItemTunnel }) => {
   const { state, dispatch } = usePlan()
   const [tabIndex, setTabIndex] = React.useState(0)
   const [tunnels, openTunnel, closeTunnel] = useTunnel()
   const [upsertItemCount] = useMutation(UPSERT_ITEM_COUNT)
   const { loading, data: { itemCount = {} } = {} } = useSubscription(
      ITEM_COUNT,
      {
         variables: { id },
         onSubscriptionData: ({
            subscriptionData: { data: { itemCount = {} } = {} } = {},
         }) => {
            dispatch({
               type: 'SET_ITEM',
               payload: {
                  id: itemCount.id,
                  count: itemCount.count,
                  price: itemCount.price,
                  isActive: itemCount.isActive,
               },
            })
         },
      }
   )

   React.useEffect(() => {
      return () => {
         dispatch({
            type: 'SET_ITEM',
            payload: {
               id: null,
               count: '',
               price: '',
               isActive: true,
            },
         })
      }
   }, [dispatch])

   const toggleIsActive = value => {
      if (itemCount.isValid) {
         return upsertItemCount({
            variables: {
               object: {
                  isActive: value,
                  id: state.item.id,
                  count: state.item.count,
                  price: state.item.price,
                  subscriptionServingId: state.serving.id,
               },
            },
         })
      }
      toast.error('Can not be published without any subscriptions!', {
         position: 'top-center',
      })
      return
   }

   if (loading) return <InlineLoader />
   return (
      <>
         <Flex
            container
            height="48px"
            alignItems="center"
            padding="0 8px 0 0"
            justifyContent="space-between"
         >
            <Text as="title">Price per week: {itemCount.price}</Text>
            <Flex container>
               {itemCount.isValid ? (
                  <Flex container flex="1" alignItems="center">
                     <TickIcon size={22} color="green" />
                     <Spacer size="8px" xAxis />
                     <span>All good!</span>
                  </Flex>
               ) : (
                  <Flex container flex="1" alignItems="center">
                     <CloseIcon size={22} color="red" />
                     <Spacer size="8px" xAxis />
                     <span>Must have atleast one active item count!</span>
                  </Flex>
               )}
               <Spacer size="24px" xAxis />
               <Toggle
                  label="Publish"
                  checked={state.item.isActive}
                  setChecked={value => toggleIsActive(value)}
               />
               <Spacer size="16px" xAxis />
               <IconButton type="outline" onClick={() => openItemTunnel(1)}>
                  <EditIcon />
               </IconButton>
            </Flex>
         </Flex>
         <ItemCountSection>
            {itemCount?.subscriptions.length > 0 ? (
               <SectionTabs onChange={index => setTabIndex(index)}>
                  <SectionTabList>
                     <SectionTabsListHeader>
                        <Text as="title">Delivery Days</Text>
                        <IconButton
                           type="outline"
                           onClick={() => openTunnel(1)}
                        >
                           <PlusIcon />
                        </IconButton>
                     </SectionTabsListHeader>
                     {itemCount?.subscriptions.map(subscription => (
                        <SectionTab key={subscription.id}>
                           <Text as="title">
                              {RRule.fromString(subscription.rrule).toText()}
                           </Text>
                        </SectionTab>
                     ))}
                  </SectionTabList>
                  <SectionTabPanels>
                     {itemCount?.subscriptions.map((subscription, index) => (
                        <SectionTabPanel key={subscription.id}>
                           {index === tabIndex && (
                              <DeliveryDay id={subscription.id} />
                           )}
                        </SectionTabPanel>
                     ))}
                  </SectionTabPanels>
               </SectionTabs>
            ) : (
               <Stack py="24px">
                  <ComboButton type="outline" onClick={() => openTunnel(1)}>
                     <PlusIcon />
                     Add Subscription
                  </ComboButton>
               </Stack>
            )}
            <SubscriptionTunnel tunnels={tunnels} closeTunnel={closeTunnel} />
         </ItemCountSection>
      </>
   )
}

export default ItemCount

const SubscriptionTunnel = ({ tunnels, closeTunnel }) => {
   const { state } = usePlan()
   const [insertSubscription] = useMutation(INSERT_SUBSCRIPTION, {
      onCompleted: () => {
         close()
      },
   })
   const [days, setDays] = React.useState({
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
   })
   const [form, setForm] = React.useState({
      cutOffTime: null,
      leadTime: null,
      startTime: null,
      startDate: null,
      endDate: null,
   })

   const save = () => {
      const bridge = {
         monday: 0,
         tuesday: 1,
         wednesday: 2,
         thursday: 3,
         friday: 4,
         saturday: 5,
         sunday: 6,
      }

      const objects = []

      for (let [key, value] of Object.entries(days)) {
         if (value) {
            let rule = new RRule({
               freq: RRule.WEEKLY,
               interval: 1,
               wkst: RRule.MO,
               byweekday: bridge[key],
            })

            objects.push({
               rrule: rule.toString(),
               subscriptionItemCountId: state.item.id,
               ...form,
               leadTime: { unit: 'days', value: Number(form.leadTime) },
               startTime: { unit: 'days', value: Number(form.startTime) },
            })
         }
      }

      insertSubscription({
         variables: {
            objects,
         },
      })
   }

   const handleChange = e => {
      const { name, value } = e.target
      const data = {
         ...form,
         [name]: value,
         ...(name === 'startDate' && {
            endDate: moment(value).add(28, 'days').format('YYYY-MM-DD'),
         }),
      }
      setForm(data)
   }

   const selectDay = (e, day) => {
      setDays({ ...days, [day]: e.target.checked })
   }

   const close = () => {
      closeTunnel(1)
      setDays({
         sunday: false,
         monday: false,
         tuesday: false,
         wednesday: false,
         thursday: false,
         friday: false,
         saturday: false,
      })
      setForm({
         cutOffTime: null,
         leadTime: null,
         startTime: null,
         startDate: null,
         endDate: null,
      })
   }

   return (
      <Tunnels tunnels={tunnels}>
         <Tunnel layer="1">
            <TunnelHeader
               title="Add Subscription"
               close={() => close()}
               right={{ action: () => save(), title: 'Save' }}
            />
            <main style={{ padding: 16 }}>
               <section>
                  <Text as="title">Add delivery days</Text>
                  <Spacer size="16px" />
                  <DeliveryDaysList>
                     {Object.keys(days).map(day => (
                        <li key={day}>
                           <input
                              id={day}
                              name={day}
                              type="checkbox"
                              value={days[day]}
                              onChange={e => selectDay(e, day)}
                           />
                           <label htmlFor={day}>{day}</label>
                        </li>
                     ))}
                  </DeliveryDaysList>
               </section>
               <Spacer size="48px" />
               <section>
                  <Flex container alignItems="flex-end">
                     <TimeInput>
                        <label htmlFor="cutOffTime">Cut Off Time</label>
                        <input
                           type="time"
                           id="cutOffTime"
                           name="cutOffTime"
                           value={form.cutOffTime}
                           onChange={e => handleChange(e)}
                        />
                     </TimeInput>
                     <Spacer size="16px" xAxis />
                     <Input
                        type="text"
                        name="leadTime"
                        label="Lead Time"
                        value={form.leadTime}
                        onChange={e => handleChange(e)}
                     />
                  </Flex>
                  <Spacer size="24px" />
                  <Input
                     type="text"
                     name="startTime"
                     label="Start Time"
                     value={form.startTime}
                     onChange={e => handleChange(e)}
                  />
                  <Spacer size="24px" />
                  <Flex container>
                     <DateInput>
                        <label htmlFor="startDate">Start Date</label>
                        <input
                           type="date"
                           id="startDate"
                           name="startDate"
                           value={form.startDate}
                           onChange={e => handleChange(e)}
                        />
                     </DateInput>
                     <Spacer size="16px" xAxis />
                     <DateInput>
                        <label htmlFor="endDate">End Date</label>
                        <input
                           disabled
                           type="date"
                           id="endDate"
                           name="endDate"
                           value={form.endDate}
                           onChange={e => handleChange(e)}
                        />
                     </DateInput>
                  </Flex>
               </section>
            </main>
         </Tunnel>
      </Tunnels>
   )
}

const DeliveryDaysList = styled.ul`
   display: grid;
   grid-gap: 16px;
   grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
   li {
      list-style: none;
      label {
         margin-left: 12px;
         text-transform: capitalize;
      }
   }
`

const TimeInput = styled.div`
   width: 180px;
   position: relative;
   label {
      top: -8px;
      color: #888d9d;
      font-size: 14px;
      position: absolute;
   }
   input {
      border: none;
      height: 40px;
      width: inherit;
      font-size: 16px;
      font-weight: 400;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      :focus {
         outline: none;
         border-bottom: 1px solid rgba(0, 0, 0, 0.5);
      }
   }
`

const DateInput = styled.div`
   width: 180px;
   position: relative;
   label {
      top: -8px;
      color: #888d9d;
      font-size: 14px;
      position: absolute;
   }
   input {
      border: none;
      height: 40px;
      width: inherit;
      font-size: 16px;
      font-weight: 400;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      :focus {
         outline: none;
         border-bottom: 1px solid rgba(0, 0, 0, 0.5);
      }
   }
`
