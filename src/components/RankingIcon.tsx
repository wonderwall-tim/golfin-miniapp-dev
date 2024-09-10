import React from 'react'
import RankingPlain from '../assets/icons/ranking-plain.svg'
import styled, { css } from 'styled-components'
import { twMerge } from 'tailwind-merge';

// import './EarnIcon.css'

interface NavIconProps {
    className?: string
    color?: string

}

const RankingIcon = ({ className, color }: NavIconProps) => {
    return (
        <svg width="50" height="50" viewBox="0 0 68 68" fill={color} xmlns="http://www.w3.org/2000/svg">
            <g id="Clip path group">
                <g mask="url(#mask0_203_32)">
                    <g id="Group">
                        <g id="Clip path group_2">
                            <g mask="url(#mask1_203_32)">
                                <g id="Group_2">
                                    <g id="Group_3">
                                        <path id="Vector_3" d="M16.5467 21.9731C16.5467 24.2397 14.7192 26.0672 12.4667 26.0672C10.2142 26.0672 8.37256 24.2256 8.37256 21.9731C8.37256 19.7206 10.2001 17.8789 12.4526 17.8789C14.7051 17.8789 16.5326 19.7206 16.5326 21.9731H16.5467Z" fill={color} />
                                        <path id="Vector_4" d="M59.6417 21.9731C59.6417 24.2397 57.8142 26.0672 55.5617 26.0672C53.3092 26.0672 51.4817 24.2256 51.4817 21.9731C51.4817 19.7206 53.3092 17.8789 55.5617 17.8789C57.8142 17.8789 59.6417 19.7206 59.6417 21.9731Z" fill={color} />
                                        <path id="Vector_5" d="M38.0233 12.3246C38.0233 14.5913 36.1958 16.4188 33.9433 16.4188C31.6908 16.4188 29.8633 14.5771 29.8633 12.3246C29.8633 10.0721 31.6908 8.23047 33.9433 8.23047C36.1958 8.23047 38.0233 10.0721 38.0233 12.3246Z" fill={color} />
                                        <path id="Vector_6" d="M51.5243 27.8944L44.9935 28.8435C44.441 28.9144 43.8885 28.7444 43.4635 28.3619L35.1902 20.7544C34.4818 20.1027 33.3768 20.1027 32.6685 20.7544L24.3952 28.3619C23.9843 28.7444 23.4177 28.9144 22.8652 28.8435L16.221 27.8944C14.9318 27.7102 13.841 28.8719 14.1385 30.1469L19.1252 52.6577C19.3093 53.5077 20.0743 54.1169 20.9527 54.1169H45.9993C46.8493 54.1169 47.6002 53.536 47.7985 52.7144L53.5927 30.2177C53.9185 28.9285 52.8418 27.7102 51.5243 27.8944Z" fill={color} />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>

    )
}

export default RankingIcon