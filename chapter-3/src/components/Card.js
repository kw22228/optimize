import React, { useEffect, useRef } from 'react';

function Card(props) {
    /** 이미지 사전 로딩 (Intersection observer) */
    const imgRef = useRef(null);

    useEffect(() => {
        const callback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const previousSibling = target.previousSibling;

                    /** target 지연 로딩 */
                    target.src = target.dataset.src;

                    /** webp 지연 로딩 */
                    if (props.webp) {
                        previousSibling.srcset = previousSibling.dataset.srcset;
                    }
                    observer.unobserve(target); //이미지를 로드 하고부터는 observe할필요없으니 unobserve해준다.
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
            <picture>
                {props.webp && <source data-srcset={props.webp} type="image/webp" />}
                <img data-src={props.image} ref={imgRef} />
            </picture>

            <div className="p-5 font-semibold text-gray-700 text-xl md:text-lg lg:text-xl keep-all">
                {props.children}
            </div>
        </div>
    );
}

export default Card;
