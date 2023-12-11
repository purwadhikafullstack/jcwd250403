import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Heading,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
import UserLayout from '../components/UserLayout';
import api from '../api';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';

function UserOrderList() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [currentSort, setCurrentSort] = useState('id');
  const [currentStatus, setCurrentStatus] = useState('');

  const [date, setDate] = useState(new Date());

  const token = useSelector((state) => state.auth.token);
  const payload = jwtDecode(token);

  const handleChangeStatus = (e) => {
    const newValue = e.target.value;
    setCurrentStatus(newValue);
    setCurrentPage(1);
  };

  const handleChangeSort = (e) => {
    const newValue = e.target.value;
    setCurrentSort(newValue);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (totalPage > currentPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    const getOrders = async () => {
      const { data } = await api.get(`/orders/user/${payload.id}`, {
        params: {
          page: currentPage,
          sort: currentSort,
          status: currentStatus,
          date,
        },
      });
      setOrders(data.data);
      setTotalPage(Math.ceil(data.count / 5));
    };
    getOrders();
  }, [payload.id, currentPage, currentSort, currentStatus, date]);

  return (
    <UserLayout>
      <Heading ml={2} mb={4}>
        Your orders
      </Heading>

      <Flex
        gap={4}
        p={4}
        boxShadow="md"
        bg="gray.50"
        mb={6}
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <FormControl>
          <FormLabel>Date range</FormLabel>
          <SingleDatepicker
            date={date}
            onDateChange={setDate}
            configs={{ dateFormat: 'd MMM yyyy' }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Order status</FormLabel>
          <Select value={currentStatus} onChange={handleChangeStatus}>
            <option value="" defaultValue></option>
            <option value="Pending">Pending</option>
            <option value="Waiting">Waiting</option>
            <option value="Success">Success</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Order ID</FormLabel>
          <Input />
        </FormControl>

        <FormControl>
          <FormLabel>Sort by</FormLabel>
          <Select value={currentSort} onChange={handleChangeSort}>
            <option value="id" defaultValue>
              Invoice ID
            </option>
            <option value="startDate">Date</option>
          </Select>
        </FormControl>
      </Flex>

      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Invoice ID</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.length === 0 ? (
              <Tr>
                <Td>No orders yet</Td>
              </Tr>
            ) : (
              orders.map((order) => (
                <Tr key={order.id}>
                  <Td>{order.id}</Td>
                  <Td>
                    {format(new Date(order.startDate), 'd MMM yyyy')} -{' '}
                    {format(new Date(order.endDate), 'd MMM yyyy')}
                  </Td>
                  <Td>
                    <Badge colorScheme="yellow">{order.status}</Badge>
                  </Td>
                  <Td isNumeric>
                    <Button>View</Button>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex justifyContent="center" alignItems="center" mt={6}>
        <Button onClick={() => handlePrevPage()}>{'<'}</Button>
        <Text mx="2">
          {currentPage} of {totalPage === 0 ? 1 : totalPage}
        </Text>
        <Button onClick={() => handleNextPage()}>{'>'}</Button>
      </Flex>
    </UserLayout>
  );
}

export default UserOrderList;
