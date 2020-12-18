import styled from 'styled-components'

export const StyledDiv = styled.div`
   border: 2px solid #444;
   grid-area: main;
   #gjs {
      border: none;
   }

   /* Reset some default styling */
   .gjs-cv-canvas {
      top: 0;
      width: 100%;
      height: 100%;
   }
   .gjs-cstmBlock {
      width: auto;
      height: auto;
      min-height: auto;
   }

   .panel__top {
      padding: 0;
      width: 100%;
      display: flex;
      position: initial;
      justify-content: center;
      justify-content: space-between;
   }
   .panel__basic-actions {
      position: initial;
   }

   .editor-row {
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      flex-wrap: nowrap;
      height: 86vh;
   }

   .editor-canvas {
      flex-grow: 1;
   }

   .panel__left {
      flex-basis: 230px;
      position: relative;
      overflow-y: auto;
   }

   .panel__switcher {
      position: initial;
   }

   .panel__devices {
      position: initial;
   }

   .gjs-one-bg {
      background-color: white;
   }

   /* Secondary color for the text color */
   .gjs-two-color {
      color: black;
   }

   /* Tertiary color for the background */
   .gjs-three-bg {
      background: white;
      color: black;
   }

   /* Quaternary color for the text color */
   .gjs-four-color,
   .gjs-four-color-h:hover {
      color: black;
   }
`
