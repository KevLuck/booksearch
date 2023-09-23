import { useMemo } from 'react';

export function useSavedBookIds() {
  const savedBookIds = useMemo(() => {
    const savedBookIdsFromLocalStorage = localStorage.getItem('saved_books');
    if (savedBookIdsFromLocalStorage) {
      return JSON.parse(savedBookIdsFromLocalStorage);
    } else {
      return [];
    }
  }, []);

  return savedBookIds;
}

export function saveBookIds(bookIdArr) {
  if (bookIdArr.length) {
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem('saved_books');
  }
}

export function removeBookId(bookId) {
  const savedBookIds = useSavedBookIds();

  if (!savedBookIds) {
    return false;
  }

  const updatedSavedBookIds = savedBookIds.filter((savedBookId) => savedBookId !== bookId);
  saveBookIds(updatedSavedBookIds);

  return true;
}
