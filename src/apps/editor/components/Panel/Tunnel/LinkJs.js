import React from 'react'
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks'
import { TunnelHeader, Tunnel, Tunnels, Dropdown } from '@dailykit/ui'
import { GET_FILES } from '../../../graphql'
import { TunnelBody } from './style'

export default function LinkCss({
   tunnels,
   openTunnel,
   closeTunnel,
   linkJsIds,
}) {
   const [jsOptions, setJsOptions] = React.useState([])
   const files = linkJsIds.map(file => {
      return file.id
   })
   //    console.log(files)
   const { loading, error } = useSubscription(GET_FILES, {
      variables: {
         fileType: 'js',
         linkedCss: files,
      },
      onSubscriptionData: ({
         subscriptionData: { data: { editor_file_aggregate = [] } = {} } = {},
      }) => {
         const jsResult = editor_file_aggregate?.nodes.map(file => {
            return {
               id: file.id,
               title: file.fileName,
               value: file.path,
               type: file.fileType,
            }
         })
         setJsOptions(jsResult)
      },
      skip: files.length === 0,
   })
   return (
      <div>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <TunnelHeader
                  title="Link JS Files"
                  close={() => closeTunnel(1)}
                  right={{
                     title: 'Save',
                     action: () => console.log('save'),
                  }}
               />
               <TunnelBody>
                  <Dropdown
                     type="multi"
                     options={jsOptions}
                     searchedOption={option => console.log(option)}
                     selectedOption={option => console.log(option)}
                     placeholder="type what you're looking for..."
                  />
               </TunnelBody>
            </Tunnel>
         </Tunnels>
      </div>
   )
}
