import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { setBgColor, showModal } from '../redux/imageModal';

import LazyLoad from 'react-lazyload';
import { getAverageColorOfImage } from '../utils/getAverageColorOfImage';

function PhotoItem({ photo: { urls, alt } }) {
  const dispatch = useDispatch();

  const openModal = e => {
    dispatch(showModal({ src: urls.full, alt }));

    /** 섬네일 이미지로 배경색 계산 후, 리덕스에 저장 (이쪽은 small이미지를 사용하고 있음.) */
    const averageColor = getAverageColorOfImage(e.target);
    dispatch(setBgColor(averageColor));
  };

  return (
    <ImageWrap>
      {/* 컴포넌트 지연 로딩 */}
      <LazyLoad
        offset={1000} //1000px 위에서 로딩 시작
      >
        <Image //
          src={urls.small + '&t=' + new Date().getTime()}
          alt={alt}
          onClick={openModal}
          crossOrigin="*"
        />
      </LazyLoad>
      {/* 컴포넌트 지연 로딩 */}
    </ImageWrap>
  );
}

// const ImageWrap = styled.div``;

// const Image = styled.img`
//   cursor: pointer;
//   width: 100%;
// `;

/** 레이아웃 이동 해결 (padding을 사용하여 비율로 공간을 잡음) */
const ImageWrap = styled.div`
  width: 100%;
  padding-bottom: 56.25%; // 16:9
  position: relative;
`;

const Image = styled.img`
  cursor: pointer;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

export default PhotoItem;
