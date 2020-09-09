import React, { useState } from 'react'
import { TunnelHeader, Input, useTunnel } from '@dailykit/ui'
import { TunnelBody, StyledRow, ImageContainer } from './styled'
import AssetTunnel from './asset'
import { DeleteIcon } from '../../assets/icons'

const BasicInfo = ({ data, onSave, open, close }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel()
   const [busy, setBusy] = useState(false)
   const [info, setInfo] = useState(data || {})
   const afterSave = info => {
      if (busy) return
      setBusy(true)
      onSave(info)
   }
   return (
      <>
         <TunnelHeader
            title="Add Basic Information"
            right={{
               action: () => afterSave(info),
               title: busy ? 'Saving' : 'Save',
            }}
            close={() => close(1)}
         />
         <TunnelBody>
            <StyledRow>
               <Input
                  type="text"
                  label="Title"
                  name="text"
                  rows="5"
                  value={info.title}
                  onChange={e => setInfo({ ...info, title: e.target.value })}
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
                           e.charCode === 13 && setInfo({ ...info, image: '' })
                        }
                        onClick={() => setInfo({ ...info, image: '' })}
                     >
                        <DeleteIcon />
                     </span>
                  </div>
                  <img src={info.image} alt="Coupon" />
               </ImageContainer>
            ) : (
               <AssetTunnel
                  onImageSave={image => setInfo({ ...info, image })}
                  open={() => openTunnel(1)}
               />
            )}
         </TunnelBody>
      </>
   )
}

export default BasicInfo

// Made by Deepak Negi
