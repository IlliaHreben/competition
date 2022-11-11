import { TableCell, TableRow, TextField } from '@mui/material';

// eslint-disable-next-line react/prop-types
export default function CategoryRow({ onChange, data }) {
  const onChangeFields = (e, key) => {
    onChange({ ...data, [key]: e.target.value });
  };
  return (
    <TableRow hover role="checkbox" tabIndex={-1}>
      <TableCell padding="checkbox" width={'5%'}></TableCell>

      <TableCell sx={{ pr: 0.5, pl: 1, pt: 1, pb: 1.5 }}>
        <Field onChange={(e) => onChangeFields(e, 'ageFrom')} />
      </TableCell>
      <TableCell sx={{ pr: 0, pl: 0.5, pt: 1, pb: 1.5 }}>
        <Field onChange={(e) => onChangeFields(e, 'ageTo')} />
      </TableCell>
      <TableCell></TableCell>

      <TableCell sx={{ pr: 0.5, pl: 1, pt: 1, pb: 1.5 }}>
        <Field onChange={(e) => onChangeFields(e, 'weightFrom')} />
      </TableCell>
      <TableCell sx={{ pr: 0, pl: 0.5, pt: 1, pb: 1.5 }}>
        <Field onChange={(e) => onChangeFields(e, 'weightTo')} />
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
}

const Field = (props) => {
  return (
    <TextField
      sx={{ maxWidth: '45px' }}
      size="small"
      inputProps={{ maxLength: 5 }}
      max={5}
      variant="standard"
      {...props}
    />
  );
};
