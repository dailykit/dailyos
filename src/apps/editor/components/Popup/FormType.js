import React from 'react'
import { Flex, Spacer, TextButton, ButtonGroup, Form } from '@dailykit/ui'
import { Popup } from '../../../../shared/components'
import { useGlobalContext } from '../../context'
import { TreeSelect } from 'antd'
import 'antd/dist/antd.css'

export default function FormType({
   action,
   nodeType,
   setName,
   mutationHandler,
   name,
   treeViewData,
   nodePath,
   setPath,
}) {
   const { globalState, setPopupInfo } = useGlobalContext()
   const { TreeNode } = TreeSelect
   const [selected, setSelected] = React.useState(null)
   const [treeViewNodes, setTreeViewNodes] = React.useState([])
   const nodePathRef = React.useRef('')
   const onChange = value => {
      setSelected(value)
      setPath(value)
   }
   const cancelPopupHandler = () => {
      nodePathRef.current = ''
      setPopupInfo({ formType: false })
   }
   const mutationFunc = () => {
      mutationHandler(action, nodeType.toUpperCase())
      nodePathRef.current = ''
   }

   const stopDot = e => {
      if (e.keyCode === 190 || e.keyCode === 110) {
         e.preventDefault()
      }
   }

   React.useEffect(() => {
      if (treeViewData !== undefined) {
         const result = [
            {
               title: 'Root',
               value: './templates',
            },
            ...treeViewData,
         ]
         setTreeViewNodes(result)
      }
   }, [treeViewData])
   React.useEffect(() => {
      if (nodePath || nodePathRef.current) {
         nodePathRef.current = nodePath
         setSelected(nodePathRef.current)
      }
   }, [nodePath, nodePathRef.current])
   return (
      <Popup show={globalState.popupInfo.formTypePopup}>
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
                        <Spacer size="16px" />
                        <Form.Label>Select the folder to keep it</Form.Label>
                        <TreeSelect
                           showSearch
                           style={{ width: '100%' }}
                           value={selected}
                           dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                           placeholder="Please select"
                           allowClear
                           onChange={onChange}
                           treeData={treeViewNodes}
                        />
                     </Form.Group>
                  </Flex>
                  <Spacer size="16px" />
                  <ButtonGroup>
                     <TextButton type="solid" onClick={mutationFunc}>
                        Create
                     </TextButton>
                     <TextButton type="ghost" onClick={cancelPopupHandler}>
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
                     <TextButton type="solid" onClick={mutationFunc}>
                        Rename
                     </TextButton>
                     <TextButton type="ghost" onClick={cancelPopupHandler}>
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
                     <TextButton type="solid" onClick={mutationFunc}>
                        Yes! delete this {nodeType}
                     </TextButton>
                     <TextButton type="ghost" onClick={cancelPopupHandler}>
                        Cancel
                     </TextButton>
                  </ButtonGroup>
               </Popup.Actions>
            </>
         )}
      </Popup>
   )
}
