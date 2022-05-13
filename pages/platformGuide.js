import CreateContainer from "../components/CreateContainer";
import ReactPlayer from 'react-player';
import React from 'react'
import styles from '../styles/Video.module.scss';

export default function PlatformGuide() {
  return (
    <>
      <br></br>

      <CreateContainer>

        {  /**
          <video controls>
            <source src="/videos/platformGuide.mp4" type="video/mp4"/>
            <p>Your browser doesn't support HTML5 video. Here is a <a href="/videos/platformGuide.mp4">link to the video</a> instead.</p>
          </video>
        */}

        <div className={styles.video_wrapper}>
          <h2 > Detailed demo on how to launch your nft collection </h2>
          {/*  <ReactPlayer width='100%' height='100%'controls url={"/videos/platformGuide.mp4"} /> */}

          <ReactPlayer width='100%' height='100%'controls url={"https://www.youtube.com/watch?v=goWYhPd0leo&ab_channel=DavidGrilec"} />
        </div>

      </CreateContainer>
    </>
  )
}