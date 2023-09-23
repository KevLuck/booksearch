import React, { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row,
} from 'react-bootstrap';
import { useLazyQuery, useMutation } from '@apollo/client';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import { SAVE_BOOK } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';

const SearchBooks = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [searchGoogleBooksQuery, { data: googleBooksData, loading: googleBooksLoading, error: googleBooksError }] = useLazyQuery(
    SEARCH_GOOGLE_BOOKS_QUERY,
    {
      variables: {
        query: searchInput,
      },
    }
  );

  const [saveBookMutation, { loading: saveBookLoading, error: saveBookError }] = useMutation(SAVE_BOOK);

  useEffect(() => {
    saveBookIds(savedBookIds);
  }, [savedBookIds]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return;
    }

    try {
      await searchGoogleBooksQuery();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    try {
      await saveBookMutation({
        variables: {
          id: userData._id,
          bookToSave,
        },
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await useQuery(QUERY_ME);
        setUserData(data.me || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading || googleBooksLoading) {
    return <h2>LOADING...</h2>;
  }

  if (error || googleBooksError) {
    return <div>Error: {error || googleBooksError}</div>;
  }

  if (!userData) {
    return <div>Error: No user data found</div>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) :
