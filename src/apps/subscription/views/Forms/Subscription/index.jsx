import React from 'react'
import moment from 'moment'
import { RRule } from 'rrule'
import { useParams } from 'react-router-dom'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import {
   Tag,
   Input,
   Text,
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
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
} from '@dailykit/ui'

import { useTabs } from '../../../context'
import { Spacer, Stack } from '../../../styled'
import tableOptions from '../../../tableOption'
import { PlanProvider, usePlan } from './state'
import { InlineLoader } from '../../../../../shared/components'
import {
   TITLE,
   SERVING,
   ITEM_COUNT,
   UPSERT_ITEM_COUNT,
   SUBSCRIPTION_ZIPCODES,
   SUBSCRIPTION_CUSTOMERS,
   UPSERT_SUBSCRIPTION_TITLE,
   UPSERT_SUBSCRIPTION_SERVING,
   SUBSCRIPTION_OCCURENCES_LIST,
} from '../../../graphql'
import {
   Header,
   Section,
   Wrapper,
   ServingHeader,
   ItemCountHeader,
   ItemCountSection,
   ItemCountsSection,
   DeliveryDaySection,
} from './styled'
import { EditIcon } from '../../../../../shared/assets/icons'

export const Subscription = () => {
   return (
      <PlanProvider>
         <Title />
      </PlanProvider>
   )
}

const Title = () => {
   const params = useParams()
   const { dispatch } = usePlan()
   const [tabIndex, setTabIndex] = React.useState(0)
   const { tab, tabs, addTab, setTabTitle } = useTabs()
   const [form, setForm] = React.useState({ title: '' })
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [upsertTitle] = useMutation(UPSERT_SUBSCRIPTION_TITLE, {
      onCompleted: () => {
         setTabTitle(form.title)
      },
   })
   const { loading, data: { title = {} } = {} } = useSubscription(TITLE, {
      variables: {
         id: params.id,
      },
      onSubscriptionData: ({
         subscriptionData: { data: { title = {} } = {} },
      }) => {
         dispatch({
            type: 'SET_TITLE',
            payload: {
               id: title.id,
               title: title.title,
               defaultServing: { id: title.defaultSubscriptionServingId },
            },
         })
      },
   })

   React.useEffect(() => {
      if (!loading && !tab) {
         addTab(title.title, `/subscription/subscriptions/${params.id}`)
         dispatch({
            type: 'SET_TITLE',
            payload: {
               id: title.id,
               title: title.title,
               defaultServing: { id: title.defaultSubscriptionServingId },
            },
         })
      }
   }, [tabs, loading])

   const handleChange = e => {
      const { name, value } = e.target
      setForm({ ...form, [name]: value })
   }

   const saveTitle = e => {
      upsertTitle({
         variables: {
            object: {
               title: e.target.value,
               ...(!params.id.includes('form') && { id: params.id }),
            },
         },
      })
   }

   if (loading) return <InlineLoader />

   if (params.id.includes('form'))
      return (
         <Wrapper>
            <Header>
               <Input
                  type="text"
                  name="title"
                  label="Subscription Title"
                  onBlur={e => saveTitle(e)}
                  onChange={e => handleChange(e)}
                  value={form.title || title.title}
               />
            </Header>
         </Wrapper>
      )
   return (
      <Wrapper>
         <Header>
            <Input
               type="text"
               name="title"
               label="Subscription Title"
               onBlur={e => saveTitle(e)}
               onChange={e => handleChange(e)}
               value={form.title || title.title}
            />
         </Header>
         <Section>
            <SectionTabs onChange={index => setTabIndex(index)}>
               <SectionTabList>
                  <SectionTabsListHeader>
                     <Text as="title">Servings</Text>
                     <IconButton type="outline" onClick={() => openTunnel(1)}>
                        <PlusIcon />
                     </IconButton>
                  </SectionTabsListHeader>
                  {title?.servings.map(serving => (
                     <SectionTab key={serving.id}>
                        <Text as="title">{serving.size}</Text>
                     </SectionTab>
                  ))}
               </SectionTabList>
               <SectionTabPanels>
                  {title?.servings.map((serving, index) => (
                     <SectionTabPanel key={serving.id}>
                        <Serving
                           id={serving.id}
                           openServingTunnel={openTunnel}
                           isActive={tabIndex === index}
                        />
                     </SectionTabPanel>
                  ))}
               </SectionTabPanels>
            </SectionTabs>
         </Section>
         <ServingTunnel tunnels={tunnels} closeTunnel={closeTunnel} />
      </Wrapper>
   )
}

const Serving = ({ id, isActive, openServingTunnel }) => {
   const { state, dispatch } = usePlan()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const { loading, data: { serving = {} } = {} } = useSubscription(SERVING, {
      variables: { id },
   })

   React.useEffect(() => {
      if (!loading && isActive) {
         dispatch({
            type: 'SET_SERVING',
            payload: {
               id: serving.id,
               size: serving.size,
               isDefault: state.title.defaultServing.id === serving.id,
            },
         })
      }
   }, [loading, isActive])

   const editServing = () => {
      openServingTunnel(1)
      dispatch({
         type: 'SET_SERVING',
         payload: {
            id: serving.id,
            size: serving.size,
            isDefault: state.title.defaultServing.id === serving.id,
         },
      })
   }

   if (loading) return <InlineLoader />
   return (
      <>
         <ServingHeader>
            <Stack xAxis>
               <Text as="title">Serving: {serving.size}</Text>
               <Spacer size="14px" xAxis />
               {serving.id === state.title.defaultServing.id && (
                  <Tag>Default</Tag>
               )}
            </Stack>

            <IconButton type="outline" onClick={() => editServing()}>
               <EditIcon />
            </IconButton>
         </ServingHeader>
         <ItemCountsSection>
            {serving.counts.length > 0 ? (
               <HorizontalTabs>
                  <HorizontalTabList>
                     {serving.counts.map(({ id, count }) => (
                        <HorizontalTab key={id}>
                           <Text as="title">{count}</Text>
                        </HorizontalTab>
                     ))}
                  </HorizontalTabList>
                  <HorizontalTabPanels>
                     {serving.counts.map(({ id }) => (
                        <HorizontalTabPanel key={id}>
                           <ItemCount id={id} />
                        </HorizontalTabPanel>
                     ))}
                  </HorizontalTabPanels>
               </HorizontalTabs>
            ) : (
               <Stack py="24px">
                  <ComboButton type="outline" onClick={() => openTunnel(1)}>
                     <PlusIcon />
                     Add Item Count
                  </ComboButton>
               </Stack>
            )}
         </ItemCountsSection>
         <ItemCountTunnel tunnels={tunnels} closeTunnel={closeTunnel} />
      </>
   )
}

const ItemCount = ({ id }) => {
   const {
      loading,
      data: { itemCount = {} } = {},
   } = useSubscription(ITEM_COUNT, { variables: { id } })

   if (loading) return <InlineLoader />
   return (
      <>
         <ItemCountHeader>
            <Text as="title">Price per week: {itemCount.price}</Text>
         </ItemCountHeader>
         <Spacer size="16px" />
         <ItemCountSection>
            {itemCount?.subscriptions.length > 0 ? (
               <SectionTabs>
                  <SectionTabList>
                     <SectionTabsListHeader>
                        <Text as="title">Delivery Days</Text>
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
                     {itemCount?.subscriptions.map(subscription => (
                        <SectionTabPanel key={subscription.id}>
                           <DeliveryDay id={subscription.id} />
                        </SectionTabPanel>
                     ))}
                  </SectionTabPanels>
               </SectionTabs>
            ) : (
               'no occurences'
            )}
         </ItemCountSection>
      </>
   )
}

const DeliveryDay = ({ id }) => {
   const [areasTotal, setAreasTotal] = React.useState(0)
   const [customersTotal, setCustomersTotal] = React.useState(0)
   const [occurencesTotal, setOccurencesTotal] = React.useState(0)
   return (
      <>
         <DeliveryDaySection>
            <HorizontalTabs>
               <HorizontalTabList>
                  <HorizontalTab>Occurences ({occurencesTotal})</HorizontalTab>
                  <HorizontalTab>Delivery Areas ({areasTotal})</HorizontalTab>
                  <HorizontalTab>Customers ({customersTotal})</HorizontalTab>
               </HorizontalTabList>
               <HorizontalTabPanels>
                  <HorizontalTabPanel>
                     <Occurences
                        id={id}
                        setOccurencesTotal={setOccurencesTotal}
                     />
                  </HorizontalTabPanel>
                  <HorizontalTabPanel>
                     <DeliveryAreas id={id} setAreasTotal={setAreasTotal} />
                  </HorizontalTabPanel>
                  <HorizontalTabPanel>
                     <Customers id={id} setCustomersTotal={setCustomersTotal} />
                  </HorizontalTabPanel>
               </HorizontalTabPanels>
            </HorizontalTabs>
         </DeliveryDaySection>
      </>
   )
}

const Occurences = ({ id, setOccurencesTotal }) => {
   const tableRef = React.useRef()
   const {
      loading,
      data: { subscription_occurences = {} } = {},
   } = useSubscription(SUBSCRIPTION_OCCURENCES_LIST, {
      variables: { id },
      onSubscriptionData: ({ subscriptionData: { data = {} } = {} }) => {
         const { aggregate } = data.subscription_occurences.occurences_aggregate
         setOccurencesTotal(aggregate.count)
      },
   })

   const columns = [
      {
         title: 'Fulfillment Date',
         field: 'fulfillmentDate',
         formatter: ({ _cell: { value } }) => moment(value).format('MMM DD'),
      },
      {
         title: 'Cut Off Time',
         field: 'cutoffTimeStamp',
         formatter: ({ _cell: { value } }) =>
            moment(value).format('MMM DD HH:MM A'),
      },
      {
         title: 'Start Time',
         field: 'startTimeStamp',
         formatter: ({ _cell: { value } }) =>
            moment(value).format('MMM DD HH:MM A'),
      },
      {
         hozAlign: 'right',
         title: 'Menu Products',
         formatter: reactFormatter(<ProductsCount />),
      },
   ]

   if (loading) return <InlineLoader />
   return (
      <ReactTabulator
         ref={tableRef}
         columns={columns}
         options={{ ...tableOptions, layout: 'fitColumns' }}
         data={subscription_occurences.occurences_aggregate.nodes}
      />
   )
}

const ProductsCount = ({ cell: { _cell } }) => {
   const data = _cell.row.getData()
   return (
      <div>
         <span title="Added to this occurence">
            {data.products.aggregate.count}
         </span>
         /
         <span title="Added to the subscription">
            {data.subscription.products.aggregate.count}
         </span>
      </div>
   )
}

const DeliveryAreas = ({ id, setAreasTotal }) => {
   const tableRef = React.useRef()
   const {
      loading,
      data: { subscription_zipcodes = [] } = {},
   } = useSubscription(SUBSCRIPTION_ZIPCODES, {
      variables: { id },
      onSubscriptionData: ({ subscriptionData: { data = {} } = {} }) => {
         setAreasTotal(data.subscription_zipcodes.length)
      },
   })
   const columns = [
      {
         title: 'Zipcode',
         field: 'zipcode',
         headerFilter: true,
         headerFilterPlaceholder: 'Search zipcodes...',
      },
   ]

   if (loading) return <InlineLoader />
   return (
      <ReactTabulator
         ref={tableRef}
         columns={columns}
         data={subscription_zipcodes}
         options={{ ...tableOptions, layout: 'fitColumns' }}
      />
   )
}

const Customers = ({ id, setCustomersTotal }) => {
   const tableRef = React.useRef()
   const {
      loading,
      data: { subscription_customers = [] } = {},
   } = useSubscription(SUBSCRIPTION_CUSTOMERS, {
      variables: { id },
      onSubscriptionData: ({ subscriptionData: { data = {} } = {} }) => {
         setCustomersTotal(
            data.subscription_customers.customers.aggregate.count
         )
      },
   })
   const columns = [
      {
         title: 'Name',
         headerFilter: true,
         headerFilterPlaceholder: 'Search by names...',
         formatter: reactFormatter(<CustomerName />),
      },
      {
         title: 'Email',
         field: 'email',
         headerFilter: true,
         headerFilterPlaceholder: 'Search by email...',
      },
      {
         title: 'Phone Number',
         headerFilter: true,
         field: 'customer.phoneNumber',
         headerFilterPlaceholder: 'Search by phone numbers...',
      },
   ]

   if (loading) return <InlineLoader />
   return (
      <ReactTabulator
         ref={tableRef}
         columns={columns}
         data={subscription_customers.customers.nodes}
         options={{ ...tableOptions, layout: 'fitColumns' }}
      />
   )
}

const CustomerName = ({ cell: { _cell } }) => {
   const data = _cell.row.getData()

   if (!data.customer?.firstName) return 'N/A'
   return (
      <div>
         {data.customer?.firstName} {data.customer?.lastName}
      </div>
   )
}

const ServingTunnel = ({ tunnels, closeTunnel }) => {
   const { state, dispatch } = usePlan()
   const [upsertTitle] = useMutation(UPSERT_SUBSCRIPTION_TITLE)
   const [upsertServing] = useMutation(UPSERT_SUBSCRIPTION_SERVING, {
      onCompleted: ({ upsertSubscriptionServing = {} }) => {
         const { id } = upsertSubscriptionServing
         upsertTitle({
            variables: {
               object: {
                  id: state.title.id,
                  title: state.title.title,
                  defaultSubscriptionServingId: state.serving.isDefault
                     ? id
                     : null,
               },
            },
         })
         hideTunnel()
      },
   })

   const createServing = () => {
      upsertServing({
         variables: {
            object: {
               subscriptionTitleId: state.title.id,
               servingSize: Number(state.serving.size),
               ...(state.serving.id && {
                  id: state.serving.id,
               }),
            },
         },
      })
   }

   const hideTunnel = () => {
      closeTunnel(1)
   }

   return (
      <Tunnels tunnels={tunnels}>
         <Tunnel layer={1}>
            <TunnelHeader
               title="Add Serving"
               close={() => hideTunnel()}
               right={{ action: () => createServing(), title: 'Save' }}
            />
            <main style={{ padding: 16 }}>
               <Input
                  type="text"
                  name="serving"
                  label="Serving"
                  value={state.serving.size}
                  onChange={e =>
                     dispatch({
                        type: 'SET_SERVING',
                        payload: {
                           size: e.target.value,
                        },
                     })
                  }
               />
               <Spacer size="16px" />
               <Toggle
                  label="Make Default"
                  checked={state.serving.isDefault}
                  setChecked={value =>
                     dispatch({
                        type: 'SET_SERVING',
                        payload: {
                           isDefault: value,
                        },
                     })
                  }
               />
            </main>
         </Tunnel>
      </Tunnels>
   )
}

const ItemCountTunnel = ({ tunnels, closeTunnel }) => {
   const { state, dispatch } = usePlan()
   const [upsertItemCount] = useMutation(UPSERT_ITEM_COUNT, {
      onCompleted: () => {
         closeTunnel(1)
      },
   })

   const save = () => {
      upsertItemCount({
         variables: {
            object: {
               count: Number(state.item.count),
               price: Number(state.item.price),
               subscriptionServingId: state.serving.id,
               ...(state.item.id && { id: state.item.id }),
            },
         },
      })
   }

   return (
      <Tunnels tunnels={tunnels}>
         <Tunnel layer="1">
            <TunnelHeader
               title="Add Item Count"
               close={() => closeTunnel(1)}
               right={{ action: () => save(), title: 'Save' }}
            />
            <main style={{ padding: 16 }}>
               <Input
                  type="text"
                  name="count"
                  label="Count"
                  value={state.item.count}
                  onChange={e =>
                     dispatch({
                        type: 'SET_ITEM',
                        payload: {
                           count: e.target.value,
                        },
                     })
                  }
               />
               <Spacer size="16px" />
               <Input
                  type="text"
                  name="price"
                  label="Price"
                  value={state.item.price}
                  onChange={e =>
                     dispatch({
                        type: 'SET_ITEM',
                        payload: {
                           price: e.target.value,
                        },
                     })
                  }
               />
            </main>
         </Tunnel>
      </Tunnels>
   )
}
