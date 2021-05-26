import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { webRenderer } from '@dailykit/web-renderer'
import { GET_BANNER } from '../../graphql'
import { formatWebRendererData } from '../../utils'
import { IconButton, CloseIcon } from '@dailykit/ui'
import styled from 'styled-components'

const Banner = ({ id }) => {
   const [isActive, setIsActive] = React.useState(true)
   const [bannerIds, setBannerIds] = React.useState([])
   const [isVisible, setIsVisible] = React.useState(false)
   const [uxId, setUxId] = React.useState(null)
   const bannerDivRef = React.useRef()

   const handleClose = () => {
      localStorage.setItem('bannerIds', JSON.stringify([...bannerIds, uxId]))
      setIsActive(false)
   }

   React.useEffect(() => {
      const ids = JSON.parse(localStorage.getItem('bannerIds'))
      if (ids?.length && uxId) {
         setBannerIds(ids)
         if (ids.some(item => item === uxId)) {
            setIsActive(false)
         }
      }
   }, [uxId])

   useSubscription(GET_BANNER, {
      skip: !id && !bannerDivRef.current,
      variables: { id },
      onSubscriptionData: async ({
         subscriptionData: { data: { ux_dailyosDivId = [] } = {} } = {},
      } = {}) => {
         setUxId(ux_dailyosDivId[0]?.fileId)
         setIsVisible(ux_dailyosDivId[0]?.isActive)
         const result = await formatWebRendererData(ux_dailyosDivId)

         if (
            result.length &&
            bannerDivRef.current &&
            isActive &&
            ux_dailyosDivId[0]?.isActive
         ) {
            webRenderer({
               type: 'file',
               config: {
                  uri: process.env.REACT_APP_DATA_HUB_URI,
                  adminSecret:
                     process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET,
                  expressUrl: process.env.REACT_APP_EXPRESS_URL,
               },
               fileDetails: result,
            })
         }
      },
   })

   return (
      <Wrapper isVisible={isActive && isVisible}>
         <CloseButton onClick={handleClose} type="ghost" size="sm">
            <CloseIcon color="#367BF5" />
         </CloseButton>
         <div id={id} ref={bannerDivRef} className={`${id}__banner`} />
      </Wrapper>
   )
}

export default Banner

const Wrapper = styled.div`
   position: relative;
   display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`
const CloseButton = styled(IconButton)`
   position: absolute;
   right: 0;
   top: 0;
`
