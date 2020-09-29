import React from 'react'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { isEmpty, groupBy } from 'lodash'
import { useMutation, useSubscription } from '@apollo/react-hooks'

import { BRANDS } from '../../../../../graphql'
import { ScrollSection } from '../../../../../../../shared/components'
import { BrandName, BrandLogo } from './sections'
import { Spacer } from '@dailykit/ui'

export const OnDemandSettings = () => {
   const params = useParams()
   const [settings, setSettings] = React.useState({})
   const [updateSetting] = useMutation(BRANDS.UPDATE_ONDEMAND_SETTING, {
      onCompleted: () => {
         toast.success('Successfully updated!')
      },
      onError: error => {
         toast.error(error.message)
      },
   })
   const {
      loading,
      data: { brandOnDemandSettings = [] } = {},
   } = useSubscription(BRANDS.ON_DEMAND_SETTINGS_TYPES)

   const transform = React.useCallback(
      node => ({
         id: node.onDemandSetting.id,
         type: node.onDemandSetting.type,
         identifier: node.onDemandSetting.identifier,
      }),
      []
   )

   React.useEffect(() => {
      if (!loading && !isEmpty(brandOnDemandSettings)) {
         const grouped = groupBy(brandOnDemandSettings.map(transform), 'type')

         Object.keys(grouped).forEach(key => {
            grouped[key] = grouped[key].map(node => node.identifier)
         })
         setSettings(grouped)
      }
   }, [loading, brandOnDemandSettings])

   const update = ({ id, value }) => {
      updateSetting({
         variables: {
            pk_columns: { brandId: params.id, storeSettingId: id },
            _set: { value: value },
         },
      })
   }

   return (
      <ScrollSection height="calc(100vh - 154px)">
         <ScrollSection.Aside links={settings} />
         <ScrollSection.Main>
            <ScrollSection.Section hash="brand" title="Brand">
               <BrandName update={update} />
               <Spacer size="24px" />
               <BrandLogo update={update} />
            </ScrollSection.Section>
         </ScrollSection.Main>
      </ScrollSection>
   )
}
