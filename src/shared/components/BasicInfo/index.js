import React, { useState, useEffect } from 'react'
import { TunnelHeader, Input, Tunnels, Tunnel, ButtonTile } from '@dailykit/ui'
import { TunnelBody, StyledRow, ImageContainer } from './styled'
import AssetTunnel from './asset'
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
                  <StyledRow>
                     <Input
                        type="text"
                        label="Title"
                        name="text"
                        rows="5"
                        value={info.title}
                        onChange={e =>
                           setInfo({ ...info, title: e.target.value })
                        }
                     />
                  </StyledRow>
                  <StyledRow>
                     <Input
                        type="textarea"
                        label="Description"
                        name="textarea"
                        rows="5"
                        value={info.description}
                        onChange={e =>
                           setInfo({
                              ...info,
                              description: e.target.value,
                           })
                        }
                     />
                  </StyledRow>
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
