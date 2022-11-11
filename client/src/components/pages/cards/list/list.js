import { useEffect } from 'react';
import CardsTable from './cards-table';

export default function ListPage() {
  useEffect(() => {
    document.title = 'Cards';
  }, []);

  return <CardsTable />;
}
