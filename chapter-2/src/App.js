import React, { lazy, Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import InfoTable from './components/InfoTable';
import SurveyChart from './components/SurveyChart';
import Footer from './components/Footer';

// import ImageModal from './components/ImageModal'

const LazyImageModal = lazy(() => import('./components/ImageModal'));

function App() {
    const [showModal, setShowModal] = useState(false);

    /** 1. 마우스오버 할 때 사전로딩 */
    const handleMouseEnter = () => {
        const modalComponent = import('./components/ImageModal');
    };

    /** 2. 모든 컴포넌트들의 마운트가 끝난 후 사전로딩 */
    /** Image 객체를 이용한 이미지 사전 로딩 */
    useEffect(() => {
        const modalComponent = import('./components/ImageModal');

        /** 이미지 사전 로딩 */
        const img = new Image();
        img.src =
            'https://stillmed.olympic.org/media/Photos/2016/08/20/part-1/20-08-2016-Football-Men-01.jpg?interpolation=lanczos-none&resize=*:800';
    }, []);

    return (
        <div className="App">
            <Header />
            <InfoTable />
            <ButtonModal
                onClick={() => {
                    setShowModal(true);
                }}
                // onMouseEnter={handleMouseEnter}
            >
                올림픽 사진 보기
            </ButtonModal>
            <SurveyChart />
            <Footer />
            <Suspense fallback={null}>
                {showModal ? (
                    <LazyImageModal
                        closeModal={() => {
                            setShowModal(false);
                        }}
                    />
                ) : null}
            </Suspense>
        </div>
    );
}

const ButtonModal = styled.button`
    border-radius: 30px;
    border: 1px solid #999;
    padding: 12px 30px;
    background: none;
    font-size: 1.1em;
    color: #555;
    outline: none;
    cursor: pointer;
`;

export default App;
