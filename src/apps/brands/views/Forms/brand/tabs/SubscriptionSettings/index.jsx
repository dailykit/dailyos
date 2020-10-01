import React from 'react'
import { Spacer } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { isEmpty, groupBy } from 'lodash'
import { useParams } from 'react-router-dom'
import { useMutation, useSubscription } from '@apollo/react-hooks'

import { BRANDS } from '../../../../../graphql'
import { ScrollSection } from '../../../../../../../shared/components'
import { Brand, Contact, Address } from './sections'

export const SubscriptionSettings = () => {
   const params = useParams()
   const [settings, setSettings] = React.useState({})
   const [updateSetting] = useMutation(BRANDS.UPDATE_SUBSCRIPTION_SETTING, {
      onCompleted: () => {
         toast.success('Successfully updated!')
      },
      onError: error => {
         toast.error(error.message)
      },
   })
   const {
      loading,
      data: { subscriptionSettings = [] } = {},
   } = useSubscription(BRANDS.SUBSCRIPTION_SETTINGS_TYPES)

   React.useEffect(() => {
      if (!loading && !isEmpty(subscriptionSettings)) {
         const grouped = groupBy(subscriptionSettings, 'type')

         Object.keys(grouped).forEach(key => {
            grouped[key] = grouped[key].map(node => node.identifier)
         })
         setSettings(grouped)
      }
   }, [loading, subscriptionSettings])

   const update = ({ id, value }) => {
      updateSetting({
         variables: {
            object: {
               value,
               brandId: params.id,
               subscriptionStoreSettingId: id,
            },
         },
      })
   }

   return (
      <ScrollSection height="calc(100vh - 154px)">
         <ScrollSection.Aside links={settings} />
         <ScrollSection.Main>
            <ScrollSection.Section hash="brand" title="Brand">
               <Brand update={update} />
            </ScrollSection.Section>
            <Spacer size="48px" />
            <ScrollSection.Section hash="brand" title="Contact">
               <Contact update={update} />
            </ScrollSection.Section>
            <Spacer size="48px" />
            <ScrollSection.Section hash="avalability" title="Availability">
               <Address update={update} />
            </ScrollSection.Section>
            <Spacer size="48px" />
         </ScrollSection.Main>
      </ScrollSection>
   )
}
