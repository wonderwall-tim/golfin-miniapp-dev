import Title from '../components/titleComponent/title'
import { Page } from 'konsta/react'
import { socialMediaLinks } from '../constants'
import { Utils } from '@telegram-apps/sdk';

interface LinkPageProp {
  utils?: Utils
}
const Links = ({ utils }: LinkPageProp) => {
  return (
    <div className='home-screen-slogan-container'>
      <Page>
        <div className='mt-[100px]'>
          <Title titlename='LINKS' />
          <div className='mt-10'>
            {socialMediaLinks.map((socialMedia, index) => {
              return (
                <div
                  key={index}
                  className={`${index == 0 ?
                    `justify-center items-center text-start cursor-pointer pt-5` :
                    `justify-center text-start items-center cursor-pointer`} `}
                  onClick={() => {
                    window.alert('click')
                    if (import.meta.env.VITE_MINI_APP_ENV == 'test') {
                      window.open(socialMedia.url, '_blank')
                    }
                    else {
                      if (utils !== undefined) {
                        utils.openLink(socialMedia.url, { tryInstantView: true })
                      } else {
                        window.open(socialMedia.url, '_blank')
                      }
                    }

                  }}>
                  <div className='flex flex-row justify-center'>
                    <div className='scale-140 mb-15 mx-7'> {socialMedia.icon}</div>
                    <div className='mx-4 my-1 font-[700] tracking-wider w-[200px] text-white leading-tight text-2xl'>
                      <div className='leading-2'>{socialMedia.cto}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Page >

    </div >
  )
}

export default Links