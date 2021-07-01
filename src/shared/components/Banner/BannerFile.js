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
import { IconButton, RoundedCloseIcon } from '@dailykit/ui'
import { MaximizeIcon, MinimizeIcon } from '../../assets/icons'

const BannerFile = ({ file, id, handleClose, userEmail }) => {
   const [isOpen, setIsOpen] = React.useState(false)
   const ref = React.useRef()
   const isOnViewport = useIsOnViewPort(ref)
   const [isMinimized, setIsMinimized] = React.useState(false)
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
               <StyledActions>
                  <h4>{isMinimized ? 'Show note' : 'Hide note'}</h4>
                  <IconButton
                     type="ghost"
                     size="sm"
                     onClick={() => setIsMinimized(!isMinimized)}
                  >
                     {isMinimized ? <MinimizeIcon /> : <MaximizeIcon />}
                  </IconButton>
                  <IconButton
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
                     <RoundedCloseIcon color="#367BF5" />
                  </IconButton>
               </StyledActions>
               <div
                  id={`${id}-${file.file.id}`}
                  style={{ display: isMinimized ? 'none' : 'block' }}
               />
            </Wrapper>
         )}
      </>
   )
}

const Wrapper = styled.div`
   position: relative;
   display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
   min-height: 40px;
   > a {
      color: #202020;
   }
   margin-bottom: 60px;
`
const StyledActions = styled.div`
   display: flex;
   align-items: center;
   height: 40px;
   position: absolute;
   top: 40px;
   right: 0;
   padding-bottom: 20px;
   /* z-index: 10; */
`

export default BannerFile
