import React, { useState, useEffect } from 'react'
import {
   TunnelHeader,
   Tunnels,
   Tunnel,
   ButtonTile,
   Form,
   Spacer,
   Flex,
} from '@dailykit/ui'
import { TunnelBody, ImageContainer } from './styled'
import AssetTunnel from './asset'
import { Tooltip } from '../Tooltip'
import { DeleteIcon } from '../../assets/icons'

const BasicInfo = ({ data, onSave, openTunnel, closeTunnel, tunnels }) => {
   const [info, setInfo] = useState(data || {})
   const afterSave = info => {
      onSave(info)
   }
   useEffect(() => {
      if (data) {
         setInfo(data)
      }
   }, [data])
   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <TunnelHeader
                  title="Add Basic Information"
                  right={{
                     action: () => afterSave(info),
                     title: 'Save',
                  }}
                  close={() => closeTunnel(1)}
               />
               <TunnelBody>
                  <Form.Group>
                     <Form.Label htmlFor="text" title="title">
                        Title
                     </Form.Label>
                     <Form.Text
                        id="title"
                        name="title"
                        value={info.title}
                        placeholder="Enter Title here"
                        onChange={e =>
                           setInfo({ ...info, title: e.target.value })
                        }
                     />
                  </Form.Group>
                  <Spacer size="32px" />
                  <Form.Group>
                     <Form.Label htmlFor="textarea" title="description">
                        Description
                     </Form.Label>
                     <Form.TextArea
                        id="description"
                        name="description"
                        value={info.description}
                        placeholder="Enter Description here"
                        onChange={e =>
                           setInfo({
                              ...info,
                              description: e.target.value,
                           })
                        }
                     />
                  </Form.Group>
                  <Spacer size="32px" />
                  {info.image ? (
                     <ImageContainer>
                        <div>
                           <span
                              role="button"
                              tabIndex="0"
                              onKeyDown={e =>
                                 e.charCode === 13 &&
                                 setInfo({ ...info, image: '' })
                              }
                              onClick={() => setInfo({ ...info, image: '' })}
                           >
                              <DeleteIcon />
                           </span>
                        </div>
                        <img src={info.image} alt="Coupon" />
                     </ImageContainer>
                  ) : (
                     <ButtonTile
                        type="primary"
                        size="sm"
                        text="Add a Photo"
                        helper="upto 1MB - only JPG, PNG, PDF allowed"
                        onClick={() => openTunnel(2)}
                        style={{ margin: '20px 0' }}
                     />
                  )}
               </TunnelBody>
            </Tunnel>
            <Tunnel layer={2}>
               <AssetTunnel
                  onImageSave={image => setInfo({ ...info, image })}
                  closeTunnel={closeTunnel}
               />
            </Tunnel>
         </Tunnels>
      </>
   )
}

export default BasicInfo

// Made by Deepak Negi
