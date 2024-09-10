import React from 'react'
import RankingPlain from '../assets/icons/ranking-plain.svg'
import styled, { css } from 'styled-components'
import { twMerge } from 'tailwind-merge';

// import './EarnIcon.css'

interface NavIconProps {
    className?: string
    color?: string

}

const LinkIcon = ({ className, color }: NavIconProps) => {
    return (
        <svg width="50" height="50" viewBox="0 0 68 68" fill={color} xmlns="http://www.w3.org/2000/svg">
            <g id="Clip path group">
                <g mask="url(#mask0_203_315)">
                    <g id="Group">
                        <g id="Clip path group_2">
                            <g mask="url(#mask1_203_315)">
                                <g id="Group_2">
                                    <g id="Group_3">
                                        <path id="Vector (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M14.1667 31.8757C14.1667 27.5712 17.654 24.084 21.9584 24.084C26.2629 24.084 29.7501 27.5712 29.7501 31.8757C29.7501 36.1801 26.2629 39.6673 21.9584 39.6673C17.654 39.6673 14.1667 36.1801 14.1667 31.8757ZM21.9584 28.334C20.0012 28.334 18.4167 29.9184 18.4167 31.8757C18.4167 33.8329 20.0012 35.4173 21.9584 35.4173C23.9156 35.4173 25.5001 33.8329 25.5001 31.8757C25.5001 29.9184 23.9156 28.334 21.9584 28.334Z" fill={color} />
                                        <path id="Vector (Stroke)_2" fill-rule="evenodd" clip-rule="evenodd" d="M36.8335 19.1257C36.8335 14.8212 40.3207 11.334 44.6252 11.334C48.9296 11.334 52.4168 14.8212 52.4168 19.1257C52.4168 23.4301 48.9296 26.9173 44.6252 26.9173C40.3207 26.9173 36.8335 23.4301 36.8335 19.1257ZM44.6252 15.584C42.6679 15.584 41.0835 17.1684 41.0835 19.1257C41.0835 21.0829 42.6679 22.6673 44.6252 22.6673C46.5824 22.6673 48.1668 21.0829 48.1668 19.1257C48.1668 17.1684 46.5824 15.584 44.6252 15.584Z" fill={color} />
                                        <path id="Vector (Stroke)_3" fill-rule="evenodd" clip-rule="evenodd" d="M36.8335 44.6257C36.8335 40.3212 40.3207 36.834 44.6252 36.834C48.9296 36.834 52.4168 40.3212 52.4168 44.6257C52.4168 48.9301 48.9296 52.4173 44.6252 52.4173C40.3207 52.4173 36.8335 48.9301 36.8335 44.6257ZM44.6252 41.084C42.6679 41.084 41.0835 42.6684 41.0835 44.6257C41.0835 46.5829 42.6679 48.1673 44.6252 48.1673C46.5824 48.1673 48.1668 46.5829 48.1668 44.6257C48.1668 42.6684 46.5824 41.084 44.6252 41.084Z" fill={color} />
                                        <path id="Vector (Stroke)_4" fill-rule="evenodd" clip-rule="evenodd" d="M26.4988 27.2396L37.8321 20.1562L40.0846 23.7602L28.7513 30.8436L26.4988 27.2396Z" fill={color} />
                                        <path id="Vector (Stroke)_5" fill-rule="evenodd" clip-rule="evenodd" d="M37.8321 43.5936L26.4988 36.5102L28.7513 32.9062L40.0846 39.9896L37.8321 43.5936Z" fill={color} />
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

export default LinkIcon