import React from 'react';
import { Table, TableBody, TableHeader, TableRow, TableCell } from 'grommet';

const TalksTable = ({ talks }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell border="bottom" width="350px">
            Charla
          </TableCell>
          <TableCell border="bottom" width="80px">
            Email
          </TableCell>
          <TableCell border="bottom">Orador</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {talks.map((talk) => (
          <TableRow>
            <TableCell width="350px" size="small">
              <strong>{talk.name}</strong>
            </TableCell>
            <TableCell width="80px" size="small">
              {talk.speaker.email}
            </TableCell>
            <TableCell>{talk.speaker.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TalksTable;
