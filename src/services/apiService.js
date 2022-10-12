import axios from 'axios';

const apiService = async (query, page) => {
  const { data } = await axios.get(
    `https://pixabay.com/api/?q=${query}&page=${page}&key=29560891-792771529aa052fb706988eec&image_type=photo&orientation=horizontal&per_page=12`
  );
  return data.hits;
};

export default apiService;
