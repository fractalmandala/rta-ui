<script lang="ts">
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableColumnHeader,
    TableFooter,
    TableHeader,
    TableRow,
    TableScrollArea,
  } from '../../lib/index';
</script>

<Table>
  <TableCaption>Recent invoices</TableCaption>
  <TableScrollArea>
    <TableHeader>
      <TableRow>
        <TableColumnHeader>Invoice</TableColumnHeader>
        <TableColumnHeader>Status</TableColumnHeader>
        <TableColumnHeader numeric>Amount</TableColumnHeader>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>INV-001</TableCell>
        <TableCell>Paid</TableCell>
        <TableCell numeric>$250.00</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>INV-002</TableCell>
        <TableCell>Pending</TableCell>
        <TableCell numeric>$150.00</TableCell>
      </TableRow>
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colspan={2}>Total</TableCell>
        <TableCell numeric>$400.00</TableCell>
      </TableRow>
    </TableFooter>
  </TableScrollArea>
</Table>
