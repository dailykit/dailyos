import React from 'react'

import { DashboardTile, Text } from '@dailykit/ui'

// State
import { useTabs } from '../../context'

import { StyledHome, StyledCardList } from './styled'

import { useTranslation } from 'react-i18next'

const address = 'apps.settings.views.home.'

const Home = () => {
   const { t } = useTranslation()
   const { addTab } = useTabs()
   return (
      <StyledHome>
         <Text as="h1">{t(address.concat('settings app'))}</Text>
         <StyledCardList>
            <DashboardTile
               title={t(address.concat('users'))}
               count="23"
               conf="All available"
               onClick={() => addTab('Users', '/settings/users')}
            />
            <DashboardTile
               title={t(address.concat('roles'))}
               count="4"
               conf="All available"
               onClick={() => addTab('Roles', '/settings/roles')}
            />
            <DashboardTile
               title={t(address.concat('apps'))}
               count="6"
               conf="All available"
               onClick={() => addTab('Apps', '/settings/apps')}
            />
            <DashboardTile
               title={t(address.concat('devices'))}
               count="4"
               conf="All active"
               onClick={() => addTab('Devices', '/settings/devices')}
            />
            <DashboardTile
               title={t(address.concat('stations'))}
               count="4"
               conf="All active"
               onClick={() => addTab('Stations', '/settings/stations')}
            />
            <DashboardTile
               title={t(address.concat('master lists'))}
               count="5"
               conf="All active"
               onClick={() => addTab('Master Lists', '/settings/master-lists')}
            />
         </StyledCardList>
      </StyledHome>
   )
}

export default Home
