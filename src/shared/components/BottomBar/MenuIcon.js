import React from 'react'
import styled from 'styled-components'

const MenuIcon = ({ isOpen }) => {
   return (
      <>
         {isOpen ? (
            <svg
               width="130"
               height="42"
               viewBox="0 0 130 42"
               fill="none"
               xmlns="http://www.w3.org/2000/svg"
            >
               <g clip-path="url(#clip0)">
                  <g filter="url(#filter0_ddddii)">
                     <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M75.1981 34C78.1516 31.2605 80 27.3461 80 23C80 14.7157 73.2843 8 65 8C56.7157 8 50 14.7157 50 23C50 27.3461 51.8484 31.2605 54.8019 34H33.6788C28.0088 34 22.7798 37.0582 20 42H110C106.89 37.0233 101.435 34 95.566 34H75.1981Z"
                        fill="white"
                     />
                  </g>
                  <g filter="url(#filter1_ddiiii)">
                     <circle cx="65" cy="23" r="11" fill="white" />
                  </g>
                  <path
                     fill-rule="evenodd"
                     clip-rule="evenodd"
                     d="M65.0005 26.958L68.854 23.1045C69.0493 22.9092 69.0493 22.5926 68.854 22.3973C68.6588 22.2021 68.3422 22.2021 68.1469 22.3973L65.0005 25.5438L61.854 22.3973C61.6588 22.2021 61.3422 22.2021 61.1469 22.3973C60.9517 22.5926 60.9517 22.9092 61.1469 23.1045L65.0005 26.958Z"
                     fill="#919699"
                  />
                  <path
                     fill-rule="evenodd"
                     clip-rule="evenodd"
                     d="M67.0892 20.8042L65.0005 22.5791L62.9118 20.8042C62.6967 20.6214 62.6967 20.3055 62.9118 20.1227C63.1028 19.9605 63.3982 19.9605 63.5892 20.1227L65.0005 21.3221L66.4118 20.1227C66.6028 19.9605 66.8982 19.9605 67.0892 20.1227C67.3043 20.3055 67.3043 20.6214 67.0892 20.8042Z"
                     fill="#919699"
                  />
               </g>
               <defs>
                  <filter
                     id="filter0_ddddii"
                     x="5"
                     y="-7"
                     width="123"
                     height="67"
                     filterUnits="userSpaceOnUse"
                     color-interpolation-filters="sRGB"
                  >
                     <feFlood flood-opacity="0" result="BackgroundImageFix" />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                     />
                     <feOffset dx="5" dy="5" />
                     <feGaussianBlur stdDeviation="6.5" />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0.9 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                     />
                     <feOffset dx="-5" dy="-5" />
                     <feGaussianBlur stdDeviation="5" />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="effect1_dropShadow"
                        result="effect2_dropShadow"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                     />
                     <feOffset dx="5" dy="-5" />
                     <feGaussianBlur stdDeviation="5" />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0.2 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="effect2_dropShadow"
                        result="effect3_dropShadow"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                     />
                     <feOffset dx="-5" dy="5" />
                     <feGaussianBlur stdDeviation="5" />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0.2 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="effect3_dropShadow"
                        result="effect4_dropShadow"
                     />
                     <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect4_dropShadow"
                        result="shape"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                     />
                     <feOffset dx="-1" dy="-1" />
                     <feGaussianBlur stdDeviation="1" />
                     <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                     />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0.5 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect5_innerShadow"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                     />
                     <feOffset dx="1" dy="1" />
                     <feGaussianBlur stdDeviation="1" />
                     <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                     />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="effect5_innerShadow"
                        result="effect6_innerShadow"
                     />
                  </filter>
                  <filter
                     id="filter1_ddiiii"
                     x="51"
                     y="9"
                     width="28"
                     height="28"
                     filterUnits="userSpaceOnUse"
                     color-interpolation-filters="sRGB"
                  >
                     <feFlood flood-opacity="0" result="BackgroundImageFix" />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                     />
                     <feOffset dx="-1" dy="-1" />
                     <feGaussianBlur stdDeviation="1" />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0.5 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                     />
                     <feOffset dx="1" dy="1" />
                     <feGaussianBlur stdDeviation="1" />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="effect1_dropShadow"
                        result="effect2_dropShadow"
                     />
                     <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect2_dropShadow"
                        result="shape"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                     />
                     <feOffset dx="3" dy="3" />
                     <feGaussianBlur stdDeviation="4" />
                     <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                     />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0.9 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect3_innerShadow"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                     />
                     <feOffset dx="-3" dy="-3" />
                     <feGaussianBlur stdDeviation="3" />
                     <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                     />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="effect3_innerShadow"
                        result="effect4_innerShadow"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                     />
                     <feOffset dx="3" dy="-3" />
                     <feGaussianBlur stdDeviation="3" />
                     <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                     />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0.2 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="effect4_innerShadow"
                        result="effect5_innerShadow"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                     />
                     <feOffset dx="-3" dy="3" />
                     <feGaussianBlur stdDeviation="3" />
                     <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                     />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0.2 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="effect5_innerShadow"
                        result="effect6_innerShadow"
                     />
                  </filter>
                  <clipPath id="clip0">
                     <rect width="130" height="42" fill="white" />
                  </clipPath>
               </defs>
            </svg>
         ) : (
            <svg
               width="130"
               height="42"
               viewBox="0 0 130 42"
               fill="none"
               xmlns="http://www.w3.org/2000/svg"
            >
               <g clip-path="url(#clip0)">
                  <rect width="130" height="42" fill="white" />
                  <g filter="url(#filter0_ddddii)">
                     <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M75.1981 34C78.1516 31.2605 80 27.3461 80 23C80 14.7157 73.2843 8 65 8C56.7157 8 50 14.7157 50 23C50 27.3461 51.8484 31.2605 54.8019 34H33.6788C28.0088 34 22.7798 37.0582 20 42H110C106.89 37.0233 101.435 34 95.566 34H75.1981Z"
                        fill="white"
                     />
                  </g>
                  <g filter="url(#filter1_ddiiii)">
                     <circle cx="65" cy="23" r="11" fill="white" />
                  </g>
                  <path
                     fill-rule="evenodd"
                     clip-rule="evenodd"
                     d="M65.0005 20.001L68.854 23.8545C69.0493 24.0498 69.0493 24.3664 68.854 24.5616C68.6588 24.7569 68.3422 24.7569 68.1469 24.5616L65.0005 21.4152L61.854 24.5616C61.6588 24.7569 61.3422 24.7569 61.1469 24.5616C60.9517 24.3664 60.9517 24.0498 61.1469 23.8545L65.0005 20.001Z"
                     fill="#919699"
                  />
                  <path
                     fill-rule="evenodd"
                     clip-rule="evenodd"
                     d="M67.0892 26.1548L65.0005 24.3799L62.9118 26.1548C62.6967 26.3376 62.6967 26.6534 62.9118 26.8362C63.1028 26.9985 63.3982 26.9985 63.5892 26.8362L65.0005 25.6369L66.4118 26.8362C66.6028 26.9985 66.8982 26.9985 67.0892 26.8362C67.3043 26.6534 67.3043 26.3376 67.0892 26.1548Z"
                     fill="#919699"
                  />
               </g>
               <defs>
                  <filter
                     id="filter0_ddddii"
                     x="5"
                     y="-7"
                     width="123"
                     height="67"
                     filterUnits="userSpaceOnUse"
                     color-interpolation-filters="sRGB"
                  >
                     <feFlood flood-opacity="0" result="BackgroundImageFix" />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                     />
                     <feOffset dx="5" dy="5" />
                     <feGaussianBlur stdDeviation="6.5" />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0.9 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                     />
                     <feOffset dx="-5" dy="-5" />
                     <feGaussianBlur stdDeviation="5" />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="effect1_dropShadow"
                        result="effect2_dropShadow"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                     />
                     <feOffset dx="5" dy="-5" />
                     <feGaussianBlur stdDeviation="5" />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0.2 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="effect2_dropShadow"
                        result="effect3_dropShadow"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                     />
                     <feOffset dx="-5" dy="5" />
                     <feGaussianBlur stdDeviation="5" />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0.2 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="effect3_dropShadow"
                        result="effect4_dropShadow"
                     />
                     <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect4_dropShadow"
                        result="shape"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                     />
                     <feOffset dx="-1" dy="-1" />
                     <feGaussianBlur stdDeviation="1" />
                     <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                     />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0.5 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect5_innerShadow"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                     />
                     <feOffset dx="1" dy="1" />
                     <feGaussianBlur stdDeviation="1" />
                     <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                     />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="effect5_innerShadow"
                        result="effect6_innerShadow"
                     />
                  </filter>
                  <filter
                     id="filter1_ddiiii"
                     x="51"
                     y="9"
                     width="28"
                     height="28"
                     filterUnits="userSpaceOnUse"
                     color-interpolation-filters="sRGB"
                  >
                     <feFlood flood-opacity="0" result="BackgroundImageFix" />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                     />
                     <feOffset dx="-1" dy="-1" />
                     <feGaussianBlur stdDeviation="1" />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0.5 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                     />
                     <feOffset dx="1" dy="1" />
                     <feGaussianBlur stdDeviation="1" />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="effect1_dropShadow"
                        result="effect2_dropShadow"
                     />
                     <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect2_dropShadow"
                        result="shape"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                     />
                     <feOffset dx="3" dy="3" />
                     <feGaussianBlur stdDeviation="4" />
                     <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                     />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0.9 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect3_innerShadow"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                     />
                     <feOffset dx="-3" dy="-3" />
                     <feGaussianBlur stdDeviation="3" />
                     <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                     />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="effect3_innerShadow"
                        result="effect4_innerShadow"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                     />
                     <feOffset dx="3" dy="-3" />
                     <feGaussianBlur stdDeviation="3" />
                     <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                     />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0.2 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="effect4_innerShadow"
                        result="effect5_innerShadow"
                     />
                     <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                     />
                     <feOffset dx="-3" dy="3" />
                     <feGaussianBlur stdDeviation="3" />
                     <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                     />
                     <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0 0.85098 0 0 0 0.2 0"
                     />
                     <feBlend
                        mode="normal"
                        in2="effect5_innerShadow"
                        result="effect6_innerShadow"
                     />
                  </filter>
                  <clipPath id="clip0">
                     <rect width="130" height="42" fill="white" />
                  </clipPath>
               </defs>
            </svg>
         )}
      </>
   )
}

export default MenuIcon
