import React from 'react'
import { Form, IconButton } from '@dailykit/ui'
import styled from 'styled-components'
import { useTabs } from '../../../../providers'
import { CloseIcon } from '../../../../assets/icons'

const TabOption = () => {
   const { tabs, removeTab, closeAllTabs, switchTab } = useTabs()
   return (
      <>
         {tabs.length > 0 && (
            <Styles.Wrapper>
               <Styles.SmallText>Group tabs</Styles.SmallText>
               <Styles.Group>
                  <Styles.GroupText>Group by apps</Styles.GroupText>
                  <Form.Toggle
                     name="first_time"
                     onChange={() => console.log('HJ')}
                     value={'Val'}
                     size={32}
                  />
               </Styles.Group>
               <Styles.Group>
                  <Styles.GroupText>Group by components</Styles.GroupText>
                  <Form.Toggle
                     name="first_time"
                     onChange={() => console.log('HJ')}
                     value={'Val'}
                     size={32}
                  />
               </Styles.Group>
               <Styles.CloseTab>
                  <Styles.SmallText>
                     Opened tabs ({tabs.length})
                  </Styles.SmallText>
                  <div onClick={() => closeAllTabs()}>Close All Tabs</div>
               </Styles.CloseTab>
               <Styles.TabContainer>
                  {tabs.map((tab, index) => (
                     <Styles.Tab key={tab.path}>
                        <span
                           title={tab.title}
                           onClick={() => switchTab(tab.path)}
                        >
                           {tab.title}
                        </span>
                        <IconButton
                           type="ghost"
                           size="sm"
                           type="button"
                           title="Close Tab"
                           onClick={e => {
                              e.stopPropagation()
                              removeTab({ tab, index })
                           }}
                        >
                           <CloseIcon size={8} color="#202020" />
                        </IconButton>
                     </Styles.Tab>
                  ))}
               </Styles.TabContainer>
            </Styles.Wrapper>
         )}
      </>
   )
}
export default TabOption
const Styles = {
   Wrapper: styled.div`
      position: fixed;
      width: 254px;
      max-height: 534px;
      right: 100px;
      top: 48px;
      background: rgba(255, 255, 255, 0.13);
      border: 1px solid #f2f3f3;
      backdrop-filter: blur(44.37px);
      border-radius: 10px;
      z-index: 10;
      > span:nth-child(1) {
         margin: 8px;
      }
   `,
   SmallText: styled.span`
      font-style: normal;
      font-weight: bold;
      font-size: 10px;
      letter-spacing: 0.44px;
      text-transform: uppercase;
      color: #919699;
   `,
   Group: styled.div`
      margin: 0px 8px 2px 8px;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f7f7f7;
      border-radius: 4px;
   `,
   GroupText: styled.span`
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.44px;
      text-transform: uppercase;
      color: #202020;
   `,
   TabContainer: styled.div`
      max-height: 300px;
      overflow-y: auto;
   `,
   Tab: styled.div`
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f7f7f7;
      border-radius: 4px;
      margin: 0px 8px 2px 8px;
      padding: 0px 12px;
      > span {
         font-style: normal;
         font-weight: 500;
         font-size: 12px;
         line-height: 16px;
         letter-spacing: 0.44px;
         color: #202020;
         cursor: pointer;
      }
      > button {
         height: 28px;
         width: 28px;
         > svg {
            stroke: #202020;
         }
      }
   `,
   CloseTab: styled.div`
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 20px 8px 8px 8px;
      > div {
         font-style: normal;
         font-weight: bold;
         font-size: 10px;
         line-height: 16px;
         letter-spacing: 0.44px;
         color: #367bf5;
         cursor: pointer;
      }
   `,
}
