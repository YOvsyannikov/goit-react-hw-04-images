import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiService from '../services';
import Container from './Container';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import LoaderComponent from './LoaderComponent';
import Modal from './Modal';
import ErrorView from './ErrorView';

class App extends Component {
  state = {
    query: '',
    images: [],
    largeImageURL: '',
    page: 1,
    error: null,
    isLoading: false,
    showModal: false,
  };

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.query !== this.state.query) {
      this.setState({ images: [], page: 1, error: null });
    }
  }

  searchImages = async () => {
    const { query, page } = this.state;

    if (query.trim() === '') {
      return toast.info('😱 Please enter a value for search images!');
    }

    this.toggleLoader();

    try {
      const request = await apiService(query, page);
      this.setState(({ images, page }) => ({
        images: [...images, ...request],
        page: page + 1,
      }));
      if (request.length === 0) {
        this.setState({ error: `No results were found for ${query}!` });
      }
    } catch (error) {
      this.setState({ error: 'Something went wrong. Try again.' });
    } finally {
      this.toggleLoader();
    }
  };

  handleChange = e => {
    this.setState({ query: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.searchImages();
  };

  onLoadMore = () => {
    this.searchImages();
    this.scrollPage();
  };

  onOpenModal = e => {
    this.setState({ largeImageURL: e.target.dataset.source });
    this.toggleModal();
  };

  toggleLoader = () => {
    this.setState(({ isLoading }) => ({
      isLoading: !isLoading,
    }));
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  scrollPage = () => {
    setTimeout(() => {
      window.scrollBy({
        top: document.documentElement.clientHeight - 160,
        behavior: 'smooth',
      });
    }, 1000);
  };

  render() {
    const { query, images, largeImageURL, isLoading, showModal, error } =
      this.state;
    return (
      <Container>
        <Searchbar
          onHandleSubmit={this.handleSubmit}
          onSearchQueryChange={this.handleChange}
          value={query}
        />

        {error && <ErrorView texterror={error} />}

        {images.length > 0 && !error && (
          <ImageGallery images={images} onOpenModal={this.onOpenModal} />
        )}

        {isLoading && <LoaderComponent />}

        {!isLoading && images.length >= 12 && !error && (
          <Button onLoadMore={this.onLoadMore} />
        )}

        {showModal && (
          <Modal
            onToggleModal={this.toggleModal}
            largeImageURL={largeImageURL}
          />
        )}
        <ToastContainer autoClose={3700} />
      </Container>
    );
  }
}

export default App;
