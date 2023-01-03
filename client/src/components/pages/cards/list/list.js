import { useEffect } from 'react';
import PropTypes from 'prop-types';
import CardsTable from './cards-table';

export default function ListPage({ printRef }) {
  useEffect(() => {
    document.title = 'Cards';
  }, []);

  return <CardsTable printRef={printRef} />;
}

ListPage.propTypes = {
  printRef: PropTypes.object
};
