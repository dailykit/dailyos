import React from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import {
   Form,
   Text,
   Flex,
   Tunnel,
   Spacer,
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
import validate from '../validate'
import { usePlan } from '../state'
import { useTabs } from '../../../../context'
import { Header, Section, Wrapper } from '../styled'
import { logger } from '../../../../../../shared/utils'
import {
   Tooltip,
   ErrorState,
   InlineLoader,
   ErrorBoundary,
} from '../../../../../../shared/components'
import { TickIcon, CloseIcon } from '../../../../../../shared/assets/icons'
import {
   TITLE,
   UPSERT_SUBSCRIPTION_TITLE,
   UPSERT_SUBSCRIPTION_SERVING,
} from '../../../../graphql'

const Title = () => {
   const params = useParams()
   const { state, dispatch } = usePlan()
   const { tab, addTab, setTabTitle } = useTabs()
   const [tabIndex, setTabIndex] = React.useState(0)
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [upsertTitle] = useMutation(UPSERT_SUBSCRIPTION_TITLE, {
      onCompleted: ({ upsertSubscriptionTitle = {} }) => {
         if (isEmpty(upsertSubscriptionTitle)) return
         setTabTitle(upsertSubscriptionTitle?.title)
         toast.success('Successfully updated the title!')
      },
      onError: error => {
         toast.error('Failed to update the title!')
         logger(error)
      },
   })
   const { error, loading, data: { title = {} } = {} } = useSubscription(
      TITLE,
      {
         variables: {
            id: params.id,
         },
         onSubscriptionData: ({
            subscriptionData: { data: { title = {} } = {} },
         }) => {
            if (isEmpty(title)) return

            dispatch({
               type: 'SET_TITLE',
               payload: {
                  id: title.id,
                  title: title.title,
                  isActive: title.isActive,
                  defaultServing: { id: title.defaultSubscriptionServingId },
               },
            })
            !tab &&
               addTab(title?.title, `/subscription/subscriptions/${title?.id}`)
         },
      }
   )

   React.useEffect(() => {
      if (!loading && title.servings.every(node => node.isActive === false)) {
         upsertTitle({
            variables: {
               object: {
                  id: title.id,
                  isActive: false,
                  title: title.title,
               },
            },
         })
      }
   }, [loading, title, upsertTitle])

   const handleChange = e => {
      dispatch({
         type: 'SET_TITLE',
         payload: {
            title: e.target.value,
         },
      })
   }

   const saveTitle = e => {
      dispatch({
         type: 'SET_TITLE',
         payload: {
            meta: {
               isTouched: true,
               errors: validate.title(e.target.value).errors,
               isValid: validate.title(e.target.value).isValid,
            },
         },
      })
      if (!validate.title(e.target.value).isValid) return
      if (title.title === e.target.value) return
      upsertTitle({
         variables: {
            object: {
               id: params.id,
               title: e.target.value,
            },
         },
      })
   }

   const toggleIsActive = () => {
      if (!state.title.isActive && !title.isValid) {
         toast.error('Can not be published without any active servings!', {
            position: 'top-center',
         })
         return
      }
      upsertTitle({
         variables: {
            object: {
               id: state.title.id,
               title: state.title.title,
               isActive: !state.title.isActive,
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
   if (error) {
      toast.error('Failed to fetch title details!')
      logger(error)
      return <ErrorState message="Failed to fetch title details!" />
   }
   return (
      <Wrapper>
         <Header>
            <Form.Group>
               <Form.Label htmlFor="title" title="title">
                  <Flex container alignItems="center">
                     Subscription Title*
                     <Tooltip identifier="form_subscription_field_title" />
                  </Flex>
               </Form.Label>
               <Form.Text
                  id="title"
                  name="title"
                  value={state.title.title}
                  placeholder="Enter the title"
                  onBlur={e => saveTitle(e)}
                  onChange={e => handleChange(e)}
                  hasError={
                     state.title.meta.isTouched && !state.title.meta.isValid
                  }
               />
               {state.title.meta.isTouched &&
                  !state.title.meta.isValid &&
                  state.title.meta.errors.map((error, index) => (
                     <Form.Error key={index}>{error}</Form.Error>
                  ))}
            </Form.Group>
            <Flex container alignItems="center">
               {title.isValid ? (
                  <Flex container flex="1" alignItems="center">
                     <TickIcon size={22} color="green" />
                     <Spacer size="8px" xAxis />
                     <span>All good!</span>
                  </Flex>
               ) : (
                  <Flex container flex="1" alignItems="center">
                     <CloseIcon size={22} color="red" />
                     <Spacer size="8px" xAxis />
                     <span>Must have atleast one active servings!</span>
                  </Flex>
               )}
               <Spacer size="16px" xAxis />
               <Flex container alignItems="center">
                  <Form.Toggle
                     name="publish_title"
                     onChange={toggleIsActive}
                     value={state.title.isActive}
                  >
                     Publish
                  </Form.Toggle>
                  <Tooltip identifier="form_station_subscription_title_publish" />
               </Flex>
            </Flex>
         </Header>
         <Section>
            <SectionTabs onChange={index => setTabIndex(index)}>
               <SectionTabList>
                  <SectionTabsListHeader>
                     <Flex container alignItems="center">
                        <Text as="title">Servings</Text>
                        <Tooltip identifier="form_subscription_section_servings_heading" />
                     </Flex>
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
                     <SectionTabPanel
                        key={serving.id}
                        style={{ overflow: 'hidden' }}
                     >
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
         <ErrorBoundary rootRoute="/subscription/subscriptions">
            <ServingTunnel tunnels={tunnels} closeTunnel={closeTunnel} />
         </ErrorBoundary>
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
         toast.success('Successfully created the serving!')
      },
      onError: error => {
         logger(error)
         toast.error('Failed to create the serving')
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

   const onBlur = e => {
      dispatch({
         type: 'SET_SERVING',
         payload: {
            meta: {
               isTouched: true,
               errors: validate.serving(e.target.value).errors,
               isValid: validate.serving(e.target.value).isValid,
            },
         },
      })
   }

   return (
      <Tunnels tunnels={tunnels}>
         <Tunnel layer={1}>
            <TunnelHeader
               close={() => hideTunnel()}
               title={`${state.serving.id ? 'Edit' : 'Add'} Serving`}
               right={{
                  title: 'Save',
                  action: () => createServing(),
                  disabled: !state.serving.meta.isValid,
               }}
               tooltip={
                  <Tooltip identifier="form_subscription_tunnel_serving_create" />
               }
            />
            <Flex padding="16px">
               <Form.Group>
                  <Form.Label htmlFor="serving" title="serving">
                     <Flex container alignItems="center">
                        Serving Size*
                        <Tooltip identifier="form_subscription_tunnel_serving_field_size" />
                     </Flex>
                  </Form.Label>
                  <Form.Number
                     id="serving"
                     name="serving"
                     onBlur={onBlur}
                     onChange={e =>
                        dispatch({
                           type: 'SET_SERVING',
                           payload: {
                              size: Number(e.target.value) || '',
                           },
                        })
                     }
                     value={state.serving.size}
                     disabled={state.serving.id}
                     placeholder="Enter the serving size"
                     hasError={
                        state.serving.meta.isTouched &&
                        !state.serving.meta.isValid
                     }
                  />
                  {state.serving.meta.isTouched &&
                     !state.serving.meta.isValid &&
                     state.serving.meta.errors.map((error, index) => (
                        <Form.Error key={index}>{error}</Form.Error>
                     ))}
               </Form.Group>
               {state.serving.id && (
                  <HelperText
                     type="hint"
                     message="Serving is not editable right now."
                  />
               )}
               <Spacer size="16px" />
               <Form.Toggle
                  value={state.serving.isDefault}
                  onChange={() =>
                     dispatch({
                        type: 'SET_SERVING',
                        payload: {
                           isDefault: !state.serving.isDefault,
                        },
                     })
                  }
               >
                  <Flex container alignItems="center">
                     Make Default
                     <Tooltip identifier="form_subscription_tunnel_serving_field_make_default" />
                  </Flex>
               </Form.Toggle>
            </Flex>
         </Tunnel>
      </Tunnels>
   )
}
