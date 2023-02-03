import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import PhotoList from '../components/PhotoList';
import { fetchPhotos } from '../redux/photos';

function PhotoListContainer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPhotos());
  }, [dispatch]);

  // const { photos, loading } = useSelector(state => {
  //   return {
  //     photos:
  //       state.category.category === 'all'
  //         ? state.photos.data
  //         : state.photos.data.filter(photo => photo.category === state.category.category),
  //     loading: state.photos.loading,
  //   };
  // });

  /** useSelector의 불필요한 리렌더링 문제 해결 2. (Equality Function 옵션 사용하기) */
  // const { photos, loading } = useSelector(
  //   state => ({
  //     photos:
  //       state.category.category === 'all'
  //         ? state.photos.data
  //         : state.photos.data.filter(photo => photo.category === state.category.category),
  //     loading: state.photos.loading,
  //   }),
  //   shallowEqual
  // );

  /**
   * Equality Function 적용후 filter(새로운 배열 반환)으로 부터 생기는 리렌더링 문제 해결.
   * filter메소드로 바로 꺼내지 않고 state.photos.data와 state.category.category를 따로 꺼낸후에 useSelector밖에서 filter하자.
   */
  const { category, allPhotos, loading } = useSelector(
    state => ({
      category: state.category.category,
      allPhotos: state.photos.data,
      loading: state.photos.loading,
    }),
    shallowEqual
  );

  const photos =
    category === 'all' ? allPhotos : allPhotos.filter(photo => photo.category === category);

  if (loading === 'error') {
    return <span>Error!</span>;
  }

  if (loading !== 'done') {
    return <span>loading...</span>;
  }

  return <PhotoList photos={photos} />;
}

export default PhotoListContainer;
