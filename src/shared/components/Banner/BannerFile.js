import React from 'react'
import { useSubscription, useMutation, useQuery } from '@apollo/react-hooks'
import {
   UPDATE_SHOWN_COUNT,
   GET_SHOW_COUNT,
   UPDATE_LAST_VISITED,
} from '../../graphql'
import moment from 'moment'
import useIsOnViewPort from '../../hooks/useIsOnViewport'
import styled from 'styled-components'
import { IconButton, CloseIcon } from '@dailykit/ui'

const BannerFile = ({ file, id, handleClose, userEmail }) => {
   const [isOpen, setIsOpen] = React.useState(false)
   const [isBeforeOneDay, setIsBeforeOneDay] = React.useState(true)
   const ref = React.useRef()
   const isOnViewport = useIsOnViewPort(ref)

   const [lastVisited, setLastVisited] = React.useState(null)

   const [updateShownCount] = useMutation(UPDATE_SHOWN_COUNT, {
      skip: !userEmail,
      onError: err => console.error(err),
      variables: {
         userEmail,
         divId: file.divId,
         fileId: file.file.id,
      },
   })

   const [updateLastVisited] = useMutation(UPDATE_LAST_VISITED, {
      skip: !userEmail,
      onError: err => console.error(err),
   })
   const { data, error, loading } = useQuery(GET_SHOW_COUNT, {
      skip: !userEmail,
      variables: {
         userEmail,
         divId: file.divId,
         fileId: file.file.id,
      },
   })

   //    React.useEffect(() => {
   //       const isValid =
   //          data &&
   //          !loading &&
   //          !error &&
   //          !data?.ux_user_dailyosDivIdFile[0]?.showAgain &&
   //          data?.ux_user_dailyosDivIdFile[0]?.shownCount > 0

   //       console.log(id, file.file.id, isValid)
   //       if (isValid) {
   //          setIsOpen(false)
   //       }
   //    }, [data, loading, error])

   React.useEffect(() => {
      const queryData = data?.ux_user_dailyosDivIdFile[0]

      const isShowAgain = data && !loading && !error && queryData?.showAgain
      const isNotShowAgain =
         data &&
         !loading &&
         !error &&
         !queryData?.showAgain &&
         queryData?.shownCount === 0

      if (isShowAgain || isNotShowAgain) {
         setIsOpen(true)
      }
   }, [data, loading, error])

   //    React.useEffect(() => {
   //       if (isOnViewport) {
   //          updateLastVisited({
   //             variables: {
   //                userEmail,
   //                divId: file.divId,
   //                fileId: file.file.id,
   //                lastVisited: new Date().toISOString(),
   //             },
   //          })
   //       }
   //    }, [isOnViewport])

   React.useEffect(() => {
      if (isOnViewport) {
         updateShownCount()
      }
   }, [isOnViewport])

   //    useSubscription(GET_SHOW_COUNT, {
   //       skip: !userEmail,
   //       variables: {
   //          userEmail,
   //          divId: file.divId,
   //          fileId: file.file.id,
   //       },

   //       onSubscriptionData: ({
   //          subscriptionData: {
   //             data: { ux_user_dailyosDivIdFile = [] } = {},
   //          } = {},
   //       }) => {
   //          const [result] = ux_user_dailyosDivIdFile
   //          //  setLastVisited(result.lastVisited)
   //          //  console.log(id, file.file.id, result.lastVisited)
   //          //  const isBeforeADay = moment(result.lastVisited).isBefore(
   //          //     moment().subtract(1, 'minutes')
   //          //  )
   //          //  setIsBeforeOneDay(isBeforeADay)
   //          console.log(
   //             id,
   //             file.file.id,
   //             !result.showAgain && result.shownCount > 0,
   //             result.shownCount
   //          )
   //          if (!result.showAgain) {
   //             if (result.shownCount > 0) {
   //                setIsOpen(false)
   //             }
   //          }
   //       },
   //    })

   return (
      <>
         {file.divId === id && file.condition.isValid && (
            <Wrapper isOpen={isOpen} ref={ref}>
               <CloseButton
                  onClick={() => {
                     handleClose({
                        userEmail,
                        divId: file.divId,
                        fileId: file.file.id,
                     })
                     setIsOpen(false)
                  }}
                  type="ghost"
                  size="sm"
               >
                  <CloseIcon color="#367BF5" />
               </CloseButton>
               <div id={`${id}-${file.file.id}`} />
            </Wrapper>
         )}
      </>
   )
}

const Wrapper = styled.div`
   position: relative;
   display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`
const CloseButton = styled(IconButton)`
   position: absolute;
   right: 0;
   top: 0;
`
export default BannerFile
