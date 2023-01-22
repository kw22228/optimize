import React, { useEffect, useRef } from 'react';

function Card(props) {
  /** 이미지 사전 로딩 (Intersection observer) */
  const imgRef = useRef(null);

  useEffect(() => {
    const callback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('is intersecting', entry.target.dataset.src);
          entry.target.src = entry.target.dataset.src;
          observer.unobserve(entry.target); //이미지를 로드 하고부터는 observe할필요없으니 unobserve해준다.
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    });
    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="Card text-center">
      <img data-src={props.image} ref={imgRef} />
      <div className="p-5 font-semibold text-gray-700 text-xl md:text-lg lg:text-xl keep-all">
        {props.children}
      </div>
    </div>
  );
}

export default Card;
