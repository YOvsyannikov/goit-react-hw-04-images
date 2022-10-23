// import { Component } from 'react';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import apiService from '../services';
import Container from './Container';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import LoaderComponent from './LoaderComponent';
import Modal from './Modal';
import ErrorView from './ErrorView';

function App() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!query) return;
    const fetchImages = async () => {
      try {
        const request = await apiService(query, page);
        if (request.length === 0) {
          return setError(`No results were found for ${query}!`);
        }
        setImages(
          images => [...images, ...request.hits],
          setTotal(request.total)
        );
      } catch (error) {
        setError('Something went wrong. Try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [page, query]);

  const searchImages = newSearch => {
    setQuery(newSearch);
    setImages([]);
    setPage(1);
    setError(null);
    setIsLoading(true);
  };

  const onLoadMore = () => {
    setIsLoading(true);
    setPage(page => page + 1);
    scrollPage();
  };

  const onOpenModal = e => {
    setLargeImageURL(e.target.dataset.source);
    toggleModal();
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const scrollPage = () => {
    setTimeout(() => {
      window.scrollBy({
        top: document.documentElement.clientHeight - 160,
        behavior: 'smooth',
      });
    }, 800);
  };

  return (
    <Container>
      <Searchbar onHandleSubmit={searchImages} />

      {error && <ErrorView texterror={error} />}

      {images.length > 0 && !error && (
        <ImageGallery images={images} onOpenModal={onOpenModal} />
      )}

      {isLoading && <LoaderComponent />}

      {!isLoading && images.length > 0 && images.length < total && !error && (
        <Button onLoadMore={onLoadMore} />
      )}

      {showModal && (
        <Modal onToggleModal={toggleModal} largeImageURL={largeImageURL} />
      )}
      <ToastContainer autoClose={3700} />
    </Container>
  );
}

export default App;
