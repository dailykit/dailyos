import React from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
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
   const ref = React.useRef()
   const isOnViewport = useIsOnViewPort(ref)

   const [lastVisited, setLastVisited] = React.useState(null)

   const [updateShownCount] = useMutation(UPDATE_SHOWN_COUNT, {
      skip: !userEmail,
      onError: err => console.error(err),
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

   React.useEffect(() => {
      const queryData = data?.ux_user_dailyosDivIdFile[0]
      const isValidShownAgain =
         data && !loading && !error && queryData?.showAgain
      const isValidNotShowAgain =
         data &&
         !loading &&
         !error &&
         !queryData?.showAgain &&
         queryData?.shownCount === 0 &&
         queryData?.closedCount === 0

      setLastVisited(queryData?.lastVisited)

      if (isValidShownAgain || isValidNotShowAgain) {
         setIsOpen(true)
         updateLastVisited({
            variables: {
               lastVisited: new Date().toISOString(),
               userEmail,
               divId: file.divId,
               fileId: file.file.id,
            },
         })
      }
   }, [data, loading, error])

   React.useEffect(() => {
      const isBeforeADay = moment(lastVisited).isBefore(
         moment().subtract(24, 'hours')
      )

      if (isOnViewport && isBeforeADay) {
         updateShownCount({
            variables: {
               userEmail,
               divId: file.divId,
               fileId: file.file.id,
            },
         })
      }
   }, [isOnViewport, lastVisited])

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
