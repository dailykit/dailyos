import React from 'react'
import PropTypes from 'prop-types'
import {
   RadioGroup,
   Flex,
   Form,
   TextButton,
   Spacer,
   IconButton,
   ComboButton,
   ButtonGroup,
   useTunnel,
} from '@dailykit/ui'
// State
import { Context } from '../../../../state'
import { useTabs } from '../../../../context'

// Components
import { Modal } from '../../../../components'
import { LinkFilesTunnel } from '../Tunnel'

import { EditorOptionsWrapper } from './styles'

// Assets
import {
   CodeMode,
   DesignMode,
   DesktopIcon,
   TabletIcon,
   MobileIcon,
   ExpandFullIcon,
   RotateLeftIcon,
   RotateRightIcon,
   DeleteIcon,
   LinkFileIcon,
   EyeIcon,
} from '../../../../assets/Icons'

const EditorOptions = ({
   lastSaved,
   draft,
   publish,
   isBuilderOpen,
   isDarkMode,
   language,
   undoWebBuilder,
   undoEditor,
   redoWebBuilder,
   redoEditor,
   fullscreen,
   deviceManager,
   saveTemplate,
}) => {
   const [
      linkFilesTunnels,
      openLinkFilesTunnel,
      closeLinkFilesTunnel,
   ] = useTunnel(1)
   const { tab } = useTabs()
   const [isModalVisible, setIsModalVisible] = React.useState()
   const [isWebBuilderOpen, SetIsWebBuilderOpen] = React.useState(false)
   const [isDark, setIsDark] = React.useState(false)
   const [message, setMessage] = React.useState('')
   const [deviceActive, setDeviceActive] = React.useState('desktop')
   const ModeOptions = [
      {
         id: 1,
         title: (
            <DesignMode
               size="20"
               color={isWebBuilderOpen ? 'white' : '#555B6E'}
            />
         ),
      },
      {
         id: 2,
         title: (
            <CodeMode
               size="20"
               color={isWebBuilderOpen ? '#555B6E' : 'white'}
            />
         ),
      },
   ]

   const deviceOptions = [
      {
         id: 1,
         title: (
            <DesktopIcon
               size="20"
               color={deviceActive === 'desktop' ? 'white' : '#555B6E'}
            />
         ),
         command: 'set-device-desktop',
         name: 'desktop',
      },
      {
         id: 2,
         title: (
            <TabletIcon
               size="20"
               color={deviceActive === 'tablet' ? 'white' : '#555B6E'}
            />
         ),
         command: 'set-device-tablet',
         name: 'tablet',
      },
      {
         id: 3,
         title: (
            <MobileIcon
               size="20"
               color={deviceActive === 'mobile' ? 'white' : '#555B6E'}
            />
         ),
         command: 'set-device-mobile',
         name: 'mobile',
      },
   ]

   React.useEffect(() => {
      isBuilderOpen(isWebBuilderOpen)
   }, [isWebBuilderOpen])
   React.useEffect(() => {
      isDarkMode(isDark)
   }, [isDark])

   return (
      <>
         <EditorOptionsWrapper>
            {/* {isModalVisible && (
            <Modal>
               <Modal.Header>
                  <span>Publish</span>
                  <button
                     onClick={() =>
                        setIsModalVisible(!isModalVisible) || setMessage('')
                     }
                  >
                     x
                  </button>
               </Modal.Header>
               <Modal.Body>
                  <label htmlFor="">Message</label>
                  <input
                     type="text"
                     value={message}
                     onChange={e => setMessage(e.target.value)}
                  />
               </Modal.Body>
               <Modal.Footer>
                  <button
                     onClick={() =>
                        setIsModalVisible(!isModalVisible) ||
                        setMessage('') ||
                        publish(message)
                     }
                  >
                     Confirm
                  </button>
                  <button
                     onClick={() =>
                        setIsModalVisible(!isModalVisible) || setMessage('')
                     }
                  >
                     Cancel
                  </button>
               </Modal.Footer>
            </Modal>
         )} */}
            {/* <div id="left">
           <button
                    className="btn__icon"
                    title="History"
                    onClick={() => dispatch({ type: 'TOGGLE_HISTORY_PANEL' })}
                >
                    <HistoryIcon color="#9a8484" />
                </button>
         </div> */}
            {/* {lastSaved && (
            <div>
               <span>
                  Last Saved -{' '}
                  {new Intl.DateTimeFormat('en-US', {
                     month: 'short',
                     day: 'numeric',
                     hour: 'numeric',
                     minute: 'numeric',
                  }).format(tab.lastSaved !== '' ? tab.lastSaved : lastSaved)}
               </span>
            </div>
         )} */}
            <Flex container alignItems="center" justifyContent="space-between">
               <Form.Label htmlFor="theme" title="theme">
                  Dark Theme
               </Form.Label>
               <Form.Toggle
                  name="first_time"
                  onChange={() => setIsDark(!isDark)}
                  value={isDark}
               />
               <Spacer size="20px" xAxis />
               <IconButton type="ghost" onClick={() => openLinkFilesTunnel(1)}>
                  <LinkFileIcon size="20" />
               </IconButton>

               <Spacer size="20px" xAxis />
               <RadioGroup
                  options={ModeOptions}
                  active={isWebBuilderOpen ? 1 : 2}
                  onChange={option => SetIsWebBuilderOpen(!isWebBuilderOpen)}
               />

               <Spacer size="20px" xAxis />
               <ButtonGroup>
                  <IconButton
                     type="ghost"
                     onClick={isWebBuilderOpen ? undoWebBuilder : undoEditor}
                  >
                     <RotateLeftIcon size="20" />
                  </IconButton>
                  <IconButton
                     type="ghost"
                     onClick={isWebBuilderOpen ? redoWebBuilder : redoEditor}
                  >
                     <RotateRightIcon size="20" />
                  </IconButton>
               </ButtonGroup>
               <Spacer size="20px" xAxis />
               {isWebBuilderOpen && (
                  <IconButton type="ghost" onClick={fullscreen}>
                     <ExpandFullIcon size="20" />
                  </IconButton>
               )}
            </Flex>
            <Flex container alignItems="center" justifyContent="space-between">
               {isWebBuilderOpen && (
                  <>
                     <Spacer size="20px" xAxis />
                     <RadioGroup
                        options={deviceOptions}
                        active={1}
                        onChange={option => {
                           setDeviceActive(option.name)
                           deviceManager(option.command)
                        }}
                     />
                  </>
               )}
               <ComboButton type="ghost">
                  <EyeIcon size="16px" />
                  PREVIEW
               </ComboButton>
               <TextButton
                  type="ghost"
                  onClick={() => (isWebBuilderOpen ? saveTemplate() : draft())}
               >
                  SAVE
               </TextButton>
               <TextButton
                  type="solid"
                  onClick={() => setIsModalVisible(!isModalVisible)}
               >
                  PUBLISH
               </TextButton>
            </Flex>
         </EditorOptionsWrapper>
         <LinkFilesTunnel
            tunnels={linkFilesTunnels}
            openTunnel={openLinkFilesTunnel}
            closeTunnel={closeLinkFilesTunnel}
         />
      </>
   )
}

EditorOptions.propTypes = {
   publish: PropTypes.func,
   viewCurrentVersion: PropTypes.func,
}

export default EditorOptions
