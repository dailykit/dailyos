import React from 'react'
import styled from 'styled-components'
import { TextButton } from '@dailykit/ui'
import { Flex } from '../../../../shared/components/Flex'
import { CloseIcon } from '../../../../shared/assets/icons'

/**
 *
 * @param {{show: boolean, width: string, close: () => {}, action: {text: string, func: () => {}}}} props
 */
export default function Modal({
   show: showProp,
   children,
   width = '60%',
   close,
   action,
}) {
   if (showProp)
      return (
         <>
            <Background onClick={() => close(false)} />
            <Box width={width}>
               <Header title="Column" action={action} setShow={close} />
               <div style={{ padding: '1rem 2rem' }}>{children}</div>
            </Box>
         </>
      )
   else return null
}

export const Header = ({ title, action, setShow }) => {
   return (
      <>
         <Flex
            container
            alignItems="center"
            justifyContent="space-between"
            padding="1.2rem 2rem"
         >
            <Flex container alignItems="center">
               <TextButton onClick={() => setShow(false)} type="ghost">
                  <CloseIcon color="#888D9D" />
               </TextButton>
               <span style={{ width: '8px' }} />
               <h1>{title}</h1>
            </Flex>
            {action && action.text ? (
               <TextButton type="solid" onClick={action.func}>
                  {action.text}
               </TextButton>
            ) : null}
         </Flex>
         <hr style={{ border: '1px solid #E4E4E4' }} />
      </>
   )
}

const Background = styled.div`
   position: absolute;
   top: 0;
   left: 0;
   height: 100%;
   width: 100%;
   background: red;
   z-index: 100;
   background: rgba(217, 233, 241, 0.38);
   box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.05);
`
const Box = styled.div`
   position: absolute;
   right: 0%;
   left: 0%;
   width: ${({ width }) => width};
   margin: 0 auto;
   background-color: #fff;
   z-index: 101;
`
