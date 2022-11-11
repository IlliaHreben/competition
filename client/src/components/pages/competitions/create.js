import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../../api-singleton';
import CompetitionForm from '../../ui-components/competition-form';
import styles from './create.module.css';

export default function CompetitionCreate() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Create competition';
  }, []);

  const onCreate = async (payload) => {
    const { data } = await api.competitions.create({
      name: payload.name,
      description: payload.description,
      startDate: payload.startDate,
      endDate: payload.endDate,
      ringsCount: payload.ringsCount,
      tatamisCount: payload.tatamisCount
    });

    navigate(`/competitions/${data.id}/edit?tab=1`);
  };

  return (
    <div className={styles.page}>
      <CompetitionForm handleConfirm={onCreate} withFightSpaces />
    </div>
  );
}
