import React from 'react'
import {
   Flex,
   Popup,
   Spacer,
   TextButton,
   ButtonGroup,
   Form,
} from '@dailykit/ui'

export default function FormType({
   showPopup,
   action,
   nodeType,
   setName,
   mutationHandler,
   cancelPopup,
   stopDot,
   name,
}) {
   return (
      <Popup show={showPopup}>
         {action !== 'Delete' ? (
            action === 'Create' ? (
               <>
                  <Flex
                     container
                     alignItems="center"
                     justifyContent="space-between"
                  >
                     <Form.Group>
                        <Form.Label htmlFor="name" title="name">
                           Enter {nodeType} Name
                        </Form.Label>
                        <Form.Text
                           id="name"
                           name="name"
                           onChange={e => setName(e.target.value)}
                           value={name}
                           onKeyDown={e => stopDot(e)}
                        />
                     </Form.Group>
                  </Flex>
                  <Spacer size="16px" />
                  <ButtonGroup>
                     <TextButton
                        type="solid"
                        onClick={() =>
                           mutationHandler(action, nodeType.toUpperCase())
                        }
                     >
                        Create
                     </TextButton>
                     <TextButton type="ghost" onClick={cancelPopup}>
                        Cancel
                     </TextButton>
                  </ButtonGroup>
               </>
            ) : (
               <>
                  <Form.Group>
                     <Form.Label htmlFor="name" title="name">
                        Rename {nodeType}
                     </Form.Label>
                     <Form.Text
                        id="name"
                        name="name"
                        onChange={e => setName(e.target.value)}
                        value={name}
                        onKeyDown={e => stopDot(e)}
                     />
                  </Form.Group>
                  <Spacer size="16px" />
                  <ButtonGroup>
                     <TextButton
                        type="solid"
                        onClick={() =>
                           mutationHandler(action, nodeType.toUpperCase())
                        }
                     >
                        Rename
                     </TextButton>
                     <TextButton type="ghost" onClick={cancelPopup}>
                        Cancel
                     </TextButton>
                  </ButtonGroup>
               </>
            )
         ) : (
            <>
               <Popup.Text type="danger">
                  Are you sure you want to delete this {nodeType}!
               </Popup.Text>
               <Popup.Actions>
                  <ButtonGroup align="left">
                     <TextButton
                        type="solid"
                        onClick={() =>
                           mutationHandler(action, nodeType.toUpperCase())
                        }
                     >
                        Yes! delete this {nodeType}
                     </TextButton>
                     <TextButton type="ghost" onClick={cancelPopup}>
                        Cancel
                     </TextButton>
                  </ButtonGroup>
               </Popup.Actions>
            </>
         )}
      </Popup>
   )
}
