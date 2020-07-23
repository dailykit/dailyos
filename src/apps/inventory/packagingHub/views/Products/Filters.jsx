import React from 'react'
import styled from 'styled-components'
import { SearchBox, Checkbox } from '@dailykit/ui'

import { FlexContainer } from '../../../views/Forms/styled'

export default function Filters() {
   return (
      <Wrapper>
         <Section>
            <h5 style={{ color: '#00A7E1' }}>Filters</h5>
         </Section>

         <Section>
            <SectionHeader>
               <p>Sizes</p>
            </SectionHeader>

            <SearchBox placeholder="Search" value={''} onChange={() => {}} />
         </Section>

         <Section>
            <SectionHeader>
               <p>Packaging material</p>
            </SectionHeader>
         </Section>

         <Section>
            <Checkbox id="label" checked={false} onChange={() => {}}>
               FDA Complaint
            </Checkbox>
         </Section>

         <Section>
            <Checkbox id="label" checked={false} onChange={() => {}}>
               Recyclable
            </Checkbox>
         </Section>

         <Section>
            <Checkbox id="label" checked={false} onChange={() => {}}>
               Compostable
            </Checkbox>
         </Section>
         <Section>
            <Checkbox id="label" checked={false} onChange={() => {}}>
               Water Resistant
            </Checkbox>
            <br />
            <Checkbox id="label" checked={false} onChange={() => {}}>
               Inner Water Resistant
            </Checkbox>
            <br />
            <Checkbox id="label" checked={false} onChange={() => {}}>
               Outer Water Resistant
            </Checkbox>
         </Section>

         <Section>
            <Checkbox id="label" checked={false} onChange={() => {}}>
               Grease Resistant
            </Checkbox>
         </Section>
         <Section>
            <Checkbox id="label" checked={false} onChange={() => {}}>
               Compressable
            </Checkbox>
         </Section>
      </Wrapper>
   )
}
const Wrapper = styled.div`
   flex: 1;
`
const Section = styled.div`
   padding: 16px;
   background-color: #f3f3f3;
   width: 90%;

   border: 1px solid #fff;

   h5 {
      font-size: 14px;
      font-weight: 500;
   }

   p {
      font-size: 12px;
      color: #888d9d;
   }
`

const SectionHeader = styled(FlexContainer)`
   align-items: center;
   justify-content: space-between;
   margin-bottom: 4px;
`
