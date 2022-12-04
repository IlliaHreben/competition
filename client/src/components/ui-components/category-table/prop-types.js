import { PropTypes } from 'prop-types';

export const categoryPropTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    sex: PropTypes.string.isRequired,
    ageFrom: PropTypes.number.isRequired,
    ageTo: PropTypes.number.isRequired,
    weightFrom: PropTypes.number.isRequired,
    weightTo: PropTypes.number.isRequired,
    weightName: PropTypes.string.isRequired,
    group: PropTypes.oneOf(['A', 'B', null]),
    linked: PropTypes.shape({
      fights: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          degree: PropTypes.number.isRequired,
          orderNumber: PropTypes.number.isRequired,
          firstCardId: PropTypes.string,
          secondCardId: PropTypes.string,
          winnerId: PropTypes.string,
          nextFightId: PropTypes.string,
          categoryId: PropTypes.string.isRequired,
          fightSpaceId: PropTypes.string,
          executedAt: PropTypes.string,
          linked: PropTypes.shape({
            cards: PropTypes.arrayOf(
              PropTypes.shape({
                id: PropTypes.string.isRequired,
                fighterId: PropTypes.number.isRequired,
                section: PropTypes.string.isRequired,
                weight: PropTypes.number.isRequired,
                birthDate: PropTypes.string.isRequired,
                age: PropTypes.number.isRequired,
                linked: PropTypes.shape({
                  fighter: PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    name: PropTypes.string.isRequired,
                    lastName: PropTypes.string.isRequired,
                    sex: PropTypes.string.isRequired,
                    clubId: PropTypes.number.isRequired,
                    secondaryClubId: PropTypes.string,
                    coachId: PropTypes.string.isRequired
                  }).isRequired,
                  club: PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    name: PropTypes.string.isRequired
                  }).isRequired,
                  coach: PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    name: PropTypes.string.isRequired,
                    lastName: PropTypes.string.isRequired
                  }).isRequired
                }).isRequired
              })
            )
          }).isRequired
        })
      ).isRequired,
      section: PropTypes.object.isRequired
    }).isRequired
  }).isRequired,
  openCardSettings: PropTypes.func.isRequired,
  // selectedCardToMove: PropTypes.shape({
  //   id: PropTypes.string.isRequired
  // }),
  openCategorySettings: PropTypes.func.isRequired
};
