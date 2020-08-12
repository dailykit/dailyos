import React from 'react'
import moment from 'moment'
import { RRule } from 'rrule'
import { useParams } from 'react-router-dom'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import {
   Input,
   Text,
   Tunnel,
   Toggle,
   Tunnels,
   PlusIcon,
   useTunnel,
   IconButton,
   SectionTab,
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

import { Spacer } from '../../../styled'
import { useTabs } from '../../../context'
import tableOptions from '../../../tableOption'
import { InlineLoader } from '../../../../../shared/components'
import {
   TITLE,
   SERVING,
   ITEM_COUNT,
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
import { PlanProvider, usePlan } from './state'

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
   })

   React.useEffect(() => {
      if (!loading && !tab) {
         addTab(title.title, `/subscription/subscriptions/${params.id}`)
         dispatch({
            type: 'SET_TITLE',
            payload: { id: title.id, title: title.title },
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
            <SectionTabs>
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
                  {title?.servings.map(serving => (
                     <SectionTabPanel key={serving.id}>
                        <Serving id={serving.id} />
                     </SectionTabPanel>
                  ))}
               </SectionTabPanels>
            </SectionTabs>
         </Section>
         <CreateServingTunnel tunnels={tunnels} closeTunnel={closeTunnel} />
      </Wrapper>
   )
}

const Serving = ({ id }) => {
   const { loading, data: { serving = {} } = {} } = useSubscription(SERVING, {
      variables: { id },
   })

   if (loading) return <InlineLoader />
   return (
      <>
         <ServingHeader>
            <Text as="title">Serving: {serving.size}</Text>
         </ServingHeader>
         <ItemCountsSection>
            <HorizontalTabs>
               <HorizontalTabList>
                  {serving.counts.map(({ id, count }) => (
                     <HorizontalTab key={id}>
                        <Text as="title">{count}</Text>
                     </HorizontalTab>
                  ))}
               </HorizontalTabList>
               <HorizontalTabPanels>
                  {serving.counts.map(({ id, ...rest }) => (
                     <HorizontalTabPanel key={id}>
                        <ItemCount id={id} />
                     </HorizontalTabPanel>
                  ))}
               </HorizontalTabPanels>
            </HorizontalTabs>
         </ItemCountsSection>
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

const CreateServingTunnel = ({ tunnels, closeTunnel }) => {
   const { state } = usePlan()
   const [serving, setServing] = React.useState('')
   const [isDefault, setIsDefault] = React.useState(false)
   const [upsertTitle] = useMutation(UPSERT_SUBSCRIPTION_TITLE)
   const [upsertServing] = useMutation(UPSERT_SUBSCRIPTION_SERVING, {
      onCompleted: ({ upsertSubscriptionServing = {} }) => {
         closeTunnel(1)
         if (isDefault) {
            const { id } = upsertSubscriptionServing
            upsertTitle({
               variables: {
                  object: {
                     id: state.title.id,
                     title: state.title.title,
                     defaultSubscriptionServingId: id,
                  },
               },
            })
         }
      },
   })

   const createServing = () => {
      upsertServing({
         variables: {
            object: {
               servingSize: Number(serving),
               subscriptionTitleId: state.title.id,
            },
         },
      })
   }

   return (
      <Tunnels tunnels={tunnels}>
         <Tunnel layer={1}>
            <TunnelHeader
               title="Add Serving"
               close={() => closeTunnel(1)}
               right={{ action: () => createServing(), title: 'Save' }}
            />
            <main style={{ padding: 16 }}>
               <Input
                  type="text"
                  label="Serving"
                  name="serving"
                  value={serving}
                  onChange={e => setServing(e.target.value)}
               />
               <Spacer size="16px" />
               <Toggle
                  checked={isDefault}
                  label="Make Default"
                  setChecked={setIsDefault}
               />
            </main>
         </Tunnel>
      </Tunnels>
   )
}
