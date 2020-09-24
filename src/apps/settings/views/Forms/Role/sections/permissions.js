import React from 'react'
import { toast } from 'react-toastify'
import { isEmpty, groupBy } from 'lodash'
import { useParams } from 'react-router-dom'
import { Toggle, TunnelHeader } from '@dailykit/ui'
import { useSubscription, useMutation, useLazyQuery } from '@apollo/react-hooks'

import {
   PermissionSection,
   StyledSectionItem,
   StyledPermissionItem,
} from './styled'
import { ROLES } from '../../../../graphql'
import { Spacer } from '../../../../../../shared/styled'
import { InlineLoader, Flex } from '../../../../../../shared/components'

export const PermissionsTunnel = ({ closeTunnel, app, setApp }) => {
   const params = useParams()
   const [isLoading, setIsLoading] = React.useState(true)
   const [permissions, setPermissions] = React.useState({})
   const {
      loading,
      data: { permissions: permissionsList = [] } = {},
   } = useSubscription(ROLES.PERMISSIONS, {
      variables: {
         appId: {
            _eq: app.id,
         },
         roleId: {
            _eq: params.id,
         },
      },
   })

   React.useEffect(() => {
      if (!loading && !isEmpty(permissionsList)) {
         const transform = node => ({
            id: node.id,
            route: node.route,
            title: node.title,
            assigned: isEmpty(node.roleAppPermissions) ? false : true,
            ...(!isEmpty(node.roleAppPermissions) && {
               value: node.roleAppPermissions[0].value,
            }),
         })
         setPermissions(formatData(permissionsList.map(transform)))
         setIsLoading(false)
      }
   }, [loading, permissionsList])

   const [fetchRoleApp, { data: { role_app = {} } = {} }] = useLazyQuery(
      ROLES.ROLE_APP
   )

   React.useEffect(() => {
      if ('id' in app) {
         fetchRoleApp({
            variables: {
               appId: app.id,
               roleId: params.id,
            },
         })
      }
   }, [app])

   const close = () => {
      closeTunnel(1)
      setApp(null)
   }
   return (
      <>
         <TunnelHeader title="Manage Permissions" close={() => close()} />
         <Flex
            overflowY="auto"
            padding="0 24px 24px 24px"
            height="calc(100vh - 104px)"
         >
            <PermissionSection>
               {isLoading ? (
                  <InlineLoader />
               ) : (
                  <>
                     {isEmpty(permissions) ? (
                        <span className="is_empty">
                           No permissions available
                        </span>
                     ) : (
                        <ul>
                           {Object.keys(permissions).map(key => (
                              <SectionItem
                                 key={key}
                                 title={key}
                                 role_app={role_app}
                                 permissions={permissions}
                              />
                           ))}
                        </ul>
                     )}
                  </>
               )}
            </PermissionSection>
            <Spacer size="24px" />
         </Flex>
      </>
   )
}

const SectionItem = ({ title, permissions, role_app }) => {
   const [isDisabled, setIsDisabled] = React.useState(false)

   React.useEffect(() => {
      if (!isEmpty(permissions[title].global)) {
         const permission = permissions[title].global.find(
            node => node.title === 'ROUTE_READ'
         )

         if (permission.value) {
            setIsDisabled(false)
         } else {
            setIsDisabled(true)
         }
      }
   }, [permissions])

   return (
      <StyledSectionItem>
         <h3>{title}</h3>
         <h4>Global</h4>
         {permissions[title]?.global?.length > 0 ? (
            <ul>
               {permissions[title].global.map((permission, index) => (
                  <PermissionItem
                     role_app={role_app}
                     permission={permission}
                     key={permission.route + index}
                  />
               ))}
            </ul>
         ) : (
            <span className="is_empty">No global permissions set!</span>
         )}
         <h4>Local</h4>
         {permissions[title]?.local?.length > 0 ? (
            <ul className={`${isDisabled ? 'is_disabled' : ''}`}>
               {permissions[title].local.map((permission, index) => (
                  <PermissionItem
                     role_app={role_app}
                     permission={permission}
                     key={permission.route + index}
                  />
               ))}
            </ul>
         ) : (
            <span className="is_empty">No local permissions set!</span>
         )}
      </StyledSectionItem>
   )
}

const PermissionItem = ({ permission, role_app }) => {
   const [updatePermission] = useMutation(ROLES.UPDATE_PERMISSION, {
      onCompleted: () => {
         toast.success('Successfully updated permission!')
      },
      onError: () => {
         toast.error('Failed to update permission!')
      },
   })
   const [insertPermission] = useMutation(ROLES.INSERT_PERMISSION, {
      onCompleted: () => {
         toast.success('Successfully assigned permission!')
      },
      onError: error => {
         console.log(error.message)
      },
   })
   const [checked, setChecked] = React.useState(
      'value' in permission ? permission.value : false
   )

   React.useEffect(() => {
      if (permission.assigned && checked !== permission.value) {
         updatePermission({
            variables: {
               appPermissionId: {
                  _eq: permission.id,
               },
               value: checked,
            },
         })
         return
      } else if ('id' in role_app && checked && !permission.assigned) {
         insertPermission({
            variables: {
               object: {
                  value: checked,
                  role_appId: role_app.id,
                  appPermissionId: permission.id,
               },
            },
         })
      }
   }, [checked])

   return (
      <StyledPermissionItem>
         <Toggle
            checked={checked}
            setChecked={setChecked}
            label={capitalize(
               capitalize(permission.title.split('_').join(' '), true)
            )}
         />
      </StyledPermissionItem>
   )
}

const capitalize = (str, lower = false) =>
   (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match =>
      match.toUpperCase()
   )

const formatData = list => {
   const data = {}

   for (let [key, value] of Object.entries(groupBy(list, 'route'))) {
      data[key] = {
         global: value.filter(node => node.title.includes('ROUTE')),
         local: value.filter(node => !node.title.includes('ROUTE')),
      }
   }
   return data
}
