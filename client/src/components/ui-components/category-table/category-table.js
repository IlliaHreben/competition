import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';

import styles from './category-table.module.css';
import { formatISODate, getFormattedDate } from '../../../utils/datetime';

function dumpCategoryData (category) {
    const { fights, cards } = category.linked;
    const cardsData = fights.length
        ? fights.flatMap(f => ([ {
            ...f.linked.firstCard,
            fight   : f,
            isFirst : true
        }, {
            ...f.linked.secondCard,
            fight   : f,
            isFirst : false
        }
        ]))
        : cards;

    return cardsData.map(dumpCardData).sort((a, b) => a.number - b.number);
}

function dumpCardData (card) {
    const isFirst = card.isFirst;
    const fighter = card.linked?.fighter;
    const coach = card.linked?.fighter?.linked.coach;
    const club = card.linked?.fighter?.linked.club;

    return {
        date       : card.fight && getFormattedDate(), // TODO
        degree     : card.fight ? `1/${card.fight.degree}` : '',
        color      : isFirst !== undefined ? (isFirst ? 'red' : 'blue') : '',
        number     : card.fight ? (card.fight.orderNumber * 2 - +isFirst) : 1,
        fullName   : getFullName(fighter),
        sex        : fighter?.sex || '',
        settlement : club?.linked?.settlement?.name || '',
        club       : club?.name || '',
        coach      : getFullName(coach),
        age        : card.age || '',
        birthDate  : card.birthDate ? formatISODate(card.birthDate) : '',
        weight     : card.weight || ''
    };
}

function getFullName (fighter) {
    return fighter ? `${fighter?.name} ${fighter?.lastName}` : '';
}

function CategoryTable ({ category }) {
    const rows = dumpCategoryData(category);
    return (
        <TableContainer component={Paper} >
            <Table sx={{ minWidth: 200 }} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell
                            className={styles.tableCategoryDesc}
                            colSpan={12}
                            align="center"
                        >
                            {`${category.linked.section.name} in: ${category.sex}'s ${category.ageFrom} - ${category.ageTo} years, weight category ${category.weightName}`}
                        </TableCell>
                    </TableRow>
                    <TableRow className={styles.tableHeadDesc}>
                        <TableCell>Date</TableCell>
                        <TableCell align="left">Degree</TableCell>
                        <TableCell align="center">Corner</TableCell>
                        <TableCell align="left">№</TableCell>
                        <TableCell align="left">Full name</TableCell>
                        <TableCell align="left">City</TableCell>
                        <TableCell align="center">Sex</TableCell>
                        <TableCell align="left">Club</TableCell>
                        <TableCell align="left">Coach</TableCell>
                        <TableCell align="center">Age</TableCell>
                        <TableCell align="left">Birthday</TableCell>
                        <TableCell align="left">Weight</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow className={styles.tableRow}
                            key={row.number}
                            // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            {(row.number % 2)
                                ? <TableCell rowSpan={2} component="th" scope="row">{row.date}</TableCell>
                                : null
                            }
                            {(row.number % 2)
                                ? <TableCell rowSpan={2} align="left">{row.degree}</TableCell>
                                : null
                            }
                            <TableCell align="center">{row.color}</TableCell>
                            <TableCell align="left">{row.number}</TableCell>
                            <TableCell align="left">{row.fullName}</TableCell>
                            <TableCell align="left">{row.settlement}</TableCell>
                            <TableCell align="center">{row.sex}</TableCell>
                            <TableCell align="left">{row.club}</TableCell>
                            <TableCell align="left">{row.coach}</TableCell>
                            <TableCell align="center">{row.age}</TableCell>
                            <TableCell align="left">{row.birthDate}</TableCell>
                            <TableCell align="left">{row.weight}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

CategoryTable.propTypes = {
    category: PropTypes.shape({
        id         : PropTypes.string.isRequired,
        sex        : PropTypes.string.isRequired,
        ageFrom    : PropTypes.number.isRequired,
        ageTo      : PropTypes.number.isRequired,
        weightFrom : PropTypes.number.isRequired,
        weightTo   : PropTypes.number.isRequired,
        weightName : PropTypes.string.isRequired,
        group      : PropTypes.oneOf([ 'A', 'B', null ]),
        linked     : PropTypes.shape({
            fights: PropTypes.arrayOf(PropTypes.shape({
                id           : PropTypes.string.isRequired,
                degree       : PropTypes.number.isRequired,
                orderNumber  : PropTypes.number.isRequired,
                firstCardId  : PropTypes.string,
                secondCardId : PropTypes.string,
                winnerId     : PropTypes.string,
                nextFightId  : PropTypes.string,
                categoryId   : PropTypes.string.isRequired,
                fightSpaceId : PropTypes.string,
                executedAt   : PropTypes.string,
                linked       : PropTypes.shape({
                    cards: PropTypes.arrayOf(PropTypes.shape({
                        id        : PropTypes.string.isRequired,
                        fighterId : PropTypes.number.isRequired,
                        section   : PropTypes.string.isRequired,
                        weight    : PropTypes.number.isRequired,
                        birthDate : PropTypes.string.isRequired,
                        age       : PropTypes.number.isRequired,
                        linked    : PropTypes.shape({
                            fighter: PropTypes.shape({
                                id              : PropTypes.string.isRequired,
                                name            : PropTypes.string.isRequired,
                                lastName        : PropTypes.string.isRequired,
                                sex             : PropTypes.string.isRequired,
                                clubId          : PropTypes.number.isRequired,
                                secondaryClubId : PropTypes.string,
                                coachId         : PropTypes.string.isRequired
                            }).isRequired,
                            club: PropTypes.shape({
                                id   : PropTypes.string.isRequired,
                                name : PropTypes.string.isRequired
                            }).isRequired,
                            coach: PropTypes.shape({
                                id       : PropTypes.string.isRequired,
                                name     : PropTypes.string.isRequired,
                                lastName : PropTypes.string.isRequired
                            }).isRequired
                        }).isRequired
                    }))
                }).isRequired
            })).isRequired,
            section: PropTypes.object.isRequired
        }).isRequired
    }).isRequired
};

export default CategoryTable;
