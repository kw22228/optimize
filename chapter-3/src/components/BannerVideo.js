import React, { useEffect, useState } from 'react';
import video from '../assets/banner-video.mp4';
import video_webm from '../assets/_banner-video.webm';

/** Font 다운로드 시점 옵저버 */
import FontFaceObserver from 'fontfaceobserver';
const font = new FontFaceObserver('BMYEONSUNG');

function BannerVideo() {
    /** Font 다운로드 시점 옵저버 */
    const [isFontLoaded, setIsFontLoaded] = useState(false);
    useEffect(() => {
        font.load(null, 20000)
            .then(() => {
                console.log('Font has loaded');
                setIsFontLoaded(true);
            })
            .catch(error => console.log(error));
    }, []);
    return (
        <div className="BannerVideo w-full h-screen overflow-hidden relative bg-texture">
            <div className="absolute h-screen w-full left-1/2">
                {/* <video
                    src={video}
                    className="absolute translateX--1/2 h-screen max-w-none min-w-screen -z-1 bg-black min-w-full min-h-screen"
                    autoPlay
                    loop
                    muted
                /> */}

                {/* 비디오 최적화 (webm) */}
                <video
                    style={{ filter: 'blur(10px)' }}
                    className="absolute translateX--1/2 h-screen max-w-none min-w-screen -z-1 bg-black min-w-full min-h-screen"
                    autoPlay
                    loop
                    muted
                >
                    <source src={video_webm} type="video/webm" />
                    <source src={video} type="video/mp4" />
                </video>
                {/* 비디오 최적화 (webm) */}
            </div>
            <div
                className="w-full h-full flex justify-center items-center"
                style={{
                    opacity: isFontLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                }}
            >
                <div className="text-white text-center">
                    <div className="text-6xl leading-none font-semibold">KEEP</div>
                    <div className="text-6xl leading-none font-semibold">CALM</div>
                    <div className="text-3xl leading-loose">AND</div>
                    <div className="text-6xl leading-none font-semibold">RIDE</div>
                    <div className="text-5xl leading-tight font-semibold">LONGBOARD</div>
                </div>
            </div>
        </div>
    );
}

export default BannerVideo;
