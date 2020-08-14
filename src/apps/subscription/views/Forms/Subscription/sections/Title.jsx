import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import {
   Input,
   Text,
   Tunnel,
   Toggle,
   Tunnels,
   PlusIcon,
   useTunnel,
   HelperText,
   IconButton,
   SectionTab,
   SectionTabs,
   TunnelHeader,
   SectionTabList,
   SectionTabPanel,
   SectionTabPanels,
   SectionTabsListHeader,
} from '@dailykit/ui'

import Serving from './Serving'
import { usePlan } from '../state'
import { Spacer } from '../../../../styled'
import { useTabs } from '../../../../context'
import { Header, Section, Wrapper } from '../styled'
import { InlineLoader } from '../../../../../../shared/components'
import {
   TITLE,
   UPSERT_SUBSCRIPTION_TITLE,
   UPSERT_SUBSCRIPTION_SERVING,
} from '../../../../graphql'

const Title = () => {
   const params = useParams()
   const history = useHistory()
   const { state, dispatch } = usePlan()
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
         id: state.title.id || params.id,
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
      if (!loading && !tab && title?.id) {
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

   const addServing = () => {
      openTunnel(1)
      dispatch({
         type: 'SET_SERVING',
         payload: { id: null, size: '', isDefault: false },
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
                     <IconButton type="outline" onClick={() => addServing()}>
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
                        {tabIndex === index && (
                           <Serving
                              id={serving.id}
                              isActive={tabIndex === index}
                              openServingTunnel={openTunnel}
                           />
                        )}
                     </SectionTabPanel>
                  ))}
               </SectionTabPanels>
            </SectionTabs>
         </Section>
         <ServingTunnel tunnels={tunnels} closeTunnel={closeTunnel} />
      </Wrapper>
   )
}

export default Title

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
               close={() => hideTunnel()}
               title={`${state.serving.id ? 'Edit' : 'Add'} Serving`}
               right={{ action: () => createServing(), title: 'Save' }}
            />
            <main style={{ padding: 16 }}>
               <Input
                  type="text"
                  name="serving"
                  label="Serving"
                  value={state.serving.size}
                  disabled={state.serving.id}
                  onChange={e =>
                     dispatch({
                        type: 'SET_SERVING',
                        payload: {
                           size: e.target.value,
                        },
                     })
                  }
               />
               {state.serving.id && (
                  <HelperText
                     type="hint"
                     message="Serving is not editable right now."
                  />
               )}
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
