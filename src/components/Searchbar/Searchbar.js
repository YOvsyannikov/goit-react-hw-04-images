import PropTypes from 'prop-types';
import s from './Searchbar.module.css';

function Searchbar({ onHandleSubmit }) {
  return (
    <header className={s.header}>
      <form className={s.form} onSubmit={onHandleSubmit}>
        <button type="submit" className={s.btn}>
          <span className={s.label}>Search</span>
        </button>

        <input
          className={s.input}
          name='query'
          type="text"
          // value={value}
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          // onChange={onSearchQueryChange}
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onHandleSubmit: PropTypes.func.isRequired,
  // onSearchQueryChange: PropTypes.func.isRequired,
  // value: PropTypes.string.isRequired,
};

export default Searchbar;
