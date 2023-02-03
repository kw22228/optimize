import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import ImageModal from '../components/ImageModal';

function ImageModalContainer() {
  // const { modalVisible, bgColor, src, alt } = useSelector(state => {
  //   return {
  //     modalVisible: state.imageModal.modalVisible,
  //     bgColor: state.imageModal.bgColor,
  //     src: state.imageModal.src,
  //     alt: state.imageModal.alt,
  //   };
  // });

  /** useSelector의 불필요한 리렌더링 문제 해결 1. (반환값을 원시타입으로 나누기) */
  // const modalVisible = useSelector(state => state.imageModal.modalVisible);
  // const bgColor = useSelector(state => state.imageModal.bgColor);
  // const src = useSelector(state => state.imageModal.src);
  // const alt = useSelector(state => state.imageModal.alt);

  /** useSelector의 불필요한 리렌더링 문제 해결 2. (Equality Function 옵션 사용하기) */
  const { modalVisible, bgColor, src, alt } = useSelector(
    state => ({
      modalVisible: state.imageModal.modalVisible,
      bgColor: state.imageModal.bgColor,
      src: state.imageModal.src,
      alt: state.imageModal.alt,
    }),
    shallowEqual
  );
  return <ImageModal modalVisible={modalVisible} bgColor={bgColor} src={src} alt={alt} />;
}

export default ImageModalContainer;
