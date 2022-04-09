import Header from "../components/Header";
import CreateContainer from "../components/CreateContainer";
import ReactPlayer from 'react-player';
import React from 'react'


const style = {
  text: `text-white item-align`,

}

export default function PlatformGuide() {
  return (
    <div>
      <Header />

      <CreateContainer>

        {  /**
          <video controls>
            <source src="/videos/platformGuide.mp4" type="video/mp4"/>
            <p>Your browser doesn't support HTML5 video. Here is a <a href="/videos/platformGuide.mp4">link to the video</a> instead.</p>
          </video>
        */}

        <div>
          <h2 className={style.text}> Detailed demo on how to launch your nft collection </h2>
          <ReactPlayer controls url={"/videos/platformGuide.mp4"} />
        </div>

      </CreateContainer>
    </div>
  )
}