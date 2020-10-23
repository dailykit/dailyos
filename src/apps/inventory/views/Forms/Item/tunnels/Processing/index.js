import { useSubscription } from '@apollo/react-hooks'
import {
   Filler,
   List,
   ListItem,
   ListOptions,
   ListSearch,
   TunnelHeader,
   useSingleList,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
   ErrorState,
   InlineLoader,
} from '../../../../../../../shared/components'
import { logger } from '../../../../../../../shared/utils/errorLog'
import { TunnelContainer } from '../../../../../components'
import { NO_PROCESSING } from '../../../../../constants/infoMessages'
import { MASTER_PROCESSINGS_SUBSCRIPTION } from '../../../../../graphql'

const address = 'apps.inventory.views.forms.item.tunnels.processing.'

export default function ProcessingTunnel({
   close,
   formState,
   createBulkItem,
   creatingBulkItem,
}) {
   const { t } = useTranslation()
   const [search, setSearch] = React.useState('')
   const [data, setData] = React.useState([])
   const [list, current, selectOption] = useSingleList(data)

   const { loading: processingsLoading, error } = useSubscription(
      MASTER_PROCESSINGS_SUBSCRIPTION,
      {
         variables: { supplierItemId: formState.id },
         onSubscriptionData: input => {
            const newProcessings =
               input.subscriptionData.data.masterProcessingsAggregate.nodes

            setData(newProcessings)
         },
      }
   )

   const handleNext = () => {
      createBulkItem({
         variables: {
            processingName: current.title,
            itemId: formState.id,
            unit: formState.unit, // string
         },
      })
      close(1)
   }

   if (error) {
      logger(error)
      return <ErrorState />
   }

   if (creatingBulkItem || processingsLoading) return <InlineLoader />

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select processing as item shipped'))}
            close={() => close(1)}
            right={{
               title: 'Next',
               action: handleNext,
            }}
         />
         <TunnelContainer>
            {list.length ? (
               <List>
                  {Object.keys(current).length > 0 ? (
                     <ListItem type="SSL1" title={current.title} />
                  ) : (
                     <ListSearch
                        onChange={value => setSearch(value)}
                        placeholder={t(
                           address.concat("type what you're looking for")
                        )}
                     />
                  )}
                  <ListOptions>
                     {list
                        .filter(option =>
                           option.title.toLowerCase().includes(search)
                        )
                        .map(option => (
                           <ListItem
                              type="SSL1"
                              key={option.id}
                              title={option.title}
                              isActive={option.id === current.id}
                              onClick={() => selectOption('id', option.id)}
                           />
                        ))}
                  </ListOptions>
               </List>
            ) : (
               <Filler message={NO_PROCESSING} />
            )}
         </TunnelContainer>
      </>
   )
}
