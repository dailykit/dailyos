import React from 'react'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   Text,
   Input,
   Spacer,
   Toggle,
   TextButton,
   HorizontalTab,
   HorizontalTabs,
   HorizontalTabList,
   HorizontalTabPanel,
   HorizontalTabPanels,
} from '@dailykit/ui'

import { BRANDS } from '../../../graphql'
import { useTabs } from '../../../context'
import { Wrapper, Label } from './styled'
import { OnDemandSettings, OnDemandCollections } from './tabs'
import { Flex, InlineLoader } from '../../../../../shared/components'

export const Brand = () => {
   const params = useParams()
   const { tab, addTab, setTabTitle } = useTabs()
   const [title, setTitle] = React.useState('')
   const [update] = useMutation(BRANDS.UPDATE_BRAND, {
      onCompleted: () => toast.success('Successfully updated brand!'),
      onError: () => toast.error('Failed to update brand!'),
   })
   const { error, loading, data: { brand = {} } = {} } = useSubscription(
      BRANDS.BRAND,
      {
         variables: {
            id: params.id,
         },
         onSubscriptionData: ({
            subscriptionData: { data: { brand = {} } = {} } = {},
         }) => {
            setTitle(brand?.title || '')
            setTabTitle(brand?.title || '')
         },
      }
   )

   React.useEffect(() => {
      if (!tab && !loading && !isEmpty(brand)) {
         addTab(
            brand?.title || brand?.domain || 'N/A',
            `/brands/brands/${brand?.id}`
         )
      }
   }, [tab, addTab, loading, brand])

   const updateTitle = title => {
      if (!title) return
      update({
         variables: {
            id: params.id,
            _set: {
               title,
            },
         },
      })
   }

   if (loading) return <InlineLoader />
   if (error) return <span>Something went wrong, please refresh the page!</span>
   return (
      <Wrapper>
         <Flex
            container
            padding="0 16px"
            alignItems="center"
            justifyContent="space-between"
         >
            <Flex container alignItems="center">
               <section>
                  <Input
                     type="text"
                     label="Title"
                     name="title"
                     value={title}
                     disabled={brand?.isDefault}
                     onChange={e => setTitle(e.target.value)}
                     onBlur={e => updateTitle('title', e.target.value)}
                  />
               </section>
               <Spacer size="24px" xAxis />
               <section>
                  <Label>Domain</Label>
                  <Text as="h3">{brand?.domain}</Text>
               </section>
            </Flex>
            <Toggle
               label="Publish"
               checked={brand?.isPublished}
               setChecked={value =>
                  update({
                     variables: { id: params.id, _set: { isPublished: value } },
                  })
               }
            />
         </Flex>
         <Spacer size="24px" />
         <HorizontalTabs>
            <HorizontalTabList>
               <HorizontalTab>On Demand Settings</HorizontalTab>
               <HorizontalTab>On Demand Collections</HorizontalTab>
            </HorizontalTabList>
            <HorizontalTabPanels>
               <HorizontalTabPanel>
                  <OnDemandSettings />
               </HorizontalTabPanel>
               <HorizontalTabPanel>
                  <OnDemandCollections />
               </HorizontalTabPanel>
            </HorizontalTabPanels>
         </HorizontalTabs>
      </Wrapper>
   )
}
